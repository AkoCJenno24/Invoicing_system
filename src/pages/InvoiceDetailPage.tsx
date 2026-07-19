import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  Pencil,
  Printer,
  Send,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { InvoicePreview } from '@/components/invoices/InvoicePreview'
import { StatusBadge } from '@/components/invoices/StatusBadge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useInvoices } from '@/context/InvoiceContext'
import {
  calculateInvoiceTotals,
  formatCurrency,
  formatDate,
  getEffectiveStatus,
} from '@/lib/invoice-utils'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, settings, deleteInvoice, updateInvoiceStatus } =
    useInvoices()
  const [showDelete, setShowDelete] = useState(false)

  const invoice = invoices.find((item) => item.id === id)

  if (!invoice) {
    return <Navigate to="/invoices" replace />
  }

  const invoiceId = invoice.id
  const status = getEffectiveStatus(invoice)
  const totals = calculateInvoiceTotals(
    invoice.items,
    invoice.taxRate,
    invoice.discount,
  )

  function handlePrint() {
    window.print()
  }

  function handleDelete() {
    deleteInvoice(invoiceId)
    toast.success('Invoice deleted')
    navigate('/invoices')
  }

  function handleMarkPaid() {
    updateInvoiceStatus(invoiceId, 'paid')
    toast.success('Invoice marked as paid')
  }

  function handleMarkSent() {
    updateInvoiceStatus(invoiceId, 'sent')
    toast.success('Invoice marked as sent')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {invoice.invoiceNumber}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Issued {formatDate(invoice.issueDate)} · Due{' '}
            {formatDate(invoice.dueDate)} ·{' '}
            {formatCurrency(totals.total, settings.currency)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="size-4" />
            Print
          </Button>
          {status !== 'paid' && (
            <Button variant="outline" onClick={handleMarkSent}>
              <Send className="size-4" />
              Mark Sent
            </Button>
          )}
          {status !== 'paid' && (
            <Button variant="outline" onClick={handleMarkPaid}>
              <CheckCircle2 className="size-4" />
              Mark Paid
            </Button>
          )}
          <Link
            to={`/invoices/${invoice.id}/edit`}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'inline-flex items-center gap-1.5',
            )}
          >
            <Pencil className="size-4" />
            Edit
          </Link>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="print-area print:border-none print:shadow-none">
        <CardContent className="p-6 md:p-10">
          <InvoicePreview invoice={invoice} />
        </CardContent>
      </Card>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete invoice?</DialogTitle>
            <DialogDescription>
              This will permanently delete {invoice.invoiceNumber}. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
