import { Badge } from '@/components/ui/badge'
import type { InvoiceStatus } from '@/types/invoice'
import { getStatusLabel } from '@/lib/invoice-utils'
import { cn } from '@/lib/utils'

const statusStyles: Record<InvoiceStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  cancelled: 'bg-muted text-muted-foreground',
}

export function StatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus
  className?: string
}) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status], className)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
