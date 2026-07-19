import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { InvoiceProvider } from '@/context/InvoiceContext'
import { CreateInvoicePage } from '@/pages/CreateInvoicePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EditInvoicePage } from '@/pages/EditInvoicePage'
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage'
import { InvoicesPage } from '@/pages/InvoicesPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <InvoiceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<CreateInvoicePage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="invoices/:id/edit" element={<EditInvoicePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </InvoiceProvider>
  )
}
