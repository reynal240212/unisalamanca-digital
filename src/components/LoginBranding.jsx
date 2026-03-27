import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginBranding = () => {
  const navigate = useNavigate();

  return (
    <div className="login-info">
      <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/images/escudo.png" alt="Logo" style={{ width: '32px', filter: 'brightness(0) invert(1)' }} />
        <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>UNISALAMANCA</span>
      </div>

      <div style={{ transform: 'translateY(-20px)' }}>
        <img 
          src="/images/salmi.png"
          alt="Salmi" 
          className="salmi-animation"
        />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '20px', lineHeight: 1.2 }}>
          Tu Identidad Digital,<br/>Más Segura que Nunca
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '12px', fontSize: '0.9rem', maxWidth: '300px', margin: '12px auto' }}>
          Accede a tu carnet institucional y servicios universitarios en un solo lugar.
        </p>
      </div>

      <button 
        onClick={() => navigate('/')} 
        style={{ 
          position: 'absolute', bottom: '40px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.3)',
          color: 'white', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        <ArrowLeft size={16} /> REGRESAR AL PORTAL
      </button>
    </div>
  );
};

export default LoginBranding;
