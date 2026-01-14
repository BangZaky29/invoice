import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import AccordionSection from './AccordionSection'
import ProductRow from './ProductRow'
import SignatureSection from './SignatureSection'

export default function InputForm({
  invoice,
  onUpdate,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct
}) {
  const [expanded, setExpanded] = useState({
    company: true,
    client: true,
    products: true,
    payment: true,
    signature: false
  })

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
      {/* 1. Info Perusahaan */}
      <AccordionSection
        title="1. Info Perusahaan"
        isOpen={expanded.company}
        onToggle={() => toggleSection('company')}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Perusahaan"
            value={invoice.companyName}
            onChange={(e) => onUpdate('companyName', e.target.value)}
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <input
            type="text"
            placeholder="Alamat Perusahaan"
            value={invoice.companyAddress}
            onChange={(e) => onUpdate('companyAddress', e.target.value)}
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <input
            type="text"
            placeholder="No. Telepon"
            value={invoice.companyPhone}
            onChange={(e) => onUpdate('companyPhone', e.target.value)}
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
      </AccordionSection>

      {/* Invoice Details - Inline */}
      <div className="bg-soft-blue rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-accent-blue">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="No. Invoice"
            value={invoice.invoiceNumber}
            onChange={(e) => onUpdate('invoiceNumber', e.target.value)}
            className="px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <input
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => onUpdate('invoiceDate', e.target.value)}
            className="px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
      </div>

      {/* 2. Tagihan Untuk */}
      <AccordionSection
        title="2. Tagihan Untuk"
        isOpen={expanded.client}
        onToggle={() => toggleSection('client')}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Client"
            value={invoice.clientName}
            onChange={(e) => onUpdate('clientName', e.target.value)}
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <textarea
            placeholder="Alamat Client"
            value={invoice.clientAddress}
            onChange={(e) => onUpdate('clientAddress', e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
      </AccordionSection>

      {/* 3. Produk / Jasa */}
      <AccordionSection
        title="3. Produk / Jasa"
        isOpen={expanded.products}
        onToggle={() => toggleSection('products')}
      >
        <div className="space-y-4">
          {invoice.products.map(product => (
            <ProductRow
              key={product.id}
              product={product}
              onUpdate={(field, value) => onUpdateProduct(product.id, field, value)}
              onRemove={() => onRemoveProduct(product.id)}
            />
          ))}
          <button
            onClick={onAddProduct}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-pastel-blue rounded-lg text-accent-blue font-medium hover:bg-soft-blue transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Produk
          </button>
        </div>
      </AccordionSection>

      {/* 4. Payment & Keterangan */}
      <AccordionSection
        title="4. Payment & Keterangan"
        isOpen={expanded.payment}
        onToggle={() => toggleSection('payment')}
      >
        <div className="space-y-4">
          <select
            value={invoice.paymentMethod}
            onChange={(e) => onUpdate('paymentMethod', e.target.value)}
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option>Transfer Bank</option>
            <option>Kartu Kredit</option>
            <option>E-Wallet</option>
            <option>Cash</option>
          </select>
          <textarea
            placeholder="Catatan / Keterangan"
            value={invoice.notes}
            onChange={(e) => onUpdate('notes', e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
      </AccordionSection>

      {/* 5. TTD & Stempel */}
      
      <AccordionSection
        title="5. TTD & Stempel"
        isOpen={expanded.signature}
        onToggle={() => toggleSection('signature')}
      >
        <SignatureSection
            signature={invoice.signature}
            stamp={invoice.stamp}
            signatureName={invoice.signatureName}
            signaturePosition={invoice.signaturePosition} // baru
            onSignatureChange={(sig) => onUpdate('signature', sig)}
            onStampChange={(stamp) => onUpdate('stamp', stamp)}
            onNameChange={(name) => onUpdate('signatureName', name)}
            onPositionChange={(pos) => onUpdate('signaturePosition', pos)} // baru
            />

      </AccordionSection>

      {/* Spacer */}
      <div className="h-24" />
    </div>
  )
}