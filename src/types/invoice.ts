export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface ClientInfo {
  name: string
  email: string
  company: string
  address: string
  city: string
  country: string
}

export interface CompanySettings {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  taxId: string
  logoUrl: string
  currency: string
  taxRate: number
  invoicePrefix: string
  nextInvoiceNumber: number
  paymentTermsDays: number
  bankDetails: string
  notes: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  client: ClientInfo
  items: LineItem[]
  taxRate: number
  discount: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceTotals {
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

export interface DashboardStats {
  totalRevenue: number
  pendingAmount: number
  overdueAmount: number
  paidCount: number
  draftCount: number
  sentCount: number
  overdueCount: number
  totalInvoices: number
}
