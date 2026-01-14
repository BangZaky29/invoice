import { useState } from 'react'
import { Printer, Download } from 'lucide-react'
import { downloadPDF, generateFileName } from '../utils/downloadPDF'

export default function InvoicePreview({ invoice, onPrint }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const subtotal = invoice.products.reduce((sum, p) => sum + (p.quantity * p.price), 0)
  const tax = Math.round(subtotal * 0.11) // 10% tax
  const total = subtotal + tax

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const fileName = generateFileName(invoice.invoiceNumber)
      const result = await downloadPDF(invoice, fileName)
      
      if (result.success) {
        console.log('PDF downloaded:', fileName)
      } else {
        alert('Error: ' + result.message)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Gagal mendownload PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Preview Actions */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border-gray rounded-lg text-sm font-medium text-gray-700 hover:bg-light-gray transition-colors"
        >
          <Printer className="w-4 h-4" />
          Cetak / PDF
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/60 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Invoice Container */}
      <div className="invoice-container">
        {/* Header */}
        <div className="invoice-header flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-accent-blue mb-1">
              {invoice.companyName}
            </h2>
            <p className="text-xs text-gray-600">{invoice.companyAddress}</p>
            <p className="text-xs text-gray-600">{invoice.companyPhone}</p>
          </div>
          <div className="text-right">
            <div className="invoice-title">INVOICE</div>
            <div className="mt-2 space-y-1 text-xs">
              <p><span className="font-semibold">Referensi:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-semibold">Tanggal:</span> {formatDate(invoice.invoiceDate)}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border-l-4 border-accent-blue pl-4">
            <h3 className="text-xs font-semibold text-accent-blue mb-2 uppercase">Tagihan Untuk</h3>
            <p className="text-sm font-medium text-gray-900">{invoice.clientName}</p>
            <p className="text-xs text-gray-600 mt-1">{invoice.clientAddress}</p>
          </div>
          <div className="border-l-4 border-pastel-blue pl-4">
            <h3 className="text-xs font-semibold text-accent-blue mb-2 uppercase">Info Invoice</h3>
            <p className="text-xs text-gray-600"><span className="font-semibold">No:</span> {invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-600"><span className="font-semibold">Tanggal:</span> {formatDate(invoice.invoiceDate)}</p>
          </div>
        </div>

        {/* Products Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th className="text-left">Deskripsi</th>
              <th className="text-right w-16">QTY</th>
              <th className="text-right w-24">Harga</th>
              <th className="text-right w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product, idx) => (
              <tr key={idx}>
                <td>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                </td>
                <td className="text-right">{product.quantity}</td>
                <td className="text-right">{formatCurrency(product.price)}</td>
                <td className="text-right font-medium text-accent-blue">
                  {formatCurrency(product.quantity * product.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-border-gray">
              <span className="text-sm text-gray-700">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-gray">
              <span className="text-sm text-gray-700">Pajak (11%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-gradient-soft rounded-lg px-3">
              <span className="font-semibold text-accent-blue">Total</span>
              <span className="font-bold text-lg text-accent-blue">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="mt-8 pt-8 border-t border-border-gray space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-accent-blue mb-1 uppercase">Metode Pembayaran</h4>
            <p className="text-sm text-gray-900">{invoice.paymentMethod}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-accent-blue mb-1 uppercase">Catatan</h4>
            <p className="text-xs text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        </div>

        {/* Signature & Stamp */}
            <div className="invoice-footer">
            <div className="invoice-signature relative">
                {/* Stamp */}
                {invoice.stamp && (
                <img
                    src={invoice.stamp}
                    alt="Stamp"
                    className="absolute top-0 left-1/2 transform -translate-x-1 w-20 h-20 opacity-100 pointer-events-none"
                />
                )}

                {/* Signature */}
                {invoice.signature ? (
                <img
                    src={invoice.signature}
                    alt="Signature"
                    className="h-16 mx-auto mb-2 relative z-10"
                />
                ) : (
                <div className="h-16 mb-2 relative z-10" />
                )}

                <p className="text-xs font-medium text-gray-900 relative z-10">
                ({invoice.signatureName || 'Agus Salim'})
                </p>
                <p className="text-xs text-gray-600 relative z-10">
                {invoice.signaturePosition || 'Manager / Finance'}
                </p>
            </div>
            </div>



        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border-gray text-center text-xs text-gray-500">
          <p>Terima kasih telah berbisnis dengan kami</p>
        </div>
      </div>
    </div>
  )
}