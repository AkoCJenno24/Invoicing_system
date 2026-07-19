import { NavLink, Outlet } from 'react-router-dom'
import {
  FileText,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useInvoices } from '@/context/InvoiceContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const { settings } = useInvoices()

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Receipt className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold leading-none">{settings.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">Invoicing</p>
          </div>
        </div>

        <Separator />

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <NavLink
            to="/invoices/new"
            className={cn(buttonVariants(), 'inline-flex w-full items-center justify-center gap-1.5')}
          >
            <Plus className="size-4" />
            New Invoice
          </NavLink>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-8">
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              <span className="font-semibold">{settings.name}</span>
            </div>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            Manage invoices, clients, and payments
          </div>
          <NavLink
            to="/invoices/new"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'inline-flex items-center gap-1.5 md:hidden',
            )}
          >
            <Plus className="size-4" />
            New
          </NavLink>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
