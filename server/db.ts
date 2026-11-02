import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'

const dataDir = path.resolve('data')
fs.mkdirSync(dataDir, { recursive: true })

export const db = new Database(process.env.DB_PATH || path.join(dataDir, 'decm.sqlite'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','operations','procurement','finance','customer')),
  organisation TEXT DEFAULT 'DECM Nexus',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  customer TEXT NOT NULL,
  contact_email TEXT,
  service TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(created_by) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  request_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'Draft',
  valid_until TEXT,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  request_id INTEGER,
  client TEXT NOT NULL,
  service TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Awaiting pickup',
  owner TEXT DEFAULT 'Unassigned',
  promise TEXT DEFAULT 'Scheduling',
  value REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(request_id) REFERENCES service_requests(id)
);
CREATE TABLE IF NOT EXISTS job_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT DEFAULT '',
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  job_id INTEGER,
  client TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  score INTEGER NOT NULL DEFAULT 70,
  status TEXT NOT NULL DEFAULT 'Provisional',
  orders INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transporters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT DEFAULT '',
  vehicle_type TEXT DEFAULT '',
  registration TEXT DEFAULT '',
  insurance_expiry TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  rating REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS procurement_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  requirement TEXT NOT NULL,
  client TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'Purchase request',
  due_date TEXT,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  procurement_id INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  lead_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Submitted',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(procurement_id) REFERENCES procurement_requests(id) ON DELETE CASCADE,
  FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
);
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  spent_on TEXT NOT NULL,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in-app',
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`)

const seedUser = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@decmnexus.com')
if (!seedUser) {
  db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)')
    .run('DECM Administrator', 'admin@decmnexus.com', bcrypt.hashSync('ChangeMe123!', 12), 'admin')
}

const count = (db.prepare('SELECT COUNT(*) as count FROM jobs').get() as {count:number}).count
const demoDisabled = db.prepare("SELECT value FROM app_meta WHERE key='demo_seed_disabled'").get() as {value:string}|undefined
if (!count && !demoDisabled && process.env.SEED_DEMO_DATA !== 'false') {
  const insertRequest = db.prepare('INSERT INTO service_requests (reference,customer,contact_email,service,origin,destination,details,status,created_by) VALUES (?,?,?,?,?,?,?,?,1)')
  const insertJob = db.prepare('INSERT INTO jobs (reference,request_id,client,service,origin,destination,status,owner,promise,value,cost) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
  const samples = [
    ['NX-24018','Aster Medical','Procurement + delivery','Lagos','Abuja','In transit','T. Adeyemi','Today, 16:30',4850000,3720000],
    ['NX-24017','BuildCore Projects','Heavy equipment logistics','Apapa','Ibadan','At checkpoint','K. Mensah','Today, 18:00',1680000,1190000],
    ['NX-24016','ReliefBridge Africa','Humanitarian distribution','Kano','Katsina','Exception','I. Bello','Overdue 2h',2950000,2310000],
    ['NX-24015','Northstar Retail','Regional distribution','Lagos','Benin City','Awaiting pickup','S. Okafor','Tomorrow, 09:00',920000,610000],
    ['NX-24014','Helio Schools','Office procurement','Ikeja','Lekki','Delivered','T. Adeyemi','Delivered 10:42',740000,548000],
  ]
  db.transaction(() => samples.forEach((j, i) => {
    const r = insertRequest.run(`SR-${1040+i}`, j[1], '', j[2], j[3], j[4], 'Seeded demonstration record', 'Approved')
    insertJob.run(j[0], r.lastInsertRowid, ...j.slice(1))
  }))()
  const supplier = db.prepare('INSERT INTO suppliers (name,category,email,score,status,orders) VALUES (?,?,?,?,?,?)')
  ;[['Atlas Industrial Supply','Equipment','orders@atlas.example',92,'Verified',18],['MedAxis Wholesale','Medical supplies','sales@medaxis.example',88,'Verified',11],['Coastal Fleet Partners','Transport','dispatch@coastal.example',81,'Review due',27],['Prime Office Source','General supplies','hello@prime.example',76,'Provisional',8]].forEach(x=>supplier.run(...x))
  const procurement = db.prepare('INSERT INTO procurement_requests (reference,requirement,client,amount,stage,due_date,created_by) VALUES (?,?,?,?,?,?,1)')
  ;[['PR-1048','Solar cold-chain equipment','Aster Medical',12300000,'Bid comparison','2026-10-30'],['PR-1047','Relief hygiene kits × 800','ReliefBridge Africa',8640000,'Supplier awarded','2026-11-01'],['PR-1046','Classroom furniture','Helio Schools',4920000,'Goods received','2026-10-28']].forEach(x=>procurement.run(...x))
}

export function audit(userId:number|undefined, action:string, entityType:string, entityId:number|bigint|undefined, details:unknown={}) {
  db.prepare('INSERT INTO audit_logs (user_id,action,entity_type,entity_id,details) VALUES (?,?,?,?,?)')
    .run(userId || null, action, entityType, entityId ? Number(entityId) : null, JSON.stringify(details))
}

export function nextReference(prefix:string, table:string) {
  const row = db.prepare(`SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`).get() as {id:number}|undefined
  return `${prefix}-${String((row?.id || 0) + 1001).padStart(4,'0')}`
}
