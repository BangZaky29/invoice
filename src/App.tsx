import React, { useState, useRef } from 'react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import InvoicePreview from './components/InvoicePreview';
import DownloadPDFButton from './components/DownloadPDFButton';
import MobileActionButton from './components/MobileActionButton';
import Toast from './components/Toast';
import { InvoiceData } from './types';

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Mobile View State ('form' or 'preview')
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [showToast, setShowToast] = useState(false);

  // Initial State
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    invoiceNumber: 'INV/2024/001',
    invoiceDate: new Date().toISOString().split('T')[0],
    clientName: '',
    clientAddress: '',
    items: [
      { id: '1', description: 'Jasa Desain Website', notes: 'Pembuatan landing page', qty: 1, price: 2500000 }
    ],
    // New Tax Settings Structure
    taxSettings: [
      { id: 'ppn', name: 'PPN', rate: 11, enabled: false },
      { id: 'pb1', name: 'PB 1', rate: 10, enabled: false },
      { id: 'pph', name: 'PPh UMKM', rate: 0.5, enabled: false },
      { id: 'manual', name: 'Lainnya', rate: 0, enabled: false }
    ],
    paymentMethod: 'Transfer Bank',
    accountNumber: '',
    accountName: 'PT Nuansa Solution', // Default Account Name
    amountPaid: 0,
    primaryColor: '#3B82F6',
    signatureImage: null,
    stampImage: null
  });

  const toggleMobileView = () => {
    setMobileView(prev => prev === 'form' ? 'preview' : 'form');
  };

  const handleDownloadSuccess = () => {
    setShowToast(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      
      <Toast 
        message="PDF berhasil didownload!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* UPDATE: Reduced padding on mobile (p-0 sm:p-6) to maximize space usage */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full p-0 sm:p-6 lg:p-8">
        
        {/* Header Actions - hidden on mobile preview to save space, visible on form */}
        <div className={`flex justify-between items-center mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0 ${mobileView === 'preview' ? 'hidden sm:flex' : 'flex'}`}>
           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
             <span className="lg:hidden">
               {mobileView === 'form' ? 'Edit Invoice' : 'Preview'}
             </span>
             <span className="hidden lg:inline">Dashboard</span>
           </h2>
           {/* Desktop / Form View Button */}
           <DownloadPDFButton 
             targetRef={previewRef} 
             fileName={`Invoice-${invoiceData.invoiceNumber.replace(/\//g, '-')}`} 
             onSuccess={handleDownloadSuccess}
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">
          {/* Left Column: Form Input */}
          <div className={`${mobileView === 'form' ? 'block' : 'hidden'} lg:block lg:col-span-5 space-y-6 px-4 sm:px-0 pb-24 sm:pb-0`}>
             <div className="lg:sticky lg:top-24">
                <FormInput data={invoiceData} onChange={setInvoiceData} />
             </div>
          </div>

          {/* Right Column: Preview */}
          {/* UPDATE: Removed padding on mobile container */}
          <div className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block lg:col-span-7 relative`}>
             
             {/* NEW: Floating Download Button for Mobile Preview */}
             <div className="lg:hidden fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <DownloadPDFButton 
                  targetRef={previewRef} 
                  fileName={`Invoice-${invoiceData.invoiceNumber.replace(/\//g, '-')}`} 
                  onSuccess={handleDownloadSuccess}
                  variant="fab"
                />
             </div>

             <div className="lg:sticky lg:top-24">
                <InvoicePreview data={invoiceData} previewRef={previewRef} />
             </div>
          </div>
        </div>
      </main>

      <MobileActionButton currentView={mobileView} onToggle={toggleMobileView} />
      
      {/* Footer only visible on desktop or form view to avoid cluttering preview */}
      <footer className={`bg-white border-t border-gray-200 py-6 mt-auto ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Invoice Generator. Built with React & Tailwind.
        </div>
      </footer>
    </div>
  );
};

export default App;