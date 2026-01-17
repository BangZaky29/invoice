import React, { useEffect, useState, useRef, useMemo } from 'react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement>;
}

// Constants for A4 Layout Calculation (in px)
const A4_HEIGHT = 1123;
const PADDING = 40; // Top/Bottom padding
const CONTENT_HEIGHT = A4_HEIGHT - (PADDING * 2); // Usable height ~1043px

// Estimated heights for layout logic
// Reduced heights slightly to fit more content
const HEADER_HEIGHT = 300; // Was 320
const TABLE_HEADER_HEIGHT = 45; // Was 50
const ROW_HEIGHT = 55; // Reduced from 65 to pack items tighter
const FOOTER_HEIGHT = 450; 

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, previewRef }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale logic for mobile devices
  useEffect(() => {
    const calculateScale = () => {
      let availableWidth = containerRef.current?.offsetWidth || 0;
      if (availableWidth === 0) {
        availableWidth = window.innerWidth - 32;
      }
      const a4Width = 794;
      if (availableWidth < a4Width) {
        setScale(Math.max(availableWidth / a4Width, 0.3)); 
      } else {
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    const interval = setInterval(calculateScale, 500);
    return () => {
      window.removeEventListener('resize', calculateScale);
      clearInterval(interval);
    };
  }, []);

  // Pagination Logic
  const pages = useMemo(() => {
    const _pages: { items: InvoiceItem[], type: 'first' | 'middle' | 'last' | 'single' }[] = [];
    
    // Clone items to process
    let remainingItems = [...data.items];
    
    // If no items, show at least one page
    if (remainingItems.length === 0) {
      return [{ items: [], type: 'single' }];
    }

    // Calculate Capacity for First Page
    let firstPageAvailableHeight = CONTENT_HEIGHT - HEADER_HEIGHT - TABLE_HEADER_HEIGHT;
    
    let currentPageItems: InvoiceItem[] = [];
    let currentHeight = 0;
    
    // --- PAGE 1 Processing ---
    while (remainingItems.length > 0) {
      const item = remainingItems[0];
      
      // Heuristic: Check rough height. 
      // Note: This is an estimation. If text is huge, it might overflow.
      // Ideally we would measure DOM, but that's complex in React render cycle.
      if (currentHeight + ROW_HEIGHT > firstPageAvailableHeight) {
        break; // Page 1 is full
      }
      
      currentPageItems.push(item);
      currentHeight += ROW_HEIGHT;
      remainingItems.shift();
    }

    // Determine Page 1 Type
    if (remainingItems.length === 0) {
      // Check Footer
      if (currentHeight + FOOTER_HEIGHT <= firstPageAvailableHeight) {
        _pages.push({ items: currentPageItems, type: 'single' });
        return _pages;
      } else {
        _pages.push({ items: currentPageItems, type: 'first' });
        _pages.push({ items: [], type: 'last' }); // Page 2 contains footer
        return _pages;
      }
    } else {
      _pages.push({ items: currentPageItems, type: 'first' });
    }

    // --- MIDDLE / LAST PAGES Processing ---
    while (remainingItems.length > 0) {
      currentPageItems = [];
      currentHeight = 0;
      
      // On subsequent pages, we DON'T show the Table Header anymore (per user request),
      // so we have more space: CONTENT_HEIGHT.
      // If we did show header, we would subtract TABLE_HEADER_HEIGHT.
      const pageAvailableHeight = CONTENT_HEIGHT; 

      while (remainingItems.length > 0) {
        if (currentHeight + ROW_HEIGHT > pageAvailableHeight) {
          break; // Page full
        }
        currentPageItems.push(remainingItems[0]);
        currentHeight += ROW_HEIGHT;
        remainingItems.shift();
      }

      if (remainingItems.length === 0) {
        if (currentHeight + FOOTER_HEIGHT <= pageAvailableHeight) {
          _pages.push({ items: currentPageItems, type: 'last' });
        } else {
          _pages.push({ items: currentPageItems, type: 'middle' });
          _pages.push({ items: [], type: 'last' });
        }
      } else {
        _pages.push({ items: currentPageItems, type: 'middle' });
      }
    }

    return _pages;

  }, [data.items]);

  // Calculations
  const subtotal = data.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const enabledTaxes = data.taxSettings.filter(t => t.enabled);
  const totalTaxAmount = enabledTaxes.reduce((acc, tax) => acc + (subtotal * tax.rate / 100), 0);
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

  // --- Components ---

  const PageHeader = () => (
    <div className="flex justify-between items-start mb-6 relative z-10 h-[210px]"> {/* Reduced margin and fixed height */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: data.primaryColor }}>{data.companyName || 'Nama Perusahaan'}</h1>
        <div className="text-sm text-gray-500 whitespace-pre-line max-w-[300px] leading-tight">
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
  );

  const ClientInfo = () => (
    <div className="flex justify-between mb-6 relative z-10 h-[90px]"> {/* Reduced margin/height */}
        <div className="w-1/2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1" style={{ borderColor: data.primaryColor }}>
            Tagihan Untuk
          </h3>
          <div className="text-lg font-bold text-gray-800 leading-tight mb-1">{data.clientName || 'Nama Client'}</div>
          <div className="text-sm text-gray-600 whitespace-pre-line max-w-[300px] leading-tight">
            {data.clientAddress || 'Alamat Client'}
          </div>
        </div>
    </div>
  );

  const TableHeader = () => (
    <div 
      className="mb-2 py-2 rounded" 
      style={{ backgroundColor: `${data.primaryColor}15` }}
    >
      <div className="flex text-sm font-bold" style={{ color: data.primaryColor }}>
        <div className="w-[50%] px-4">Deskripsi</div>
        <div className="w-[15%] text-center px-2">Qty</div>
        <div className="w-[20%] text-right px-2">Harga</div>
        <div className="w-[15%] text-right px-4">Total</div>
      </div>
    </div>
  );

  const ItemRow = ({ item }: { item: InvoiceItem }) => (
    <div className="flex text-sm border-b border-gray-100 items-start hover:bg-gray-50/50 transition-colors py-1.5"> {/* Reduced padding py-1.5 */}
      <div className="w-[50%] px-4">
        {/* Leading-tight for tighter text wrapping */}
        <div className="font-medium text-gray-800 break-words leading-tight">{item.description}</div>
        {item.notes && <div className="text-xs text-gray-500 mt-0.5 leading-tight">{item.notes}</div>}
      </div>
      <div className="w-[15%] text-center px-2 text-gray-600 leading-tight">{item.qty}</div>
      <div className="w-[20%] text-right px-2 text-gray-600 leading-tight">{formatCurrency(item.price)}</div>
      <div className="w-[15%] text-right px-4 font-medium text-gray-800 leading-tight">
        {formatCurrency(item.qty * item.price)}
      </div>
    </div>
  );

  const InvoiceFooter = () => (
    <div className="mt-auto pt-4"> {/* Reduced padding-top */}
      {/* Totals */}
      <div className="flex justify-end mb-6 relative z-10">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            
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

      {/* Info & Signature */}
      <div className="grid grid-cols-2 gap-8 relative z-10">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Metode Pembayaran</h4>
          <p className="text-sm font-medium text-gray-800">{data.paymentMethod || '-'}</p>
          {data.accountNumber && (
            <div className="mt-1">
              <p className="text-sm text-gray-600">{data.accountNumber}</p>
              {data.accountName && <p className="text-sm text-gray-600">a.n. {data.accountName}</p>}
            </div>
          )}
          
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Catatan</h4>
          <p className="text-xs text-gray-500">
            Pembayaran diharapkan selesai sebelum jatuh tempo. Terima kasih.
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <p className="text-sm text-gray-600 mb-8">Hormat kami,</p>
          
          <div className="h-24 w-44 relative flex items-center justify-center mb-2">
              {data.stampImage && (
                <img 
                  src={data.stampImage} 
                  alt="Stamp" 
                  className="absolute right-0 top-0 h-24 opacity-80 mix-blend-multiply rotate-[-10deg]"
                  style={{ zIndex: 5 }} 
                />
              )}
              {data.signatureImage ? (
                <img 
                  src={data.signatureImage} 
                  alt="Signature" 
                  className="max-h-full max-w-full object-contain relative" 
                  style={{ zIndex: 10 }} 
                />
              ) : (
                <div className="h-20"></div>
              )}
          </div>
          
          <p className="text-sm font-bold text-gray-800 relative z-10">{data.companyName || 'Manager'}</p>
          <div className="h-0.5 w-32 bg-gray-300 mt-1 ml-auto"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      id="preview-container"
      ref={containerRef}
      className="w-full bg-gray-100 rounded-xl border border-gray-200 p-2 md:p-6 flex flex-col items-center overflow-auto min-h-[500px]"
    >
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center', 
          width: '794px', 
        }}
        className="transition-transform duration-300 ease-out"
        ref={previewRef}
      >
        
        {pages.map((page, index) => {
          const isFirst = index === 0;
          const isLast = index === pages.length - 1;
          
          return (
            <div 
              key={index}
              className="invoice-page bg-white shadow-lg relative text-gray-800 mb-8 mx-auto overflow-hidden flex flex-col"
              style={{
                width: '794px', 
                height: '1123px', // Strict A4 Height
                padding: '40px',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {/* Content Wrapper */}
              <div>
                {/* Header only on first page */}
                {isFirst && <PageHeader />}
                {isFirst && <ClientInfo />}

                {/* Table Section */}
                <div className="mb-4">
                  {/* Table Header ONLY on First Page (removed from others per request) */}
                  {isFirst && <TableHeader />}
                  
                  <div className="flex flex-col border-b border-gray-200">
                    {page.items.map((item) => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                    {/* If first page and no items, show placeholder */}
                    {page.items.length === 0 && isFirst && (
                       <div className="py-8 text-center text-gray-400 italic">Belum ada item</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Watermark */}
              {isLast && isPaid && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                   <div className="border-8 border-green-500 text-green-500 text-9xl font-black opacity-20 -rotate-45 p-4 rounded-xl tracking-widest">
                     LUNAS
                   </div>
                </div>
              )}

              {/* Footer (Only on last page) */}
              {isLast ? (
                <InvoiceFooter />
              ) : (
                <div className="mt-auto"></div>
              )}

              {/* Page Number / Decoration */}
              <div className="absolute bottom-4 right-8 text-xs text-gray-400">
                Halaman {index + 1} dari {pages.length}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-3" style={{ backgroundColor: data.primaryColor }}></div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default InvoicePreview;