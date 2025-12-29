// src/components/PreviewSection.jsx
import { useState } from 'react';
import { Printer } from 'lucide-react';
import InvoiceLayout from './invoice/InvoiceLayout';
import PrintPreview from './PrintPreview';

const PreviewSection = ({ formData }) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  if (!formData) return null;

  if (showPrintPreview) {
    return (
      <PrintPreview
        formData={formData}
        onClose={() => setShowPrintPreview(false)}
      />
    );
  }

  return (
    <div className="preview-column">
      <div className="preview-container no-print">
        <div className="preview-header">
          <h2>Preview Invoice</h2>
          <div className="preview-badge">
            <span>Live Preview</span>
          </div>
        </div>

        <div className="preview-content preview-guided">
          <InvoiceLayout
            formData={formData}
            products={formData.products}
          />
        </div>

        <button
          onClick={() => setShowPrintPreview(true)}
          className="btn-primary"
          style={{ marginTop: '1.5rem' }}
        >
          <Printer size={22} />
          <span>Preview Print & Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default PreviewSection;
