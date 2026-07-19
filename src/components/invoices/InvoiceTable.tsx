import { Link, useNavigate } from 'react-router-dom'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/invoices/StatusBadge'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import {
  calculateInvoiceTotals,
  formatCurrency,
  formatDate,
  getEffectiveStatus,
} from '@/lib/invoice-utils'
import { useInvoices } from '@/context/InvoiceContext'
import { useState } from 'react'

interface InvoiceTableProps {
  invoices: Invoice[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const navigate = useNavigate()
  const { settings, deleteInvoice, updateInvoiceStatus } = useInvoices()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function handleDelete() {
    if (!deleteId) return
    deleteInvoice(deleteId)
    toast.success('Invoice deleted')
    setDeleteId(null)
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    updateInvoiceStatus(id, status)
    toast.success(`Invoice marked as ${status}`)
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-medium">No invoices found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first invoice to get started.
        </p>
        <Link
          to="/invoices/new"
          className={cn(buttonVariants(), 'mt-4 inline-flex items-center')}
        >
          Create Invoice
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const status = getEffectiveStatus(invoice)
              const { total } = calculateInvoiceTotals(
                invoice.items,
                invoice.taxRate,
                invoice.discount,
              )

              return (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="font-medium hover:underline"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.client.name}</p>
                      {invoice.client.company && (
                        <p className="text-xs text-muted-foreground">
                          {invoice.client.company}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(total, settings.currency)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/invoices/${invoice.id}`)}>
                          <Eye className="size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(invoice.id, 'sent')}
                        >
                          Mark as Sent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(invoice.id, 'paid')}
                        >
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteId(invoice.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete invoice?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The invoice will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
