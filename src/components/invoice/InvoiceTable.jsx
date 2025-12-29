// components/invoice/InvoiceTable.jsx
import { calculateJumlahBaris } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const InvoiceTable = ({ products }) => {
  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Produk</th>
          <th>Deskripsi</th>
          <th className="text-center">Qty</th>
          <th className="text-right">Harga</th>
          <th className="text-center">Disc</th>
          <th className="text-center">Pajak</th>
          <th className="text-right">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 && (
          <tr>
            <td colSpan="7" style={{ textAlign: 'center', opacity: 0.6 }}>
              Tidak ada produk
            </td>
          </tr>
        )}

        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.nama || '[Nama Produk]'}</td>
            <td>{product.deskripsi || '-'}</td>
            <td className="text-center">{product.qty || 0}</td>
            <td className="text-right">
              {formatCurrency(product.harga || 0)}
            </td>
            <td className="text-center">
              {product.disc ? `${product.disc}%` : '0%'}
            </td>
            <td className="text-center">
              {product.pajak ? `${product.pajak}%` : '-'}
            </td>
            <td className="text-right">
              {formatCurrency(calculateJumlahBaris(product))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
