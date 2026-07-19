import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInvoices } from '@/context/InvoiceContext'
import { getEffectiveStatus } from '@/lib/invoice-utils'
import type { InvoiceStatus } from '@/types/invoice'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function InvoicesPage() {
  const { invoices } = useInvoices()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((invoice) => {
        const status = getEffectiveStatus(invoice)
        if (statusFilter !== 'all' && status !== statusFilter) return false

        const query = search.toLowerCase().trim()
        if (!query) return true

        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.client.name.toLowerCase().includes(query) ||
          invoice.client.company.toLowerCase().includes(query) ||
          invoice.client.email.toLowerCase().includes(query)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
  }, [invoices, search, statusFilter])

  const counts = useMemo(() => {
    const result = {
      all: invoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0,
    }

    for (const invoice of invoices) {
      const status = getEffectiveStatus(invoice)
      result[status] += 1
    }

    return result
  }, [invoices])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all your invoices
          </p>
        </div>
        <Link
          to="/invoices/new"
          className={cn(buttonVariants(), 'inline-flex items-center gap-1.5')}
        >
          <Plus className="size-4" />
          New Invoice
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number, client, or email..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as 'all' | InvoiceStatus)
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({counts.sent})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({counts.paid})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({counts.overdue})</TabsTrigger>
        </TabsList>

        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <InvoiceTable
              invoices={
                tab === 'all'
                  ? filteredInvoices
                  : filteredInvoices.filter(
                      (invoice) => getEffectiveStatus(invoice) === tab,
                    )
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
