const Footer = () => {
  return (
    <footer className="no-print" style={{
      background: 'linear-gradient(135deg, var(--gray-800) 0%, var(--gray-900) 100%)',
      color: 'white',
      marginTop: 'auto',
      padding: '2rem 0',
      borderTop: '3px solid var(--blue-500)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '0.95rem',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Generator Invoice - Professional Invoicing Made Easy
          </p>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--gray-400)',
            marginTop: '0.5rem'
          }}>
            © 2022 Nuansa Solution | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;