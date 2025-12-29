import { Plus, Trash2 } from 'lucide-react';

const ProductsForm = ({ formData, setFormData }) => {
  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          id: Date.now(),
          nama: '',
          deskripsi: '',
          qty: '',
          harga: '',
          disc: '',
          pajak: ''
        }
      ]
    });
  };

  const handleRemoveProduct = (id) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter(p => p.id !== id)
      });
    }
  };

  const handleProductChange = (id, field, value) => {
    setFormData({
      ...formData,
      products: formData.products.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <>
      {formData.products.map((product, index) => (
        <div key={product.id} className="product-card">
          <div className="product-card-header">
            <strong>Produk #{index + 1}</strong>
            {formData.products.length > 1 && (
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="btn-remove"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Nama Produk *</label>
            <input
              type="text"
              value={product.nama}
              onChange={(e) => handleProductChange(product.id, 'nama', e.target.value)}
              className="form-input"
              placeholder="nama produk 1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Produk</label>
            <textarea
              value={product.deskripsi}
              onChange={(e) => handleProductChange(product.id, 'deskripsi', e.target.value)}
              className="form-textarea"
              rows="2"
              placeholder="deskripsi produk 1"
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Qty *</label>
              <input
                type="number"
                value={product.qty}
                onChange={(e) => handleProductChange(product.id, 'qty', e.target.value)}
                className="form-input"
                placeholder="10"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Harga (Rp) *</label>
              <input
                type="number"
                value={product.harga}
                onChange={(e) => handleProductChange(product.id, 'harga', e.target.value)}
                className="form-input"
                placeholder="1000000"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Disc (%)</label>
              <input
                type="number"
                value={product.disc}
                onChange={(e) => handleProductChange(product.id, 'disc', e.target.value)}
                className="form-input"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pajak (%) - contoh: PPN 10%, INCLUSIVE</label>
            <input
              type="number"
              value={product.pajak}
              onChange={(e) => handleProductChange(product.id, 'pajak', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>
      ))}

      <button onClick={handleAddProduct} className="btn-add">
        <Plus size={20} />
        <span>Tambah Produk</span>
      </button>
    </>
  );
};

export default ProductsForm;