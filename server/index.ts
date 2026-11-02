import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import PDFDocument from 'pdfkit'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { audit, db, nextReference } from './db.js'

const app = express()
const port = Number(process.env.PORT || 4174)
const host = process.env.HOST || '0.0.0.0'
const secret = process.env.JWT_SECRET || 'decm-local-development-secret-change-in-production'
const uploadDir = path.resolve('data/uploads')
fs.mkdirSync(uploadDir, { recursive: true })

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:4173' }))
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadDir))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false }))

type AuthUser = { id:number; email:string; role:string; name:string }
declare global { namespace Express { interface Request { user?: AuthUser } } }

function auth(req:express.Request,res:express.Response,next:express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ','')
  if (!token) return res.status(401).json({error:'Sign in is required.'})
  try { req.user = jwt.verify(token, secret) as AuthUser; next() } catch { return res.status(401).json({error:'Your session has expired. Please sign in again.'}) }
}
const roles = (...allowed:string[]) => (req:express.Request,res:express.Response,next:express.NextFunction) => allowed.includes(req.user?.role || '') ? next() : res.status(403).json({error:'Your role does not allow this action.'})
const safe = (fn:express.RequestHandler):express.RequestHandler => async (req,res,next) => { try { await fn(req,res,next) } catch (e) { next(e) } }

app.get('/api/health', (_req,res) => res.json({status:'ok', time:new Date().toISOString()}))
app.post('/api/auth/login', safe(async (req,res) => {
  const input = z.object({email:z.string().email(),password:z.string().min(8)}).parse(req.body)
  const user = db.prepare('SELECT * FROM users WHERE email=? AND active=1').get(input.email.toLowerCase()) as any
  if (!user || !bcrypt.compareSync(input.password,user.password_hash)) return res.status(401).json({error:'Email or password is incorrect.'})
  const profile = {id:user.id,name:user.name,email:user.email,role:user.role,organisation:user.organisation}
  const token = jwt.sign(profile,secret,{expiresIn:'8h'})
  audit(user.id,'login','session',undefined)
  res.json({token,user:profile})
}))
app.get('/api/me', auth, (req,res) => res.json(req.user))
app.post('/api/auth/change-password',auth,safe(async(req,res)=>{const x=z.object({current_password:z.string().min(8),new_password:z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)}).parse(req.body);const user=db.prepare('SELECT password_hash FROM users WHERE id=?').get(req.user!.id) as any;if(!bcrypt.compareSync(x.current_password,user.password_hash))return res.status(400).json({error:'The current password is incorrect.'});db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(bcrypt.hashSync(x.new_password,12),req.user!.id);audit(req.user!.id,'change_password','user',req.user!.id);res.json({ok:true})}))
app.post('/api/users',auth,roles('admin'),safe(async(req,res)=>{const x=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(12),role:z.enum(['admin','operations','procurement','finance','customer']),organisation:z.string().min(2).default('DECM Nexus')}).parse(req.body);const r=db.prepare('INSERT INTO users (name,email,password_hash,role,organisation) VALUES (?,?,?,?,?)').run(x.name,x.email.toLowerCase(),bcrypt.hashSync(x.password,12),x.role,x.organisation);audit(req.user!.id,'create','user',r.lastInsertRowid,{email:x.email,role:x.role});res.status(201).json({id:Number(r.lastInsertRowid)})}))

app.get('/api/dashboard', auth, safe(async (_req,res) => {
  const jobs = db.prepare('SELECT * FROM jobs ORDER BY id DESC').all()
  const openRequests = (db.prepare("SELECT COUNT(*) count FROM service_requests WHERE status NOT IN ('Converted','Cancelled')").get() as any).count
  const pendingInvoices = (db.prepare("SELECT COALESCE(SUM(amount),0) total FROM invoices WHERE status NOT IN ('Paid','Cancelled')").get() as any).total
  const actions = db.prepare("SELECT reference,client,status,promise FROM jobs WHERE status IN ('Exception','Awaiting pickup','At checkpoint') ORDER BY CASE status WHEN 'Exception' THEN 0 ELSE 1 END,id DESC LIMIT 5").all()
  res.json({jobs,openRequests,pendingInvoices,actions})
}))

const requestSchema = z.object({customer:z.string().min(2).max(120),contact_email:z.string().email().or(z.literal('')).optional(),service:z.string().min(2),origin:z.string().min(2),destination:z.string().min(2),details:z.string().max(2000).optional()})
app.get('/api/requests',auth,safe(async (_req,res)=>res.json(db.prepare('SELECT * FROM service_requests ORDER BY id DESC').all())))
app.post('/api/requests',auth,safe(async (req,res)=>{
  const x=requestSchema.parse(req.body); const reference=nextReference('SR','service_requests')
  const result=db.prepare('INSERT INTO service_requests (reference,customer,contact_email,service,origin,destination,details,created_by) VALUES (?,?,?,?,?,?,?,?)').run(reference,x.customer,x.contact_email||'',x.service,x.origin,x.destination,x.details||'',req.user!.id)
  audit(req.user!.id,'create','service_request',result.lastInsertRowid,x); res.status(201).json(db.prepare('SELECT * FROM service_requests WHERE id=?').get(result.lastInsertRowid))
}))
app.patch('/api/requests/:id/status',auth,roles('admin','operations'),safe(async(req,res)=>{
  const status=z.enum(['New','Quoted','Approved','Converted','Cancelled']).parse(req.body.status)
  db.prepare('UPDATE service_requests SET status=? WHERE id=?').run(status,req.params.id); audit(req.user!.id,'status','service_request',Number(req.params.id),{status}); res.json({ok:true})
}))

app.get('/api/quotations',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT q.*,r.customer,r.service FROM quotations q JOIN service_requests r ON r.id=q.request_id ORDER BY q.id DESC').all())))
app.post('/api/quotations',auth,roles('admin','operations','finance'),safe(async(req,res)=>{
  const x=z.object({request_id:z.coerce.number().int().positive(),amount:z.coerce.number().nonnegative(),valid_until:z.string().optional(),notes:z.string().max(1000).optional()}).parse(req.body)
  const reference=nextReference('QT','quotations'); const result=db.prepare('INSERT INTO quotations (reference,request_id,amount,valid_until,notes) VALUES (?,?,?,?,?)').run(reference,x.request_id,x.amount,x.valid_until||null,x.notes||'')
  db.prepare("UPDATE service_requests SET status='Quoted' WHERE id=?").run(x.request_id); audit(req.user!.id,'create','quotation',result.lastInsertRowid,x); res.status(201).json({id:Number(result.lastInsertRowid),reference})
}))
app.patch('/api/quotations/:id/status',auth,safe(async(req,res)=>{const status=z.enum(['Draft','Sent','Approved','Rejected','Expired']).parse(req.body.status); db.prepare('UPDATE quotations SET status=? WHERE id=?').run(status,req.params.id); audit(req.user!.id,'status','quotation',Number(req.params.id),{status}); res.json({ok:true})}))

app.get('/api/jobs',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT * FROM jobs ORDER BY id DESC').all())))
app.post('/api/jobs',auth,roles('admin','operations'),safe(async(req,res)=>{
  const x=z.object({request_id:z.coerce.number().optional(),client:z.string().min(2),service:z.string().min(2),origin:z.string().min(2),destination:z.string().min(2),owner:z.string().optional(),promise:z.string().optional(),value:z.coerce.number().nonnegative().default(0)}).parse(req.body)
  const reference=nextReference('NX','jobs'); const r=db.prepare('INSERT INTO jobs (reference,request_id,client,service,origin,destination,owner,promise,value) VALUES (?,?,?,?,?,?,?,?,?)').run(reference,x.request_id||null,x.client,x.service,x.origin,x.destination,x.owner||'Unassigned',x.promise||'Scheduling',x.value)
  if(x.request_id) db.prepare("UPDATE service_requests SET status='Converted' WHERE id=?").run(x.request_id)
  audit(req.user!.id,'create','job',r.lastInsertRowid,x); res.status(201).json(db.prepare('SELECT * FROM jobs WHERE id=?').get(r.lastInsertRowid))
}))
app.patch('/api/jobs/:id',auth,roles('admin','operations'),safe(async(req,res)=>{
  const x=z.object({status:z.enum(['Awaiting pickup','In transit','At checkpoint','Delivered','Exception']).optional(),owner:z.string().max(120).optional(),promise:z.string().max(120).optional(),value:z.coerce.number().nonnegative().optional(),cost:z.coerce.number().nonnegative().optional()}).parse(req.body)
  const fields=Object.keys(x); if(!fields.length) return res.status(400).json({error:'No changes were supplied.'})
  db.prepare(`UPDATE jobs SET ${fields.map(k=>`${k}=?`).join(',')} WHERE id=?`).run(...fields.map(k=>(x as any)[k]),req.params.id)
  if(x.status) db.prepare('INSERT INTO job_events (job_id,event_type,description,created_by) VALUES (?,?,?,?)').run(req.params.id,'status',`Status changed to ${x.status}`,req.user!.id)
  audit(req.user!.id,'update','job',Number(req.params.id),x); res.json(db.prepare('SELECT * FROM jobs WHERE id=?').get(req.params.id))
}))
app.get('/api/jobs/:id/events',auth,safe(async(req,res)=>res.json(db.prepare('SELECT * FROM job_events WHERE job_id=? ORDER BY id DESC').all(req.params.id))))
app.post('/api/jobs/:id/events',auth,roles('admin','operations'),safe(async(req,res)=>{const x=z.object({event_type:z.string().min(2),description:z.string().min(2).max(1000),location:z.string().max(200).optional()}).parse(req.body); const r=db.prepare('INSERT INTO job_events (job_id,event_type,description,location,created_by) VALUES (?,?,?,?,?)').run(req.params.id,x.event_type,x.description,x.location||'',req.user!.id); audit(req.user!.id,'create','job_event',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid)})}))

const storage=multer.diskStorage({destination:uploadDir,filename:(_req,file,cb)=>cb(null,`${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)})
const upload=multer({storage,limits:{fileSize:10*1024*1024},fileFilter:(_req,file,cb)=>cb(null,['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype))})
app.get('/api/documents/:entityType/:entityId',auth,safe(async(req,res)=>res.json(db.prepare('SELECT * FROM documents WHERE entity_type=? AND entity_id=? ORDER BY id DESC').all(req.params.entityType,req.params.entityId))))
app.post('/api/documents/:entityType/:entityId',auth,roles('admin','operations','procurement'),upload.single('file'),safe(async(req,res)=>{if(!req.file)return res.status(400).json({error:'Choose a supported document up to 10 MB.'}); const category=String(req.body.category||'General'); const r=db.prepare('INSERT INTO documents (entity_type,entity_id,category,original_name,stored_name,mime_type,size,uploaded_by) VALUES (?,?,?,?,?,?,?,?)').run(req.params.entityType,req.params.entityId,category,req.file.originalname,req.file.filename,req.file.mimetype,req.file.size,req.user!.id); audit(req.user!.id,'upload','document',r.lastInsertRowid,{category}); res.status(201).json({id:Number(r.lastInsertRowid)})}))

app.get('/api/suppliers',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT * FROM suppliers ORDER BY score DESC,name').all())))
app.post('/api/suppliers',auth,roles('admin','procurement'),safe(async(req,res)=>{const x=z.object({name:z.string().min(2),category:z.string().min(2),email:z.string().email().or(z.literal('')).optional(),phone:z.string().max(40).optional(),status:z.enum(['Provisional','Verified','Review due','Suspended']).default('Provisional')}).parse(req.body); const r=db.prepare('INSERT INTO suppliers (name,category,email,phone,status) VALUES (?,?,?,?,?)').run(x.name,x.category,x.email||'',x.phone||'',x.status); audit(req.user!.id,'create','supplier',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid)})}))
app.get('/api/transporters',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT * FROM transporters ORDER BY id DESC').all())))
app.post('/api/transporters',auth,roles('admin','operations'),safe(async(req,res)=>{const x=z.object({name:z.string().min(2),contact:z.string().max(120),vehicle_type:z.string().min(2),registration:z.string().min(2),insurance_expiry:z.string().optional()}).parse(req.body); const r=db.prepare('INSERT INTO transporters (name,contact,vehicle_type,registration,insurance_expiry) VALUES (?,?,?,?,?)').run(x.name,x.contact,x.vehicle_type,x.registration,x.insurance_expiry||null); audit(req.user!.id,'create','transporter',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid)})}))

app.get('/api/procurement',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT * FROM procurement_requests ORDER BY id DESC').all())))
app.post('/api/procurement',auth,roles('admin','procurement'),safe(async(req,res)=>{const x=z.object({requirement:z.string().min(2),client:z.string().min(2),amount:z.coerce.number().nonnegative(),due_date:z.string().optional()}).parse(req.body); const reference=nextReference('PR','procurement_requests'); const r=db.prepare('INSERT INTO procurement_requests (reference,requirement,client,amount,due_date,created_by) VALUES (?,?,?,?,?,?)').run(reference,x.requirement,x.client,x.amount,x.due_date||null,req.user!.id); audit(req.user!.id,'create','procurement',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid),reference})}))
app.patch('/api/procurement/:id/stage',auth,roles('admin','procurement'),safe(async(req,res)=>{const stage=z.enum(['Purchase request','RFQ issued','Bid comparison','Supplier awarded','Purchase order','Goods received','Closed']).parse(req.body.stage); db.prepare('UPDATE procurement_requests SET stage=? WHERE id=?').run(stage,req.params.id); audit(req.user!.id,'stage','procurement',Number(req.params.id),{stage}); res.json({ok:true})}))
app.get('/api/procurement/:id/bids',auth,safe(async(req,res)=>res.json(db.prepare('SELECT b.*,s.name supplier FROM bids b JOIN suppliers s ON s.id=b.supplier_id WHERE procurement_id=? ORDER BY amount').all(req.params.id))))
app.post('/api/procurement/:id/bids',auth,roles('admin','procurement'),safe(async(req,res)=>{const x=z.object({supplier_id:z.coerce.number(),amount:z.coerce.number().positive(),lead_days:z.coerce.number().nonnegative(),notes:z.string().max(1000).optional()}).parse(req.body); const r=db.prepare('INSERT INTO bids (procurement_id,supplier_id,amount,lead_days,notes) VALUES (?,?,?,?,?)').run(req.params.id,x.supplier_id,x.amount,x.lead_days,x.notes||''); audit(req.user!.id,'create','bid',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid)})}))

app.get('/api/expenses',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT e.*,j.reference job_reference FROM expenses e LEFT JOIN jobs j ON j.id=e.job_id ORDER BY e.id DESC').all())))
app.post('/api/expenses',auth,roles('admin','operations','finance'),safe(async(req,res)=>{const x=z.object({job_id:z.coerce.number().optional(),category:z.string().min(2),description:z.string().min(2),amount:z.coerce.number().positive(),spent_on:z.string().min(8)}).parse(req.body); const r=db.prepare('INSERT INTO expenses (job_id,category,description,amount,spent_on,created_by) VALUES (?,?,?,?,?,?)').run(x.job_id||null,x.category,x.description,x.amount,x.spent_on,req.user!.id); if(x.job_id)db.prepare('UPDATE jobs SET cost=cost+? WHERE id=?').run(x.amount,x.job_id); audit(req.user!.id,'create','expense',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid)})}))
app.get('/api/invoices',auth,safe(async(_req,res)=>res.json(db.prepare('SELECT * FROM invoices ORDER BY id DESC').all())))
app.post('/api/invoices',auth,roles('admin','finance'),safe(async(req,res)=>{const x=z.object({job_id:z.coerce.number().optional(),client:z.string().min(2),amount:z.coerce.number().positive(),due_date:z.string().optional()}).parse(req.body); const reference=nextReference('INV','invoices'); const r=db.prepare('INSERT INTO invoices (reference,job_id,client,amount,due_date) VALUES (?,?,?,?,?)').run(reference,x.job_id||null,x.client,x.amount,x.due_date||null); audit(req.user!.id,'create','invoice',r.lastInsertRowid,x); res.status(201).json({id:Number(r.lastInsertRowid),reference})}))
app.patch('/api/invoices/:id/status',auth,roles('admin','finance'),safe(async(req,res)=>{const status=z.enum(['Draft','Sent','Part paid','Paid','Overdue','Cancelled']).parse(req.body.status); db.prepare('UPDATE invoices SET status=? WHERE id=?').run(status,req.params.id); audit(req.user!.id,'status','invoice',Number(req.params.id),{status}); res.json({ok:true})}))

app.get('/api/notifications',auth,safe(async(req,res)=>res.json(db.prepare('SELECT * FROM notifications WHERE user_id IS NULL OR user_id=? ORDER BY id DESC LIMIT 50').all(req.user!.id))))
app.patch('/api/notifications/:id/read',auth,safe(async(req,res)=>{db.prepare('UPDATE notifications SET read=1 WHERE id=?').run(req.params.id); res.json({ok:true})}))
app.get('/api/audit',auth,roles('admin'),safe(async(_req,res)=>res.json(db.prepare('SELECT a.*,u.name user_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 200').all())))

app.get('/api/reports/summary',auth,safe(async(_req,res)=>{
  const summary=db.prepare('SELECT COUNT(*) jobs,COALESCE(SUM(value),0) revenue,COALESCE(SUM(cost),0) costs,COALESCE(SUM(value-cost),0) contribution FROM jobs').get()
  const byStatus=db.prepare('SELECT status,COUNT(*) count FROM jobs GROUP BY status').all(); const suppliers=db.prepare('SELECT name,score,status,orders FROM suppliers ORDER BY score DESC').all(); res.json({summary,byStatus,suppliers})
}))
app.get('/api/reports/operations.pdf',auth,safe(async(_req,res)=>{
  res.setHeader('Content-Type','application/pdf'); res.setHeader('Content-Disposition','attachment; filename="decm-operations-report.pdf"')
  const pdf=new PDFDocument({margin:50}); pdf.pipe(res); pdf.fontSize(20).text('DECM Nexus Operations Report'); pdf.moveDown().fontSize(10).fillColor('#6c7484').text(`Generated ${new Date().toLocaleString('en-NG')}`); pdf.moveDown().fillColor('#172033')
  const rows=db.prepare('SELECT reference,client,service,origin,destination,status,promise,value,cost FROM jobs ORDER BY id DESC').all() as any[]
  rows.forEach(j=>{pdf.fontSize(12).text(`${j.reference}  ${j.client}`,{continued:false}); pdf.fontSize(9).fillColor('#6c7484').text(`${j.service} · ${j.origin} to ${j.destination} · ${j.status} · ${j.promise}`); pdf.fillColor('#172033').text(`Value: NGN ${Number(j.value).toLocaleString()}  Cost: NGN ${Number(j.cost).toLocaleString()}  Contribution: NGN ${(j.value-j.cost).toLocaleString()}`); pdf.moveDown(.6)})
  pdf.end()
}))

const webDir = path.resolve('dist')
if (fs.existsSync(webDir)) {
  app.use(express.static(webDir))
  app.use((req,res,next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html')) {
      return res.sendFile(path.join(webDir,'index.html'))
    }
    next()
  })
}

app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  if(err instanceof z.ZodError)return res.status(400).json({error:'Check the highlighted information and try again.',issues:err.issues})
  if(err instanceof multer.MulterError)return res.status(400).json({error:err.code==='LIMIT_FILE_SIZE'?'The file is larger than 10 MB.':err.message})
  console.error(err); res.status(500).json({error:'The server could not complete this request.'})
})

if (process.env.NODE_ENV !== 'test') app.listen(port,host,()=>console.log(`DECM application ready on http://${host}:${port}`))
export default app
