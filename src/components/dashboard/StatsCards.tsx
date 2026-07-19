import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/types/invoice'
import { formatCurrency } from '@/lib/invoice-utils'
import { useInvoices } from '@/context/InvoiceContext'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { settings } = useInvoices()

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue, settings.currency),
      description: `${stats.paidCount} paid invoices`,
      icon: DollarSign,
    },
    {
      title: 'Pending',
      value: formatCurrency(stats.pendingAmount, settings.currency),
      description: `${stats.sentCount} awaiting payment`,
      icon: Clock3,
    },
    {
      title: 'Overdue',
      value: formatCurrency(stats.overdueAmount, settings.currency),
      description: `${stats.overdueCount} overdue invoices`,
      icon: AlertCircle,
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      description: `${stats.draftCount} drafts`,
      icon: FileText,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3" />
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
