import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

const ChangePassword = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña es demasiado corta (mínimo 6 caracteres).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const { error: updateError } = await supabase
        .from('user')
        .update({ 
          password_hash: hash, 
          must_change_password: false 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setIsSuccess(true);
      
      const updatedUser = { ...user, must_change_password: false };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        const roleMap = {
          ADMIN: '/admin',
          PROFESOR: '/teacher',
          ESTUDIANTE: '/student',
          COORD_ACADEMICO: '/academic',
        };
        navigate(roleMap[user.role] || '/student', { replace: true });
      }, 2500);

    } catch (err) {
      setError('Error crítico de actualización: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="login-page">
        <div className="identity-overlay"><div className="identity-mesh"></div></div>
        <div className="login-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
          <div className="success-pulse" style={{ margin: '0 auto 30px' }}>
            <CheckCircle2 size={48} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>¡Seguridad Validada!</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>Tu nueva contraseña ha sido establecida correctamente. Iniciando sesión segura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Fondo Premium */}
      <div className="identity-overlay">
        <div className="identity-mesh"></div>
      </div>

      <div className="login-card" style={{ maxWidth: '900px', padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="responsive-grid-2" style={{ gap: 0 }}>
          
          {/* Panel Lateral Informativo */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', 
            padding: '60px 40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <ShieldCheck size={28} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>UniSalamanca <span style={{ opacity: 0.7 }}>Digital</span></span>
              </div>
              
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>Asegura tu Identidad</h2>
              <p style={{ opacity: 0.8, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
                Para proteger tu información académica, es obligatorio establecer una contraseña personal y única en tu primer inicio de sesión.
              </p>

              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  'Usa mayúsculas y números',
                  'Evita fechas de nacimiento',
                  'No compartas tus credenciales'
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            {/* Elemento decorativo */}
            <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
          </div>

          {/* Formulario de Configuración */}
          <div style={{ padding: '60px 50px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Nueva Contraseña</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Escribe tu nueva clave y confírmala para continuar.</p>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="input-group">
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.85rem' }}>
                   NUEVA CONTRASEÑA
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    placeholder="Escribe tu contraseña segura"
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="input-premium"
                    style={{ paddingRight: '45px', background: 'white' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.85rem' }}>
                   CONFIRMAR CONTRASEÑA
                </label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Repite la contraseña"
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="input-premium"
                  style={{ background: 'white' }}
                />
              </div>

              {error && (
                <div style={{ padding: '16px', background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ShieldAlert size={20} color="#e11d48" />
                  <p style={{ fontSize: '0.88rem', color: '#be123c', fontWeight: 600 }}>{error}</p>
                </div>
              )}

              <button 
                className="login-button" 
                style={{ width: '100%', padding: '18px', fontSize: '1rem', fontWeight: 800 }} 
                disabled={isLoading}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  {isLoading ? 'ASEGURANDO CUENTA...' : 'GUARDAR CONFIGURACIÓN'} <ArrowRight size={20} />
                </span>
              </button>
            </form>

            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
              <Info size={18} color="#3b82f6" style={{ marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                Toda la información es encriptada con tecnología SHA-256 antes de guardarse en nuestros servidores de alta seguridad.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
