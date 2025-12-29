const PaymentForm = ({ formData, setFormData }) => {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Keterangan</label>
        <textarea
          value={formData.payment.keterangan}
          onChange={(e) => setFormData({
            ...formData,
            payment: { ...formData.payment, keterangan: e.target.value }
          })}
          className="form-textarea"
          rows="3"
          placeholder="metode keterangan mewajib 2 baris sehingga terlihat pas jadi dot matrix, yang akan terpasang..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Syarat & Ketentuan</label>
        <textarea
          value={formData.payment.syarat}
          onChange={(e) => setFormData({
            ...formData,
            payment: { ...formData.payment, syarat: e.target.value }
          })}
          className="form-textarea"
          rows="3"
          placeholder="metode syarat dan ketentuan mewajib 2 baris sehingga terlihat pas jadi dot matrix..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Diskon Tambahan (Rp)</label>
        <input
          type="number"
          value={formData.payment.diskonTambahan}
          onChange={(e) => setFormData({
            ...formData,
            payment: { ...formData.payment, diskonTambahan: e.target.value }
          })}
          className="form-input"
          placeholder="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Down Payment (Rp)</label>
        <input
          type="number"
          value={formData.payment.downPayment}
          onChange={(e) => setFormData({
            ...formData,
            payment: { ...formData.payment, downPayment: e.target.value }
          })}
          className="form-input"
          placeholder="10000000"
          step="0.01"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tgl. Jabat Tempo DP</label>
          <input
            type="date"
            value={formData.payment.tglJatuhTempo}
            onChange={(e) => setFormData({
              ...formData,
              payment: { ...formData.payment, tglJatuhTempo: e.target.value }
            })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">No. Down Payment</label>
          <input
            type="text"
            value={formData.payment.noDownPayment}
            onChange={(e) => setFormData({
              ...formData,
              payment: { ...formData.payment, noDownPayment: e.target.value }
            })}
            className="form-input"
            placeholder="INV-DP-2020/I/0023"
          />
        </div>
      </div>
    </>
  );
};

export default PaymentForm;