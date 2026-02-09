import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import InvoicePreview from './components/InvoicePreview';
import DownloadPDFButton from './components/DownloadPDFButton';
import MobileActionButton from './components/MobileActionButton';
import Toast, { ToastType } from './components/Toast';
import Modal from './components/Modal';
import { InvoiceData } from './types';
import SubscriptionGuard from './components/SubscriptionGuard';

// ... existing imports ...

import { loadFromLocalStorage, saveToLocalStorage, clearLocalStorage } from './utils/localStorage';

// Definisikan Default Data di luar komponen agar bisa dipakai untuk Reset

const DEFAULT_INVOICE_DATA: InvoiceData = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyWebsite: '',
  invoiceTitle: 'INVOICE',
  invoiceNumber: 'INV/2024/001',
  invoiceDate: new Date().toISOString().split('T')[0],
  clientName: '',
  clientAddress: '',
  clientPhone: '',
  items: [
    { id: '1', description: 'Jasa Desain Website', notes: 'Pembuatan landing page', qty: 1, price: 2500000 }
  ],
  taxSettings: [
    { id: 'ppn', name: 'PPN', rate: 11, enabled: false },
    { id: 'pb1', name: 'PB 1', rate: 10, enabled: false },
    { id: 'manual', name: 'Pajak Lain', rate: 0, enabled: false }
  ],
  paymentMethod: '',
  accountNumber: '',
  accountName: '',
  amountPaid: 0,
  footerNote: 'Pembayaran diharapkan selesai sebelum jatuh tempo. Terima kasih.',
  primaryColor: '#3B82F6',
  signatureImage: null,
  stampImage: null,
  signerName: '',
  signerTitle: '',
  watermarkImage: null,
  watermarkOpacity: 30,
  watermarkScale: 80,
  watermarkX: 0,
  watermarkY: 0
};

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null!);

  // Mobile View State ('form' or 'preview')
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [toast, setToast] = useState<{ show: boolean, message: string, type: ToastType }>({ show: false, message: '', type: 'success' });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Initial State: Coba load dari LocalStorage dulu, jika tidak ada gunakan Default
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const savedData = loadFromLocalStorage();
    return savedData || DEFAULT_INVOICE_DATA;
  });

  // Effect: Auto-save setiap kali invoiceData berubah
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(invoiceData);
    }, 500); // Debounce 500ms agar tidak spam storage saat mengetik
    return () => clearTimeout(timer);
  }, [invoiceData]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleDownloadSuccess = () => {
    showToast('PDF berhasil didownload!', 'success');
  };

  const handleDownloadError = (msg: string) => {
    showToast(msg, 'error');
  };

  const handleManualSave = () => {
    const success = saveToLocalStorage(invoiceData);
    if (success) {
      showToast('Data berhasil disimpan ke browser!', 'success');
    } else {
      showToast('Gagal menyimpan (Kuota penuh?)', 'error');
    }
  };

  const confirmReset = () => {
    clearLocalStorage();
    setInvoiceData(DEFAULT_INVOICE_DATA);
    setIsResetModalOpen(false);
    showToast('Formulir berhasil direset.', 'success');
  };

  const toggleMobileView = () => {
    setMobileView(prev => prev === 'form' ? 'preview' : 'form');
  };

  return (
    <SubscriptionGuard featureSlug="invoice">
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />

        <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Column: Form Input */}
            <div className={`w-full lg:w-[450px] flex-shrink-0 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
              <FormInput
                data={invoiceData}
                onChange={setInvoiceData}
                onSave={handleManualSave}
                onReset={() => setIsResetModalOpen(true)}
                onToast={showToast}
              />
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
                  onError={handleDownloadError}
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
              onError={handleDownloadError}
              variant="fab"
            />
          </div>
        )}

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />

        {/* Reset Confirmation Modal */}
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Reset Formulir"
          footer={
            <>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Reset Data
              </button>
            </>
          }
        >
          <p className="text-gray-600">
            Apakah Anda yakin ingin mereset formulir? Semua data yang belum disimpan akan hilang dan kembali ke pengaturan awal.
          </p>
        </Modal>
      </div>
    </SubscriptionGuard>
  );
};

export default App;