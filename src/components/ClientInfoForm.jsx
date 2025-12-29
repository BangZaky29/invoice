const ClientInfoForm = ({ formData, setFormData }) => {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Nama Client/Pelanggan *</label>
        <input
          type="text"
          value={formData.clientInfo.nama}
          onChange={(e) => setFormData({
            ...formData,
            clientInfo: { ...formData.clientInfo, nama: e.target.value }
          })}
          className="form-input"
          placeholder="Nama Mitra"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Alamat Client *</label>
        <textarea
          value={formData.clientInfo.alamat}
          onChange={(e) => setFormData({
            ...formData,
            clientInfo: { ...formData.clientInfo, alamat: e.target.value }
          })}
          className="form-textarea"
          rows="3"
          placeholder="alamat mitra baris 1, kota kab/kabupaten, mitra,&#10;negara mitra"
        />
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label">No. Invoice *</label>
          <input
            type="text"
            value={formData.clientInfo.invoice}
            onChange={(e) => setFormData({
              ...formData,
              clientInfo: { ...formData.clientInfo, invoice: e.target.value }
            })}
            className="form-input"
            placeholder="INV-2019/I/078"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tanggal Invoice *</label>
          <input
            type="date"
            value={formData.clientInfo.tanggal}
            onChange={(e) => setFormData({
              ...formData,
              clientInfo: { ...formData.clientInfo, tanggal: e.target.value }
            })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Jatuh Tempo</label>
          <input
            type="date"
            value={formData.clientInfo.jatuhTempo}
            onChange={(e) => setFormData({
              ...formData,
              clientInfo: { ...formData.clientInfo, jatuhTempo: e.target.value }
            })}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Telp. Client</label>
          <input
            type="text"
            value={formData.clientInfo.telp}
            onChange={(e) => setFormData({
              ...formData,
              clientInfo: { ...formData.clientInfo, telp: e.target.value }
            })}
            className="form-input"
            placeholder="031-1234 5678"
          />
        </div>
        <div className="form-group">
          <label className="form-label">No. NPWP Client</label>
          <input
            type="text"
            value={formData.clientInfo.npwp}
            onChange={(e) => setFormData({
              ...formData,
              clientInfo: { ...formData.clientInfo, npwp: e.target.value }
            })}
            className="form-input"
            placeholder="80.942.488.6-436.000"
          />
        </div>
      </div>
    </>
  );
};

export default ClientInfoForm;