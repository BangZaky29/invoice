import React from 'react';
import { InvoiceData, InvoiceItem, TaxSetting } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import TTDUpload from './TTDUpload';

interface FormInputProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const FormInput: React.FC<FormInputProps> = ({ data, onChange }) => {
  const [expandedSection, setExpandedSection] = React.useState<string>('company');

  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateField('items', newItems);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      qty: 1,
      price: 0
    };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter(item => item.id !== id));
  };

  // Tax Handlers
  const toggleTax = (id: string) => {
    const newSettings = data.taxSettings.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    );
    updateField('taxSettings', newSettings);
  };

  const updateTaxRate = (id: string, newRate: number) => {
    const newSettings = data.taxSettings.map(t => 
      t.id === id ? { ...t, rate: newRate } : t
    );
    updateField('taxSettings', newSettings);
  };
  
  const updateTaxName = (id: string, newName: string) => {
    const newSettings = data.taxSettings.map(t => 
      t.id === id ? { ...t, name: newName } : t
    );
    updateField('taxSettings', newSettings);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('stampImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? '' : sec);
  };

  const SectionHeader = ({ id, title, step }: { id: string, title: string, step: string }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
    >
      <span className="font-semibold text-gray-700 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {step}
        </span>
        {title}
      </span>
      {expandedSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" id="invoice-form">
      
      {/* 1. Company Info */}
      <SectionHeader id="company" title="Info Perusahaan" step="1" />
      {expandedSection === 'company' && (
        <div className="p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Contoh: Nuansa Solution"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              value={data.companyAddress}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              placeholder="Jl. Sudirman No. 1, Jakarta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.companyPhone}
              onChange={(e) => updateField('companyPhone', e.target.value)}
              placeholder="0812-3456-7890"
            />
          </div>
        </div>
      )}

      {/* Invoice Details & Client (Grouped logically) */}
      <SectionHeader id="details" title="Detail Invoice & Client" step="2" />
      {expandedSection === 'details' && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Invoice</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </div>
          </div>
          <hr className="border-gray-100" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagihan Untuk (Client)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="Nama Client"
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              value={data.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
              placeholder="Alamat Client"
            />
          </div>
        </div>
      )}

      {/* 3. Items */}
      <SectionHeader id="items" title="Produk / Jasa" step="3" />
      {expandedSection === 'items' && (
        <div className="p-4 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-8">
                    <input
                      type="text"
                      className="w-full p-2 text-sm border-b border-gray-200 focus:border-blue-500 outline-none font-medium mb-1"
                      placeholder="Nama Item / Jasa"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-1 text-xs text-gray-500 border-none focus:ring-0 outline-none bg-transparent"
                      placeholder="Keterangan tambahan (opsional)"
                      value={item.notes || ''}
                      onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] uppercase text-gray-400 font-bold">Qty</label>
                    <input
                      type="number"
                      className="w-full p-1 border border-gray-200 rounded text-center"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-8 sm:col-span-2">
                     <label className="text-[10px] uppercase text-gray-400 font-bold">Harga</label>
                    <input
                      type="number"
                      className="w-full p-1 border border-gray-200 rounded text-right"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            <button
              onClick={addItem}
              className="w-full py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Tambah Item
            </button>
          </div>
        </div>
      )}

      {/* 4. Financials */}
      <SectionHeader id="financials" title="Pembayaran & Pajak" step="4" />
      {expandedSection === 'financials' && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Tax Selection - Checkboxes */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3">Setting Pajak</label>
            <div className="space-y-3">
              {data.taxSettings.map((tax) => (
                <div key={tax.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`tax-${tax.id}`}
                      checked={tax.enabled}
                      onChange={() => toggleTax(tax.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor={`tax-${tax.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                      {tax.id === 'manual' ? (
                        <input 
                           type="text" 
                           value={tax.name}
                           onChange={(e) => updateTaxName(tax.id, e.target.value)}
                           className="border-b border-gray-300 focus:border-blue-500 outline-none w-24 px-1"
                           placeholder="Nama Pajak"
                        />
                      ) : tax.name}
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={tax.rate}
                      onChange={(e) => updateTaxRate(tax.id, Number(e.target.value))}
                      className="w-14 p-1 text-sm border border-gray-300 rounded text-right focus:border-blue-500 outline-none"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">*Centang untuk mengaktifkan pajak. Rate bisa diubah sesuai kebutuhan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
               <input
                 list="payment-methods"
                 className="w-full p-2 border border-gray-300 rounded-md"
                 value={data.paymentMethod}
                 onChange={(e) => updateField('paymentMethod', e.target.value)}
                 placeholder="Pilih atau ketik..."
               />
               <datalist id="payment-methods">
                 <option value="Transfer Bank BCA" />
                 <option value="Transfer Bank Mandiri" />
                 <option value="Cash / Tunai" />
                 <option value="QRIS" />
               </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening (Opsional)</label>
               <input
                 type="text"
                 className="w-full p-2 border border-gray-300 rounded-md"
                 value={data.accountNumber || ''}
                 onChange={(e) => updateField('accountNumber', e.target.value)}
                 placeholder="Contoh: 1234567890"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama (Opsional)</label>
               <input
                 type="text"
                 className="w-full p-2 border border-gray-300 rounded-md"
                 value={data.accountName || ''}
                 onChange={(e) => updateField('accountName', e.target.value)}
                 placeholder="Contoh: PT Nuansa Solution"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Sudah Dibayar (Rp)</label>
               <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={data.amountPaid}
                  onChange={(e) => updateField('amountPaid', Number(e.target.value))}
                />
            </div>
          </div>
        </div>
      )}

      {/* 5. Signature & Styling */}
      <SectionHeader id="extras" title="TTD & Stempel" step="5" />
      {expandedSection === 'extras' && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanda Tangan</label>
              <TTDUpload 
                signatureImage={data.signatureImage}
                onSignatureChange={(val) => updateField('signatureImage', val)}
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Stempel (Opsional)</label>
              <div className="flex items-center gap-4">
                {data.stampImage ? (
                  <div className="relative group w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={data.stampImage} alt="Stamp" className="max-w-full max-h-full object-contain" />
                    <button 
                      onClick={() => updateField('stampImage', null)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 w-full sm:w-auto min-w-[150px]">
                    <Upload size={20} className="mb-2" />
                    <span className="text-xs">Upload Stempel</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleStampUpload} />
                  </label>
                )}
                {data.stampImage && (
                  <div className="text-sm text-gray-500">
                    Stempel berhasil diupload.
                  </div>
                )}
              </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Warna Nuansa Invoice</label>
             <div className="flex gap-2">
                {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#1F2937'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateField('primaryColor', color)}
                    className={`w-8 h-8 rounded-full border-2 ${data.primaryColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input 
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded overflow-hidden cursor-pointer"
                />
             </div>
           </div>
        </div>
      )}
      
    </div>
  );
};

export default FormInput;