import { Trash2 } from 'lucide-react'

export default function ProductRow({ product, onUpdate, onRemove }) {
  return (
    <div className="bg-light-gray p-4 rounded-lg space-y-3">
      <input
        type="text"
        placeholder="Nama Produk / Jasa"
        value={product.name}
        onChange={(e) => onUpdate('name', e.target.value)}
        className="w-full px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
      />
      <textarea
        placeholder="Deskripsi (opsional)"
        value={product.description}
        onChange={(e) => onUpdate('description', e.target.value)}
        rows="2"
        className="w-full px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
      />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700">Qty</label>
          <input
            type="number"
            value={product.quantity}
            onChange={(e) => onUpdate('quantity', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Harga</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => onUpdate('price', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700">Total</label>
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-border-gray text-sm font-medium text-accent-blue">
            Rp {(product.quantity * product.price).toLocaleString('id-ID')}
          </div>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
      >
        <Trash2 className="w-4 h-4" />
        Hapus
      </button>
    </div>
  )
}