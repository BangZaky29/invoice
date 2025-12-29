import { Upload } from 'lucide-react';

const CompanyInfoForm = ({ formData, setFormData }) => {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          companyInfo: {
            ...formData.companyInfo,
            logo: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Logo Upload */}
      <div className="form-group">
        <label className="form-label">Logo Perusahaan (PNG/JPG)</label>
        <div className="logo-upload-container">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block' }}>
            {formData.companyInfo.logo ? (
              <img
                src={formData.companyInfo.logo}
                alt="Logo"
                className="logo-preview"
              />
            ) : (
              <div>
                <Upload size={36} style={{ margin: '0 auto', color: 'var(--blue-600)' }} />
                <p style={{ marginTop: '0.75rem', color: 'var(--blue-700)', fontWeight: '600' }}>
                  Klik untuk upload logo
                </p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  Format: PNG, JPG (Max 2MB)
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Nama Perusahaan *</label>
        <input
          type="text"
          value={formData.companyInfo.nama}
          onChange={(e) => setFormData({
            ...formData,
            companyInfo: { ...formData.companyInfo, nama: e.target.value }
          })}
          className="form-input"
          placeholder="PT GARAGE"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Alamat Lengkap *</label>
        <textarea
          value={formData.companyInfo.alamat}
          onChange={(e) => setFormData({
            ...formData,
            companyInfo: { ...formData.companyInfo, alamat: e.target.value }
          })}
          className="form-textarea"
          rows="3"
          placeholder="Alamat kantor 1,&#10;Alamat kantor 2, Kab/Kabupaten,&#10;Negara"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Telepon *</label>
          <input
            type="text"
            value={formData.companyInfo.telp}
            onChange={(e) => setFormData({
              ...formData,
              companyInfo: { ...formData.companyInfo, telp: e.target.value }
            })}
            className="form-input"
            placeholder="021-1234 5678"
          />
        </div>
        <div className="form-group">
          <label className="form-label">No. HP/WA</label>
          <input
            type="text"
            value={formData.companyInfo.hp}
            onChange={(e) => setFormData({
              ...formData,
              companyInfo: { ...formData.companyInfo, hp: e.target.value }
            })}
            className="form-input"
            placeholder="0812-3456-7890"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">NPWP</label>
        <input
          type="text"
          value={formData.companyInfo.npwp}
          onChange={(e) => setFormData({
            ...formData,
            companyInfo: { ...formData.companyInfo, npwp: e.target.value }
          })}
          className="form-input"
          placeholder="XX.XXX.XXX.X-XXX.XXX"
        />
      </div>
    </>
  );
};

export default CompanyInfoForm;