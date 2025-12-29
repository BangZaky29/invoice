// components/invoice/InvoiceHeader.jsx
import { formatDate } from '../../utils/formatters';

const InvoiceHeader = ({ companyInfo, clientInfo }) => {
  return (
    <header className="invoice-header">
      <div className="company-section">
        {companyInfo.logo && (
          <img
            src={companyInfo.logo}
            alt="Logo"
            className="company-logo"
          />
        )}
        <div className="company-info">
          <h2>{companyInfo.nama || '[Nama Perusahaan]'}</h2>
          <p>{companyInfo.alamat || '[Alamat Perusahaan]'}</p>
          <p>
            Telp. {companyInfo.telp || '-'} / {companyInfo.hp || '-'}
          </p>
          {companyInfo.npwp && <p>NPWP: {companyInfo.npwp}</p>}
        </div>
      </div>

      <div className="invoice-title-section">
        <h1 className="invoice-title">Invoice</h1>
        <div className="invoice-meta">
          <p><strong>Referensi:</strong> {clientInfo.invoice || '-'}</p>
          <p><strong>Tanggal:</strong> {formatDate(clientInfo.tanggal)}</p>
          {clientInfo.jatuhTempo && (
            <p>
              <strong>Jatuh Tempo:</strong>{' '}
              {formatDate(clientInfo.jatuhTempo)}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default InvoiceHeader;
