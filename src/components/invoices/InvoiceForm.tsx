import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { LineItemsEditor } from '@/components/invoices/LineItemsEditor'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import {
  calculateInvoiceTotals,
  createEmptyClient,
  createEmptyLineItem,
  formatCurrency,
  generateId,
} from '@/lib/invoice-utils'
import { useInvoices } from '@/context/InvoiceContext'

interface InvoiceFormProps {
  initialInvoice?: Invoice
  mode: 'create' | 'edit'
}

export function InvoiceForm({ initialInvoice, mode }: InvoiceFormProps) {
  const navigate = useNavigate()
  const {
    settings,
    addInvoice,
    updateInvoice,
    getNextInvoiceNumber,
    incrementInvoiceNumber,
  } = useInvoices()

  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber ?? getNextInvoiceNumber(),
  )
  const [status, setStatus] = useState<InvoiceStatus>(
    initialInvoice?.status ?? 'draft',
  )
  const [issueDate, setIssueDate] = useState(
    initialInvoice?.issueDate ?? new Date().toISOString().slice(0, 10),
  )
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate ??
      new Date(Date.now() + settings.paymentTermsDays * 86400000)
        .toISOString()
        .slice(0, 10),
  )
  const [client, setClient] = useState(
    initialInvoice?.client ?? createEmptyClient(),
  )
  const [items, setItems] = useState(
    initialInvoice?.items ?? [createEmptyLineItem()],
  )
  const [taxRate, setTaxRate] = useState(
    initialInvoice?.taxRate ?? settings.taxRate,
  )
  const [discount, setDiscount] = useState(initialInvoice?.discount ?? 0)
  const [notes, setNotes] = useState(initialInvoice?.notes ?? '')

  const totals = useMemo(
    () => calculateInvoiceTotals(items, taxRate, discount),
    [items, taxRate, discount],
  )

  function updateClient(field: keyof typeof client, value: string) {
    setClient((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!client.name.trim()) {
      toast.error('Client name is required')
      return
    }

    if (items.some((item) => !item.description.trim())) {
      toast.error('All line items need a description')
      return
    }

    const now = new Date().toISOString()
    const invoice: Invoice = {
      id: initialInvoice?.id ?? generateId(),
      invoiceNumber,
      status,
      issueDate,
      dueDate,
      client,
      items,
      taxRate,
      discount,
      notes,
      createdAt: initialInvoice?.createdAt ?? now,
      updatedAt: now,
    }

    if (mode === 'create') {
      addInvoice(invoice)
      incrementInvoiceNumber()
      toast.success('Invoice created')
      navigate(`/invoices/${invoice.id}`)
    } else {
      updateInvoice(invoice)
      toast.success('Invoice updated')
      navigate(`/invoices/${invoice.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to {mode === 'create' ? 'create' : 'update'} an invoice.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as InvoiceStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={client.email}
                  onChange={(e) => updateClient('email', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientCompany">Company</Label>
                <Input
                  id="clientCompany"
                  value={client.company}
                  onChange={(e) => updateClient('company', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientAddress">Address</Label>
                <Input
                  id="clientAddress"
                  value={client.address}
                  onChange={(e) => updateClient('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCity">City / State</Label>
                <Input
                  id="clientCity"
                  value={client.city}
                  onChange={(e) => updateClient('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCountry">Country</Label>
                <Input
                  id="clientCountry"
                  value={client.country}
                  onChange={(e) => updateClient('country', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <LineItemsEditor items={items} onChange={setItems} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment instructions or additional notes..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal, settings.currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Discount ({discount}%)
                    </span>
                    <span>
                      -{formatCurrency(totals.discountAmount, settings.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span>{formatCurrency(totals.taxAmount, settings.currency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total, settings.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
