import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginBranding = () => {
  const navigate = useNavigate();

  return (
    <div className="login-info">
      <div className="login-info-header">
        <img src="/images/escudo.png" alt="Logo" className="login-info-logo" />
        <span className="siau-acronym light" title="Sistema Integral de Administración Universitaria" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
          <span className="si">SI</span><span className="au">AU</span>
        </span>
      </div>

      <div className="login-info-content">
        <img 
          src="/images/salmi-premium.png" 
          alt="Salmi Premium Mascot" 
          className="salmi-animation login-mascot"
        />
        <h2 className="login-branding-h2">
          Tu Identidad Digital,<br/>Más Segura que Nunca
        </h2>
        <p className="login-branding-p">
          Accede a tu carnet institucional y servicios universitarios en un solo lugar.
        </p>
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="btn-return-portal"
      >
        <ArrowLeft size={16} /> REGRESAR AL PORTAL
      </button>
    </div>
  );
};

export default LoginBranding;
