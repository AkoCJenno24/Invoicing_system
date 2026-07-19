import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useInvoices } from '@/context/InvoiceContext'
import type { CompanySettings } from '@/types/invoice'

export function SettingsPage() {
  const { settings, updateSettings } = useInvoices()
  const [form, setForm] = useState<CompanySettings>(settings)

  function updateField<K extends keyof CompanySettings>(
    field: K,
    value: CompanySettings[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    updateSettings(form)
    toast.success('Settings saved')
  }

  function handleReset() {
    setForm(settings)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your company details and invoice defaults
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              This information appears on your invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City / State</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={form.taxId}
                onChange={(e) => updateField('taxId', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Defaults</CardTitle>
            <CardDescription>
              Default values applied when creating new invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.1"
                value={form.taxRate}
                onChange={(e) =>
                  updateField('taxRate', Number(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={form.invoicePrefix}
                onChange={(e) => updateField('invoicePrefix', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
              <Input
                id="nextInvoiceNumber"
                type="number"
                min="1"
                value={form.nextInvoiceNumber}
                onChange={(e) =>
                  updateField('nextInvoiceNumber', Number(e.target.value) || 1)
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="paymentTermsDays">Payment Terms (days)</Label>
              <Input
                id="paymentTermsDays"
                type="number"
                min="0"
                value={form.paymentTermsDays}
                onChange={(e) =>
                  updateField('paymentTermsDays', Number(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bankDetails">Payment / Bank Details</Label>
              <Textarea
                id="bankDetails"
                value={form.bankDetails}
                onChange={(e) => updateField('bankDetails', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Default Footer Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </div>
  )
}
