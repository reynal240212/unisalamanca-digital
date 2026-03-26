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
        <div className="login-info">
          <img src="/images/squirrel.png" alt="Mascota" style={{ width: '80%', marginBottom: '20px' }} />
          <h2>IDENTIDAD DIGITAL</h2>
          <p>UniSalamanca - Innovación y Seguridad</p>
        </div>
        <div className="login-form-side">
          <div style={{ marginBottom: '30px' }}>
            <img src="/images/logo.png" alt="Logo" style={{ maxWidth: '200px' }} />
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Correo Institucional</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="input-group" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
              <label>Verificación: {captcha.q}</label>
              <input type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            <button className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'INGRESAR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
