// components/invoice/InvoiceParties.jsx

const InvoiceParties = ({ companyInfo, clientInfo }) => {
  return (
    <div className="invoice-parties">
      <div className="party-section">
        <h3>Info Perusahaan</h3>
        <p><strong>{companyInfo.nama || '[Nama Perusahaan]'}</strong></p>
        <p>{companyInfo.alamat || '[Alamat Perusahaan]'}</p>
        <p>Telp: {companyInfo.telp || '-'}</p>
        {companyInfo.npwp && <p>NPWP: {companyInfo.npwp}</p>}
      </div>

      <div className="party-section">
        <h3>Tagihan Untuk</h3>
        <p><strong>{clientInfo.nama || '[Nama Client]'}</strong></p>
        <p>{clientInfo.alamat || '[Alamat Client]'}</p>
        {clientInfo.telp && <p>Telp: {clientInfo.telp}</p>}
        {clientInfo.npwp && <p>NPWP: {clientInfo.npwp}</p>}
      </div>
    </div>
  );
};

export default InvoiceParties;
