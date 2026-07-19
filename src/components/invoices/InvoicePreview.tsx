import type { Invoice } from '@/types/invoice'
import {
  calculateInvoiceTotals,
  calculateLineTotal,
  formatCurrency,
  formatDate,
  getEffectiveStatus,
} from '@/lib/invoice-utils'
import { useInvoices } from '@/context/InvoiceContext'
import { StatusBadge } from '@/components/invoices/StatusBadge'
import { Separator } from '@/components/ui/separator'

interface InvoicePreviewProps {
  invoice: Invoice
  className?: string
}

export function InvoicePreview({ invoice, className }: InvoicePreviewProps) {
  const { settings } = useInvoices()
  const status = getEffectiveStatus(invoice)
  const totals = calculateInvoiceTotals(
    invoice.items,
    invoice.taxRate,
    invoice.discount,
  )

  return (
    <div className={className}>
      <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold">{settings.name}</h2>
          <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
            <p>{settings.email}</p>
            <p>{settings.phone}</p>
            <p>{settings.address}</p>
            <p>{settings.city}</p>
            {settings.taxId && <p>Tax ID: {settings.taxId}</p>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold tracking-tight">INVOICE</div>
          <p className="mt-1 text-lg font-medium">{invoice.invoiceNumber}</p>
          <div className="mt-3">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bill To
          </p>
          <p className="font-semibold">{invoice.client.name}</p>
          {invoice.client.company && (
            <p className="text-sm text-muted-foreground">{invoice.client.company}</p>
          )}
          {invoice.client.email && (
            <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
          )}
          {invoice.client.address && (
            <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
          )}
          {invoice.client.city && (
            <p className="text-sm text-muted-foreground">{invoice.client.city}</p>
          )}
          {invoice.client.country && (
            <p className="text-sm text-muted-foreground">{invoice.client.country}</p>
          )}
        </div>

        <div className="sm:text-right">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between sm:justify-end sm:gap-8">
              <span className="text-muted-foreground">Issue Date</span>
              <span className="font-medium">{formatDate(invoice.issueDate)}</span>
            </div>
            <div className="flex justify-between sm:justify-end sm:gap-8">
              <span className="text-muted-foreground">Due Date</span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Unit Price</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(item.unitPrice, settings.currency)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(calculateLineTotal(item), settings.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="max-w-md space-y-4 text-sm">
          {invoice.notes && (
            <div>
              <p className="mb-1 font-semibold">Notes</p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {invoice.notes}
              </p>
            </div>
          )}
          {settings.bankDetails && (
            <div>
              <p className="mb-1 font-semibold">Payment Details</p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {settings.bankDetails}
              </p>
            </div>
          )}
        </div>

        <div className="w-full max-w-xs space-y-2 text-sm sm:w-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal, settings.currency)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount ({invoice.discount}%)
              </span>
              <span>
                -{formatCurrency(totals.discountAmount, settings.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
            <span>{formatCurrency(totals.taxAmount, settings.currency)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total Due</span>
            <span>{formatCurrency(totals.total, settings.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
