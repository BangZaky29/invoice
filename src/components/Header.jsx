import { FileText } from 'lucide-react';
import logo from '../assets/NS_white_01.png';

const Header = () => {
  return (
    <header className="no-print" style={{
      background: 'var(--gradient-primary)',
      boxShadow: 'var(--shadow-lg)',
      padding: '1.5rem 0',
      borderBottom: '3px solid var(--blue-500)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              background: 'white',
              padding: '0.875rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue-700)'
            }}>
              <img 
                    src={logo} 
                    alt="Nuansa Legal Logo" 
                    className="logo-image"
                />
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.25rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Generator Invoice
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Buat invoice profesional dengan mudah dan cepat
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;