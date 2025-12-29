import InvoiceHeader from './InvoiceHeader';
import InvoiceTable from './InvoiceTable';
import InvoiceParties from './InvoiceParties';
import InvoiceSummary from './InvoiceSummary';
import InvoiceFooter from './InvoiceFooter';
import InvoicePayment from './InvoicePayment';

const InvoiceLayout = ({
  formData,
  products = [],
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="invoice-page">
      {showHeader && (
        <InvoiceHeader
          companyInfo={formData.companyInfo}
          clientInfo={formData.clientInfo}
        />
      )}

      <InvoiceParties
        companyInfo={formData.companyInfo}
        clientInfo={formData.clientInfo}
      />

      <InvoiceTable products={products} />

      {showFooter && (
        <>
          <InvoiceSummary
            products={products}
            payment={formData.payment}
          />
          <InvoicePayment payment={formData.payment} />
          <InvoiceFooter
            clientInfo={formData.clientInfo}
            payment={formData.payment}
          />
        </>
      )}
    </div>
  );
};

export default InvoiceLayout;
