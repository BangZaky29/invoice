import { useState, useEffect } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import InvoicePreview from './components/InvoicePreview'
import FloatingActionButton from './components/FloatingActionButton'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [activeView, setActiveView] = useState('form') // 'form' or 'preview'
  
  const [invoice, setInvoice] = useState({
    // Company Info
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    companyPhone: 'No. Telepon',
    
    // Invoice Details
    invoiceNumber: 'INV/2026/001',
    invoiceDate: new Date().toISOString().split('T')[0],
    
    // Client Info
    clientName: 'Nama Client',
    clientAddress: 'Alamat Client',
    
    // Products
    products: [
      { id: 1, name: 'Jasa Desain Website', description: 'Pembuatan landing page', quantity: 1, price: 2500000 }
    ],
    
    // Payment
    paymentMethod: 'Transfer Bank',
    notes: 'Pembayaran harus dilakukan maksimal 7 hari setelah invoice diterima.',
    
    // Signature & Stamp
    signature: null,
    stamp: null,
    signatureName: '',
  })

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setActiveView('form') // Reset view on desktop
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateInvoice = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addProduct = () => {
    setInvoice(prev => ({
      ...prev,
      products: [
        ...prev.products,
        { id: Date.now(), name: '', description: '', quantity: 1, price: 0 }
      ]
    }))
  }

  const updateProduct = (id, field, value) => {
    setInvoice(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }))
  }

  const removeProduct = (id) => {
    setInvoice(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-light-gray overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="relative">
            {activeView === 'form' && (
              <InputForm
                invoice={invoice}
                onUpdate={updateInvoice}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onRemoveProduct={removeProduct}
              />
            )}

            {activeView === 'preview' && (
              <div className="h-screen overflow-y-auto bg-gradient-soft p-4">
                <InvoicePreview
                  invoice={invoice}
                  onPrint={handlePrint}
                />
              </div>
            )}

            <FloatingActionButton
              activeView={activeView}
              onViewChange={setActiveView}
            />
          </div>
        ) : (
          // Desktop
          <div className="flex h-full gap-4 p-4">
            <div className="w-[45%] overflow-y-auto">
              <InputForm
                invoice={invoice}
                onUpdate={updateInvoice}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onRemoveProduct={removeProduct}
              />
            </div>
            <div className="w-[55%] overflow-y-auto bg-gradient-soft rounded-lg p-4">
              <InvoicePreview
                invoice={invoice}
                onPrint={handlePrint}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default App