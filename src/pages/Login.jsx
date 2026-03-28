import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';
import LoginBranding from '../components/LoginBranding';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Por favor completa la verificación de seguridad');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const u = await login(email, password);
      if (u.role === 'ADMIN') navigate('/admin');
      else if (u.role === 'VALIDADOR') navigate('/validator');
      else navigate('/student');
    } catch (err) {
      setError('Credenciales inválidas o cuenta suspendida');
      setCaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="login-page">
      <div className="identity-overlay">
        <div className="identity-mesh" style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}></div>

        <div className="identity-shields">
          <img src="/images/escudo.png" alt="" className="shield shield-1" style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }} />
          <img src="/images/escudo.png" alt="" className="shield shield-2" style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }} />
        </div>


        <div className="identity-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle p-${i + 1}`}></div>
          ))}
        </div>
      </div>
      <div className="login-card">
        {/* LADO IZQUIERDO: Branding e Info */}
        <LoginBranding />

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
                placeholder="usuario@unisalamanca.edu.co"
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

            <div className="security-check-card" style={{ display: 'flex', justifyContent: 'center', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', marginBottom: '25px' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={token => setCaptchaToken(token)}
                hl="es"
              />
            </div>

            {error && (
              <div style={{ padding: '12px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button 
              className="login-button" 
              style={{ width: '100%', opacity: (!captchaToken || isLoading) ? 0.7 : 1, cursor: (!captchaToken || isLoading) ? 'not-allowed' : 'pointer' }} 
              disabled={!captchaToken || isLoading}
            >
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

      <div className="login-footer-branding">
        <div className="footer-line"></div>
        <div className="footer-content">
          <div className="login-footer-text">
            <span className="text-secondary">Uni</span><span className="text-white">Salamanca</span>
          </div>
          <div className="login-footer-subtext">Corporación Universitaria Empresarial de Salamanca</div>
        </div>
        <div className="footer-line"></div>
      </div>
    </div>
  );
};

export default Login;
