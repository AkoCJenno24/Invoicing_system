import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CompanySettings, Invoice, InvoiceStatus } from '@/types/invoice'
import {
  loadInvoices,
  loadSettings,
  saveInvoices,
  saveSettings,
  seedSampleData,
} from '@/lib/storage'

interface InvoiceContextValue {
  invoices: Invoice[]
  settings: CompanySettings
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoice: Invoice) => void
  deleteInvoice: (id: string) => void
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void
  updateSettings: (settings: CompanySettings) => void
  getNextInvoiceNumber: () => string
  incrementInvoiceNumber: () => void
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null)

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [settings, setSettings] = useState<CompanySettings>(loadSettings())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedSampleData()
    setInvoices(loadInvoices())
    setSettings(loadSettings())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveInvoices(invoices)
  }, [invoices, ready])

  useEffect(() => {
    if (ready) saveSettings(settings)
  }, [settings, ready])

  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev])
  }, [])

  const updateInvoice = useCallback((invoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === invoice.id ? invoice : item)),
    )
  }, [])

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
  }, [])

  const updateSettings = useCallback((next: CompanySettings) => {
    setSettings(next)
  }, [])

  const getNextInvoiceNumber = useCallback(() => {
    return `${settings.invoicePrefix}-${settings.nextInvoiceNumber}`
  }, [settings.invoicePrefix, settings.nextInvoiceNumber])

  const incrementInvoiceNumber = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      nextInvoiceNumber: prev.nextInvoiceNumber + 1,
    }))
  }, [])

  const value = useMemo(
    () => ({
      invoices,
      settings,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      updateInvoiceStatus,
      updateSettings,
      getNextInvoiceNumber,
      incrementInvoiceNumber,
    }),
    [
      invoices,
      settings,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      updateInvoiceStatus,
      updateSettings,
      getNextInvoiceNumber,
      incrementInvoiceNumber,
    ],
  )

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading invoicing system...</div>
      </div>
    )
  }

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider')
  }
  return context
}
