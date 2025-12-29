// components/invoice/InvoiceSummary.jsx
import {
  calculateSubtotal,
  calculateTotalDiskon,
  calculatePajak,
  calculateTotal
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const InvoiceSummary = ({ products, payment }) => {
  const subtotal = calculateSubtotal(products);
  const totalDiskon = calculateTotalDiskon(products);
  const diskonTambahan = parseFloat(payment.diskonTambahan) || 0;
  const pajak = calculatePajak(products, diskonTambahan);
  const total = calculateTotal(products, diskonTambahan);

  return (
    <div className="invoice-summary">
      <table className="summary-table">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>{formatCurrency(subtotal)}</td>
          </tr>
          <tr>
            <td>Total Diskon</td>
            <td>{formatCurrency(totalDiskon)}</td>
          </tr>

          {diskonTambahan > 0 && (
            <tr>
              <td>Diskon Tambahan</td>
              <td>{formatCurrency(diskonTambahan)}</td>
            </tr>
          )}

          <tr>
            <td>Pajak</td>
            <td>{formatCurrency(pajak)}</td>
          </tr>

          <tr className="total-row">
            <td>Total</td>
            <td>{formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceSummary;
