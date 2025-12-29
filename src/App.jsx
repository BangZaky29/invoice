import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FormSection from './components/FormSection';
import PreviewSection from './components/PreviewSection';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    companyInfo: {
      logo: '',
      nama: '',
      alamat: '',
      telp: '',
      hp: '',
      npwp: ''
    },
    clientInfo: {
      nama: '',
      alamat: '',
      invoice: '',
      tanggal: new Date().toISOString().split('T')[0],
      jatuhTempo: '',
      telp: '',
      npwp: ''
    },
    products: [
      {
        id: 1,
        nama: '',
        deskripsi: '',
        qty: '',
        harga: '',
        disc: '',
        pajak: ''
      }
    ],
    payment: {
      keterangan: '',
      syarat: '',
      diskonTambahan: '',
      downPayment: '',
      tglJatuhTempo: '',
      noDownPayment: ''
    }
  });

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            <FormSection formData={formData} setFormData={setFormData} />
            <PreviewSection formData={formData} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;