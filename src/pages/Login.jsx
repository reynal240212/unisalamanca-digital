import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, Mail, Lock, GraduationCap, Briefcase, BookOpen, Shield, BookMarked, Award, FileText, CreditCard, UserPlus, Heart, Scan, UserCircle } from 'lucide-react';
import LoginBranding from '../components/LoginBranding';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();

  const { login, user, activeRole, selectRole, loading } = useAuth();
  const navigate = useNavigate();
  const [pendingProfiles, setPendingProfiles] = useState(null);

  // Si ya hay sesión activa, redirigir al dashboard correspondiente
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (user.must_change_password) {
      navigate('/change-password', { replace: true });
      return;
    }

    const userRoles = user.roles || [user.role];
    
    // Si tiene múltiples roles y no ha seleccionado uno, mostramos el selector
    if (userRoles.length > 1 && !activeRole) {
      setPendingProfiles(userRoles);
      return;
    }

    // Usar el rol activo o el primero disponible
    const currentRole = activeRole || userRoles[0];

    const roleMap = {
      ADMIN: '/admin',
      COORD_ACADEMICO: '/academic',
      DIRECTOR_PROGRAMA: '/academic',
      PROFESOR: '/teacher',
      SECRETARIA_ACADEMICA: '/registro',
      CARTERA: '/cartera',
      ADMISIONES: '/admisiones',
      BIENESTAR: '/bienestar',
      VALIDADOR: '/validator',
      ESTUDIANTE: '/student',
      EGRESADO: '/student',
    };
    navigate(roleMap[currentRole] || '/student', { replace: true });
  }, [user, activeRole, loading, navigate]);

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
      
      if (u.must_change_password) {
        navigate('/change-password', { replace: true });
        return;
      }

      // La navegación ahora la maneja el useEffect basado en activeRole
    } catch (err) {
      setError('Credenciales inválidas o cuenta suspendida');
      setCaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (r) => {
    switch(r) {
      case 'ESTUDIANTE': case 'EGRESADO': return <GraduationCap size={24} />;
      case 'PROFESOR': return <BookOpen size={24} />;
      case 'ADMIN': return <Shield size={24} />;
      case 'COORD_ACADEMICO': return <BookMarked size={24} />;
      case 'DIRECTOR_PROGRAMA': return <Award size={24} />;
      case 'SECRETARIA_ACADEMICA': return <FileText size={24} />;
      case 'CARTERA': return <CreditCard size={24} />;
      case 'ADMISIONES': return <UserPlus size={24} />;
      case 'BIENESTAR': return <Heart size={24} />;
      case 'VALIDADOR': return <Scan size={24} />;
      default: return <UserCircle size={24} />;
    }
  };
  const formatRoleName = (r) => r.replace('_', ' ').toLowerCase();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getRoleImage = (role) => {
    switch(role) {
      case 'ESTUDIANTE':       return '/images/salmi-estudiante.png';
      case 'EGRESADO':         return '/images/salmi-egresado.png';
      case 'PROFESOR':         return '/images/salmi-profesor.png';
      case 'ADMIN':            return '/images/salmi-admin.png';
      case 'COORD_ACADEMICO':  return '/images/salmi-director.png';
      case 'DIRECTOR_PROGRAMA':return '/images/salmi-director.png';
      case 'SECRETARIA_ACADEMICA': return '/images/salmi-secretaria.png';
      case 'CARTERA':          return '/images/salmi-cartera.png';
      case 'ADMISIONES':       return '/images/salmi-admisiones.png';
      case 'BIENESTAR':        return '/images/salmi-bienestar.png';
      case 'VALIDADOR':        return '/images/salmi-validador.png';
      default:                 return '/images/salmi-admin.png';
    }
  };

  if (pendingProfiles) {
    return (
      <div className="login-page profile-switcher-bg">
        <div className="identity-overlay">
          <div className="identity-mesh" style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}></div>
          <div className="identity-shields">
            <img src="/images/escudo.png" alt="" className="shield shield-1" style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }} />
            <img src="/images/escudo.png" alt="" className="shield shield-2" style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }} />
          </div>
          <div className="identity-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle p-${i + 1}`}></div>
            ))}
          </div>
        </div>

        <div className="profile-switcher-content section-reveal">
          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>
            Bienvenido, <span style={{ color: 'var(--secondary)' }}>{user?.name.split(' ')[0]}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '60px', fontWeight: 500 }}>
            Selecciona tu perfil para ingresar.
          </p>
          
          <div className="profiles-grid">
            {pendingProfiles.map(role => (
              <div key={role} className="profile-card" onClick={() => selectRole(role)}>
                <div className={`profile-avatar-circle role-${role.toLowerCase()}`}>
                  <img src={getRoleImage(role)} alt={role} className="profile-salmi-img" />
                  <div className="role-icon-badge">
                    {getRoleIcon(role)}
                  </div>
                </div>
                <div className="profile-label">{formatRoleName(role)}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .profile-switcher-bg {
            min-height: 100vh;
            background: radial-gradient(circle at center, #2a2266 0%, #1a1540 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            font-family: 'Outfit', sans-serif;
          }
          .profile-switcher-content {
            position: relative;
            z-index: 10;
            text-align: center;
            animation: fadeIn 0.8s ease-out forwards;
            padding: 20px;
          }
          .profile-salmi-img {
            width: 140px;
            height: 140px;
            object-fit: contain;
            transition: all 0.4s;
            mix-blend-mode: multiply;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
          }
          .role-icon-badge {
            position: absolute;
            bottom: -10px;
            right: -10px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border: 3px solid #f8fafc;
            transition: all 0.4s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .profiles-grid {
            display: flex;
            gap: 50px;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            max-width: 1000px;
            margin: 0 auto;
          }
          .profile-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .profile-card:hover {
            transform: translateY(-15px) scale(1.1);
          }
          .profile-card:hover .profile-salmi-img {
            transform: scale(1.1);
          }
          .profile-card:hover .profile-avatar-circle {
            box-shadow: 0 0 0 6px rgba(22, 182, 214, 0.2), 0 0 40px rgba(22, 182, 214, 0.4);
            border-color: var(--secondary);
          }
          .profile-card:hover .role-icon-badge {
            background: var(--secondary);
            color: white;
            transform: scale(1.1) rotate(10deg);
          }
          .profile-card:hover .profile-label {
            color: var(--secondary);
            text-shadow: 0 0 10px rgba(22, 182, 214, 0.5);
          }
          .profile-avatar-circle {
            width: 170px;
            height: 170px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.05);
            border: 3px solid rgba(255,255,255,0.1);
            transition: all 0.4s;
            position: relative;
            backdrop-filter: blur(10px);
            background-clip: padding-box;
          }
          
          .role-estudiante, .role-egresado { background: linear-gradient(135deg, rgba(22, 182, 214, 0.1), rgba(42, 34, 102, 0.4)); }
          .role-profesor { background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(42, 34, 102, 0.4)); }
          .role-admin { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(42, 34, 102, 0.4)); }
          
          .profile-label {
            color: white;
            font-size: 1.4rem;
            font-weight: 700;
            text-transform: capitalize;
            transition: all 0.3s;
            letter-spacing: -0.5px;
          }
        `}</style>
      </div>
    );
  }

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
          <div className="form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(42, 34, 102, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={24} color="var(--primary)" />
                  </div>
                  <h1 className="form-title">Iniciar Sesión</h1>
                </div>
                <p className="form-subtitle">Ingresa tus credenciales institucionales para continuar.</p>
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
