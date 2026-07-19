import { format, parseISO, isBefore, startOfDay } from 'date-fns'
import type {
  DashboardStats,
  Invoice,
  InvoiceStatus,
  InvoiceTotals,
  LineItem,
} from '@/types/invoice'

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy')
}

export function calculateLineTotal(item: LineItem): number {
  return item.quantity * item.unitPrice
}

export function calculateInvoiceTotals(
  items: LineItem[],
  taxRate: number,
  discount: number,
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0)
  const discountAmount = subtotal * (discount / 100)
  const taxable = subtotal - discountAmount
  const taxAmount = taxable * (taxRate / 100)
  const total = taxable + taxAmount

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  }
}

export function getEffectiveStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') {
    return invoice.status
  }

  const today = startOfDay(new Date())
  const dueDate = startOfDay(parseISO(invoice.dueDate))

  if (isBefore(dueDate, today) && invoice.status !== 'draft') {
    return 'overdue'
  }

  return invoice.status
}

export function getStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function computeDashboardStats(invoices: Invoice[]): DashboardStats {
  let totalRevenue = 0
  let pendingAmount = 0
  let overdueAmount = 0
  let paidCount = 0
  let draftCount = 0
  let sentCount = 0
  let overdueCount = 0

  for (const invoice of invoices) {
    const status = getEffectiveStatus(invoice)
    const { total } = calculateInvoiceTotals(
      invoice.items,
      invoice.taxRate,
      invoice.discount,
    )

    if (status === 'paid') {
      totalRevenue += total
      paidCount += 1
    } else if (status === 'draft') {
      draftCount += 1
    } else if (status === 'overdue') {
      overdueAmount += total
      overdueCount += 1
    } else if (status === 'sent') {
      pendingAmount += total
      sentCount += 1
    }
  }

  return {
    totalRevenue,
    pendingAmount,
    overdueAmount,
    paidCount,
    draftCount,
    sentCount,
    overdueCount,
    totalInvoices: invoices.length,
  }
}

export function createEmptyLineItem(): LineItem {
  return {
    id: generateId(),
    description: '',
    quantity: 1,
    unitPrice: 0,
  }
}

export function createEmptyClient() {
  return {
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    country: '',
  }
}
