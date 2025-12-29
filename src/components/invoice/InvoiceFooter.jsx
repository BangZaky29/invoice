// components/invoice/InvoiceFooter.jsx
import { formatDate } from '../../utils/formatters';

const InvoiceFooter = ({ clientInfo, payment }) => {
  return (
    <footer className="invoice-footer">
      {payment?.keterangan && (
        <div className="invoice-notes">
          <strong>Keterangan:</strong>
          <p>{payment.keterangan}</p>
        </div>
      )}

      {payment?.syarat && (
        <div className="invoice-terms">
          <strong>Syarat & Ketentuan:</strong>
          <p>{payment.syarat}</p>
        </div>
      )}

      <div className="invoice-signature">
        <div className="signature-date">
          <p>{formatDate(clientInfo.tanggal)}</p>
        </div>

        <div className="signature-box">
          <p>Finance</p>
          <div className="signature-line">___________________</div>
        </div>
      </div>

      <div className="invoice-footer-note">
        <p>PAPER</p>
      </div>
    </footer>
  );
};

export default InvoiceFooter;
