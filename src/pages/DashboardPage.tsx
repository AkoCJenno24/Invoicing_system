import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvoices } from '@/context/InvoiceContext'
import { computeDashboardStats } from '@/lib/invoice-utils'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { invoices } = useInvoices()
  const stats = computeDashboardStats(invoices)
  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your invoicing activity
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

      <StatsCards stats={stats} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          <Link
            to="/invoices"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={recentInvoices} />
        </CardContent>
      </Card>
    </div>
  )
}
