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
      { id: 'manual', name: 'Pajak Lain', rate: 0, enabled: false }
    ],
    
    paymentMethod: '',
    accountNumber: '',
    accountName: '',
    amountPaid: 0,
    
    primaryColor: '#3B82F6',
    signatureImage: null,
    stampImage: null,

    // Signer Defaults
    signerName: '',
    signerTitle: '',
    
    watermarkImage: null,
    watermarkOpacity: 30,
    watermarkScale: 80,
    watermarkX: 0,
    watermarkY: 0
  });

  const handleDownloadSuccess = () => {
    setShowToast(true);
  };

  const toggleMobileView = () => {
    setMobileView(prev => prev === 'form' ? 'preview' : 'form');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form Input */}
          <div className={`w-full lg:w-[450px] flex-shrink-0 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <FormInput data={invoiceData} onChange={setInvoiceData} />
          </div>

          {/* Right Column: Preview */}
          <div className={`flex-grow w-full flex flex-col items-center ${mobileView === 'form' ? 'hidden lg:flex' : 'flex'}`}>
            {/* Toolbar */}
            <div className="w-full max-w-[794px] mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Preview Invoice</h2>
              <DownloadPDFButton 
                targetRef={previewRef} 
                fileName={`Invoice-${invoiceData.invoiceNumber.replace(/\//g, '-')}`}
                onSuccess={handleDownloadSuccess}
              />
            </div>

            {/* Preview Component */}
            <InvoicePreview data={invoiceData} previewRef={previewRef} />
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <MobileActionButton currentView={mobileView} onToggle={toggleMobileView} />

      {/* Mobile Download FAB (Only in preview mode) */}
      {mobileView === 'preview' && (
        <div className="fixed bottom-24 right-6 lg:hidden z-50">
           <DownloadPDFButton 
              targetRef={previewRef} 
              fileName={`Invoice-${invoiceData.invoiceNumber.replace(/\//g, '-')}`} 
              onSuccess={handleDownloadSuccess}
              variant="fab"
           />
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        message="PDF berhasil didownload!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default App;