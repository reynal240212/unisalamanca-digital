import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${n1} + ${n2}=?`, a: n1+n2 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (parseInt(captchaInput) !== captcha.a) {
      setError('Captcha incorrecto');
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      const u = await login(email, password);
      // Success
      if (u.role === 'ADMIN') navigate('/admin');
      else if (u.role === 'VALIDADOR') navigate('/validator');
      else navigate('/student');
    } catch (err) {
      setError(err.message);
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-info" style={{ background: 'var(--primary)' }}>
          <img src="/images/squirrel.png" alt="Mascota" style={{ width: '80%', marginBottom: '20px' }} />
          <h2 style={{ color: 'white' }}>IDENTIDAD DIGITAL</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>UniSalamanca - Innovación y Seguridad</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn-outline-white" 
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '0.8rem' }}
          >
            ← VOLVER AL INICIO
          </button>
        </div>
        <div className="login-form-side">
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <img src="/images/logo.png" alt="Logo" style={{ maxWidth: '180px' }} />
            <h3 style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '1px' }}>ACCESO INSTITUCIONAL</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Correo Institucional</label>
              <input type="email" value={email} placeholder="ejemplo@unisalamanca.edu.co" onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" value={password} placeholder="••••••••" onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="input-group" style={{ background: 'var(--bg-light)', padding: '15px', borderRadius: '12px' }}>
              <label>Verificación de Seguridad: {captcha.q}</label>
              <input type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'var(--error)', marginBottom: '15px', fontSize: '0.85rem' }}>{error}</p>}
            <button className="btn-primary" style={{ width: '100%', padding: '15px' }} disabled={isLoading}>
              {isLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            ¿Problemas para ingresar? <a href="#" style={{ color: 'var(--secondary)' }}>Contactar Soporte IT</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
