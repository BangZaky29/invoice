import { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, User, Package, CreditCard } from 'lucide-react';
import CompanyInfoForm from './CompanyInfoForm';
import ClientInfoForm from './ClientInfoForm';
import ProductsForm from './ProductsForm';
import PaymentForm from './PaymentForm';

const FormSection = ({ formData, setFormData }) => {
  const [expandedSections, setExpandedSections] = useState({
    company: false,
    client: false,
    products: false,
    payment: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const next = {
        company: false,
        client: false,
        products: false,
        payment: false
      };
      next[section] = !prev[section];
      return next;
    });
  };

  return (
    <div className="form-column no-print">
      {/* Info Perusahaan */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('company')}
          className="section-header"
        >
          <div className="section-header-left">
            <Building2 size={22} />
            <h2>Info Perusahaan</h2>
          </div>
          {expandedSections.company ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>

        {expandedSections.company && (
          <div className="section-body">
            <CompanyInfoForm formData={formData} setFormData={setFormData} />
          </div>
        )}
      </div>

      {/* Tagihan Untuk */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('client')}
          className="section-header"
        >
          <div className="section-header-left">
            <User size={22} />
            <h2>Tagihan Untuk</h2>
          </div>
          {expandedSections.client ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>

        {expandedSections.client && (
          <div className="section-body">
            <ClientInfoForm formData={formData} setFormData={setFormData} />
          </div>
        )}
      </div>

      {/* Produk */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('products')}
          className="section-header"
        >
          <div className="section-header-left">
            <Package size={22} />
            <h2>Produk / Jasa</h2>
          </div>
          {expandedSections.products ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>

        {expandedSections.products && (
          <div className="section-body">
            <ProductsForm formData={formData} setFormData={setFormData} />
          </div>
        )}
      </div>

      {/* Payment & Keterangan */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('payment')}
          className="section-header"
        >
          <div className="section-header-left">
            <CreditCard size={22} />
            <h2>Payment & Keterangan</h2>
          </div>
          {expandedSections.payment ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>

        {expandedSections.payment && (
          <div className="section-body">
            <PaymentForm formData={formData} setFormData={setFormData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSection;
