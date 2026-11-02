import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import fs from 'node:fs'
import path from 'node:path'

const testDb = path.resolve('data/test.sqlite')
for (const suffix of ['', '-shm', '-wal']) if (fs.existsSync(testDb + suffix)) fs.unlinkSync(testDb + suffix)
process.env.DB_PATH = testDb
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret'

let app: any
let token = ''

beforeAll(async () => {
  app = (await import('./index.js')).default
  const response = await request(app).post('/api/auth/login').send({ email: 'admin@decmnexus.com', password: 'ChangeMe123!' })
  token = response.body.token
})

describe('DECM Nexus API', () => {
  it('reports healthy', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('rejects protected records without a session', async () => {
    const response = await request(app).get('/api/jobs')
    expect(response.status).toBe(401)
  })

  it('authenticates the seeded administrator', async () => {
    expect(token).toBeTruthy()
  })

  it('creates and persists a service request', async () => {
    const created = await request(app).post('/api/requests').set('Authorization', `Bearer ${token}`).send({
      customer: 'API Test Customer', contact_email: 'test@example.com', service: 'Transport and distribution', origin: 'Lagos', destination: 'Abuja', details: 'Integration test record'
    })
    expect(created.status).toBe(201)
    expect(created.body.reference).toMatch(/^SR-/)
    const list = await request(app).get('/api/requests').set('Authorization', `Bearer ${token}`)
    expect(list.body.some((row:any) => row.customer === 'API Test Customer')).toBe(true)
  })

  it('validates malformed requests', async () => {
    const response = await request(app).post('/api/requests').set('Authorization', `Bearer ${token}`).send({ customer: 'x' })
    expect(response.status).toBe(400)
  })
})
