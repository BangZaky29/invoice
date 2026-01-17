import React, { useEffect, useState, useRef } from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement>;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, previewRef }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale logic for mobile devices
  useEffect(() => {
    const calculateScale = () => {
      // Get the available width. If container is hidden (offsetwidth 0), fallback to window width
      let availableWidth = containerRef.current?.offsetWidth || 0;
      
      // If component is hidden in tab (width 0), use window width minus padding
      if (availableWidth === 0) {
        availableWidth = window.innerWidth - 32; // 32px for padding estimate
      }

      // A4 width in px (standard 96DPI) = 794px
      const a4Width = 794;
      
      // If screen is smaller than A4, scale down
      if (availableWidth < a4Width) {
        // Calculate ratio
        const newScale = availableWidth / a4Width;
        // Limit scale to avoid too small text, but ensure it fits
        setScale(Math.max(newScale, 0.3)); 
      } else {
        setScale(1);
      }
    };

    // Run initially
    calculateScale();

    // Run on resize
    window.addEventListener('resize', calculateScale);

    // Run periodically to catch tab switches or layout shifts
    const interval = setInterval(calculateScale, 500);

    return () => {
      window.removeEventListener('resize', calculateScale);
      clearInterval(interval);
    };
  }, []);

  // Calculations
  const subtotal = data.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  
  // Calculate total tax based on enabled settings
  const enabledTaxes = data.taxSettings.filter(t => t.enabled);
  const totalTaxAmount = enabledTaxes.reduce((acc, tax) => {
    return acc + (subtotal * tax.rate / 100);
  }, 0);

  const total = subtotal + totalTaxAmount;
  const balanceDue = total - data.amountPaid;
  const isPaid = balanceDue <= 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div 
      id="preview-container"
      ref={containerRef}
      className="w-full bg-gray-100 rounded-xl border border-gray-200 p-2 md:p-6 flex justify-center overflow-hidden min-h-[500px]"
    >
      {/* Wrapper handles the scaling */}
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center', // Scale from top center
          width: '794px', // Force internal width to be A4
          height: '1123px', // Force internal height to be A4
          // Use marginBottom to reduce the whitespace created by scaling down
          marginBottom: `-${1123 * (1 - scale)}px`,
        }}
        className="transition-transform duration-300 ease-out"
      >
        
        {/* A4 Content - This is what gets captured by PDF */}
        <div 
          ref={previewRef}
          className="bg-white shadow-lg relative text-gray-800"
          style={{
            width: '794px', 
            minHeight: '1123px', 
            padding: '40px',
            boxSizing: 'border-box'
          }}
        >
          {/* LUNAS Watermark */}
          {isPaid && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
               <div className="border-8 border-green-500 text-green-500 text-9xl font-black opacity-20 -rotate-45 p-4 rounded-xl tracking-widest">
                 LUNAS
               </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: data.primaryColor }}>{data.companyName || 'Nama Perusahaan'}</h1>
              <div className="text-sm text-gray-500 whitespace-pre-line max-w-[300px]">
                {data.companyAddress || 'Alamat Perusahaan'}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {data.companyPhone}
              </div>
            </div>
            <div className="text-right">
               <h2 className="text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: data.primaryColor }}>INVOICE</h2>
               <div className="text-sm text-gray-600">
                 <span className="font-semibold">No:</span> {data.invoiceNumber || 'INV/000'}
               </div>
               <div className="text-sm text-gray-600">
                 <span className="font-semibold">Tanggal:</span> {data.invoiceDate}
               </div>
            </div>
          </div>

          {/* Client & Info */}
          <div className="flex justify-between mb-8 relative z-10">
             <div className="w-1/2">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1" style={{ borderColor: data.primaryColor }}>
                 Tagihan Untuk
               </h3>
               <div className="text-lg font-bold text-gray-800">{data.clientName || 'Nama Client'}</div>
               <div className="text-sm text-gray-600 whitespace-pre-line max-w-[300px]">
                 {data.clientAddress || 'Alamat Client'}
               </div>
             </div>
          </div>

          {/* Table */}
          <div className="mb-8 relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: `${data.primaryColor}20` }}>
                  <th className="py-3 px-4 text-sm font-bold text-gray-700 w-1/2">Deskripsi</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-700 text-center">Qty</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-700 text-right">Harga</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-700 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{item.description}</div>
                      {item.notes && <div className="text-xs text-gray-500 mt-1">{item.notes}</div>}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{item.qty}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">
                      {formatCurrency(item.qty * item.price)}
                    </td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                     <td colSpan={4} className="py-8 text-center text-gray-400 italic">Belum ada item</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12 relative z-10">
             <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {/* Render Multiple Enabled Taxes */}
                {enabledTaxes.map(tax => (
                  <div key={tax.id} className="flex justify-between text-sm text-gray-600">
                    <span>{tax.name} ({tax.rate}%)</span>
                    <span className="font-medium">{formatCurrency(subtotal * tax.rate / 100)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200" style={{ color: data.primaryColor }}>
                   <span>Total</span>
                   <span>{formatCurrency(total)}</span>
                </div>

                {data.amountPaid > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 pt-2">
                    <span>Dibayar</span>
                    <span className="font-medium text-green-600">(-) {formatCurrency(data.amountPaid)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-base font-bold bg-gray-50 p-2 rounded">
                   <span>Sisa Tagihan</span>
                   <span className={balanceDue > 0 ? 'text-red-500' : 'text-gray-800'}>
                     {formatCurrency(Math.max(0, balanceDue))}
                   </span>
                </div>
             </div>
          </div>

          {/* Footer Info & Signature */}
          <div className="grid grid-cols-2 gap-8 relative z-10 mt-auto">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Metode Pembayaran</h4>
              <p className="text-sm font-medium text-gray-800">{data.paymentMethod || '-'}</p>
              {/* Display Account Number if available */}
              {data.accountNumber && (
                <div className="mt-1">
                  <p className="text-sm text-gray-600">{data.accountNumber}</p>
                  {data.accountName && <p className="text-sm text-gray-600">a.n. {data.accountName}</p>}
                </div>
              )}
              
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Catatan</h4>
              <p className="text-xs text-gray-500">
                Pembayaran diharapkan selesai sebelum jatuh tempo. Terima kasih atas kepercayaan Anda.
              </p>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <p className="text-sm text-gray-600 mb-8">Hormat kami,</p>
              
              <div className="h-28 w-44 relative flex items-center justify-center mb-2">
                {/* Stamp Layer - Z-index 5 */}
                 {data.stampImage && (
                   <img 
                      src={data.stampImage} 
                      alt="Stamp" 
                      className="absolute right-0 top-0 h-24 opacity-80 mix-blend-multiply rotate-[-10deg]"
                      style={{ zIndex: 5 }} 
                   />
                 )}
                 {/* Signature Layer - Z-index 10 (Always on top) */}
                 {data.signatureImage ? (
                   <img 
                      src={data.signatureImage} 
                      alt="Signature" 
                      className="max-h-full max-w-full object-contain relative" 
                      style={{ zIndex: 10 }} 
                   />
                 ) : (
                   <div className="text-gray-300 text-xs italic"></div>
                 )}
              </div>
              
              <p className="text-sm font-bold text-gray-800 relative z-10">{data.companyName || 'Manager'}</p>
              <div className="h-0.5 w-32 bg-gray-300 mt-1 ml-auto"></div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-4" style={{ backgroundColor: data.primaryColor }}></div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;