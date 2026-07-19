import { Navigate, useParams } from 'react-router-dom'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { useInvoices } from '@/context/InvoiceContext'

export function EditInvoicePage() {
  const { id } = useParams()
  const { invoices } = useInvoices()
  const invoice = invoices.find((item) => item.id === id)

  if (!invoice) {
    return <Navigate to="/invoices" replace />
  }

  return <InvoiceForm mode="edit" initialInvoice={invoice} />
}
