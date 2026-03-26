import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';

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
    const n1 = Math.floor(Math.random() * 8) + 1;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptcha({ q: `${n1} + ${n2} = ?`, a: n1 + n2 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(captchaInput) !== captcha.a) {
      setError('Verificación de seguridad incorrecta');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsLoading(true);
    try {
      const u = await login(email, password);
      if (u.role === 'ADMIN') navigate('/admin');
      else if (u.role === 'VALIDADOR') navigate('/validator');
      else navigate('/student');
    } catch (err) {
      setError('Credenciales inválidas o cuenta suspendida');
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LADO IZQUIERDO: Branding e Info */}
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

        {/* LADO DERECHO: Formulario */}
        <div className="login-form-side">
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(42, 34, 102, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} color="var(--primary)" />
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Iniciar Sesión</h1>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ingresa tus credenciales institucionales para continuar.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label><Mail size={12} style={{ marginRight: '6px' }} /> Correo Institucional</label>
              <input 
                type="email" 
                value={email} 
                placeholder="nombre.apellido@unisalamanca.edu.co" 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label><Lock size={12} style={{ marginRight: '6px' }} /> Contraseña</label>
              <input 
                type="password" 
                value={password} 
                placeholder="••••••••••••" 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1.5px solid #f1f5f9', marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                🔒 Verificación de Seguridad
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px 15px', background: '#2A2266', color: 'white', borderRadius: '10px', fontWeight: 900, fontSize: '1rem' }}>
                  {captcha.q}
                </div>
                <input 
                  type="number" 
                  value={captchaInput} 
                  placeholder="Resultado"
                  onChange={e => setCaptchaInput(e.target.value)} 
                  required 
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', textAlign: 'center', fontWeight: 700 }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button className="login-button" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'VERIFICANDO...' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  INGRESAR AL PANEL <LogIn size={18} />
                </span>
              )}
            </button>
          </form>

          <footer style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              ¿Olvidaste tu acceso? <a href="#" style={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none' }}>Solicitar Ayuda</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
