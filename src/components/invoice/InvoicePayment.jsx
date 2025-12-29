// components/invoice/InvoicePayment.jsx
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoicePayment = ({ payment }) => {
  const downPayment = parseFloat(payment?.downPayment) || 0;
  const show = downPayment > 0 || payment?.noDownPayment || payment?.tglJatuhTempo;
  if (!show) return null;

  return (
    <div className="invoice-payment">
      <h4>Down Payment</h4>
      <p><strong>No. Down Payment:</strong> {payment?.noDownPayment || '-'}</p>
      <p><strong>Tgl. Jatuh Tempo:</strong> {formatDate(payment?.tglJatuhTempo)}</p>
      <p><strong>Jumlah Tersedia:</strong> {formatCurrency(downPayment)}</p>
    </div>
  );
};

export default InvoicePayment;
