export type JobStatus = 'Awaiting pickup' | 'In transit' | 'At checkpoint' | 'Delivered' | 'Exception'

export interface Job {
  id: string
  client: string
  service: string
  route: string
  status: JobStatus
  owner: string
  due: string
  value: number
  cost: number
}

export const jobs: Job[] = [
  { id: 'NX-24018', client: 'Aster Medical', service: 'Procurement + delivery', route: 'Lagos → Abuja', status: 'In transit', owner: 'T. Adeyemi', due: 'Today, 16:30', value: 4850000, cost: 3720000 },
  { id: 'NX-24017', client: 'BuildCore Projects', service: 'Heavy equipment logistics', route: 'Apapa → Ibadan', status: 'At checkpoint', owner: 'K. Mensah', due: 'Today, 18:00', value: 1680000, cost: 1190000 },
  { id: 'NX-24016', client: 'ReliefBridge Africa', service: 'Humanitarian distribution', route: 'Kano → Katsina', status: 'Exception', owner: 'I. Bello', due: 'Overdue 2h', value: 2950000, cost: 2310000 },
  { id: 'NX-24015', client: 'Northstar Retail', service: 'Regional distribution', route: 'Lagos → Benin City', status: 'Awaiting pickup', owner: 'S. Okafor', due: 'Tomorrow, 09:00', value: 920000, cost: 610000 },
  { id: 'NX-24014', client: 'Helio Schools', service: 'Office procurement', route: 'Ikeja → Lekki', status: 'Delivered', owner: 'T. Adeyemi', due: 'Delivered 10:42', value: 740000, cost: 548000 },
]

export const suppliers = [
  { name: 'Atlas Industrial Supply', category: 'Equipment', score: 92, orders: 18, status: 'Verified' },
  { name: 'MedAxis Wholesale', category: 'Medical supplies', score: 88, orders: 11, status: 'Verified' },
  { name: 'Coastal Fleet Partners', category: 'Transport', score: 81, orders: 27, status: 'Review due' },
  { name: 'Prime Office Source', category: 'General supplies', score: 76, orders: 8, status: 'Provisional' },
]

export const procurement = [
  { id: 'PR-1048', request: 'Solar cold-chain equipment', client: 'Aster Medical', stage: 'Bid comparison', amount: 12300000, due: '30 Oct' },
  { id: 'PR-1047', request: 'Relief hygiene kits × 800', client: 'ReliefBridge Africa', stage: 'Supplier awarded', amount: 8640000, due: '01 Nov' },
  { id: 'PR-1046', request: 'Classroom furniture', client: 'Helio Schools', stage: 'Goods received', amount: 4920000, due: 'Completed' },
]
