import { Download, Printer, X } from 'lucide-react';
import InvoiceLayout from './invoice/InvoiceLayout';
import { useMemo, useEffect, useRef, useState } from 'react';

const PrintPreview = ({ formData, onClose }) => {
  const products = useMemo(() => Array.isArray(formData?.products) ? formData.products : [], [formData]);
  const contentRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    const mmToPx = 3.78;
    const pageHeightPx = 297 * mmToPx;
    const el = contentRef.current;
    if (el) {
      const h = el.scrollHeight;
      setPageCount(Math.max(1, Math.ceil(h / pageHeightPx)));
    }
  }, [products, formData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-root print-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="no-print" style={{
        background: 'white',
        padding: '1rem',
        borderBottom: '2px solid var(--gray-300)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onClose} style={{
            background: 'var(--gray-200)',
            border: 'none',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <X size={20} />
            <span>Tutup</span>
          </button>
          <h3 style={{ margin: 0 }}>Print Preview</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handlePrint} style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <Printer size={20} />
            <span>Print</span>
          </button>
          <button onClick={handlePrint} style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <Download size={20} />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div ref={contentRef} className="preview-content preview-guided">
          <InvoiceLayout
            formData={formData}
            products={products}
            showHeader={true}
            showFooter={true}
          />
        </div>
      </div>
      
      {pageCount > 1 && (
        <div className="no-print page-indicator">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button key={i}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrintPreview;
