import type { CompanySettings, Invoice } from '@/types/invoice'

const INVOICES_KEY = 'invoicing-system:invoices'
const SETTINGS_KEY = 'invoicing-system:settings'

export const defaultSettings: CompanySettings = {
  name: 'Acme Studio',
  email: 'billing@acmestudio.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Ave, Suite 100',
  city: 'San Francisco, CA 94102',
  country: 'United States',
  taxId: 'US-123456789',
  logoUrl: '',
  currency: 'USD',
  taxRate: 10,
  invoicePrefix: 'INV',
  nextInvoiceNumber: 1001,
  paymentTermsDays: 30,
  bankDetails: 'Bank: First National\nAccount: 1234567890\nRouting: 987654321',
  notes: 'Thank you for your business. Payment is due within the specified terms.',
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadInvoices(): Invoice[] {
  return readJson<Invoice[]>(INVOICES_KEY, [])
}

export function saveInvoices(invoices: Invoice[]): void {
  writeJson(INVOICES_KEY, invoices)
}

export function loadSettings(): CompanySettings {
  return readJson(SETTINGS_KEY, defaultSettings)
}

export function saveSettings(settings: CompanySettings): void {
  writeJson(SETTINGS_KEY, settings)
}

export function seedSampleData(): void {
  if (loadInvoices().length > 0) return

  const now = new Date()
  const issueDate = now.toISOString().slice(0, 10)
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const sampleInvoices: Invoice[] = [
    {
      id: crypto.randomUUID(),
      invoiceNumber: 'INV-1001',
      status: 'paid',
      issueDate,
      dueDate,
      client: {
        name: 'Jane Cooper',
        email: 'jane@northwind.io',
        company: 'Northwind Traders',
        address: '45 Market Street',
        city: 'Seattle, WA',
        country: 'United States',
      },
      items: [
        {
          id: crypto.randomUUID(),
          description: 'Website redesign',
          quantity: 1,
          unitPrice: 4500,
        },
        {
          id: crypto.randomUUID(),
          description: 'Monthly maintenance',
          quantity: 3,
          unitPrice: 350,
        },
      ],
      taxRate: 10,
      discount: 0,
      notes: 'Paid via bank transfer.',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      invoiceNumber: 'INV-1002',
      status: 'sent',
      issueDate,
      dueDate,
      client: {
        name: 'Robert Fox',
        email: 'robert@contoso.com',
        company: 'Contoso Ltd',
        address: '88 Innovation Blvd',
        city: 'Austin, TX',
        country: 'United States',
      },
      items: [
        {
          id: crypto.randomUUID(),
          description: 'Brand identity package',
          quantity: 1,
          unitPrice: 2800,
        },
      ],
      taxRate: 10,
      discount: 5,
      notes: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      invoiceNumber: 'INV-1003',
      status: 'draft',
      issueDate,
      dueDate,
      client: {
        name: 'Esther Howard',
        email: 'esther@fabrikam.com',
        company: 'Fabrikam Inc',
        address: '12 Design Lane',
        city: 'Portland, OR',
        country: 'United States',
      },
      items: [
        {
          id: crypto.randomUUID(),
          description: 'UI/UX consultation',
          quantity: 8,
          unitPrice: 150,
        },
      ],
      taxRate: 10,
      discount: 0,
      notes: 'Draft — awaiting client approval.',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ]

  saveInvoices(sampleInvoices)

  const settings = loadSettings()
  saveSettings({ ...settings, nextInvoiceNumber: 1004 })
}
