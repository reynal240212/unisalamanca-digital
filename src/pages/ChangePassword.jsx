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
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
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
      }, 2000);

    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="login-page">
        <div className="identity-overlay"><div className="identity-mesh"></div></div>
        <div className="login-card" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', textAlign: 'center' }}>
          <div className="login-form-side" style={{ alignItems: 'center', padding: '60px 40px' }}>
            <div className="success-pulse" style={{ marginBottom: '24px' }}>
              <CheckCircle2 size={60} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '12px' }}>¡Acceso Asegurado!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tu contraseña ha sido actualizada. Redirigiendo al campus digital...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="identity-overlay">
        <div className="identity-mesh"></div>
      </div>

      <div className="login-card">
        {/* Panel Izquierdo - Informativo (Se oculta en móvil automáticamente por CSS) */}
        <div className="login-info">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '15px' }}>
                <ShieldCheck size={32} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>UniSalamanca</h2>
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
              Seguridad de <span style={{ color: 'rgba(255,255,255,0.7)' }}>Cuenta</span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '40px', lineHeight: 1.6 }}>
              Para garantizar la integridad de tu identidad digital, debes establecer una contraseña privada en tu primer ingreso.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
              {[
                'Cifrado avanzado de extremo a extremo',
                'Protección contra accesos no autorizados',
                'Validación de identidad institucional'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.08)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario (Responsivo y Adaptable) */}
        <div className="login-form-side">
          <div className="login-form-container">
            <div className="form-header">
              <h2 className="form-title">Establecer Clave</h2>
              <p className="form-subtitle">Configura tu nueva contraseña de acceso.</p>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="input-group">
                <label>Nueva Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    placeholder="Mínimo 6 caracteres"
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '50px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '30px' }}>
                <label>Confirmar Contraseña</label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Repite la contraseña"
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ 
                  padding: '15px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderLeft: '4px solid var(--error)', 
                  borderRadius: '10px', 
                  marginBottom: '25px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <ShieldAlert size={20} color="var(--error)" />
                  <span style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700 }}>{error}</span>
                </div>
              )}

              <button className="login-button" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'PROCESANDO...' : 'ACTUALIZAR Y ENTRAR'}
                <ArrowRight size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
              </button>
            </form>

            <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '15px', display: 'flex', gap: '12px' }}>
              <Info size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Usa una combinación de letras, números y símbolos para mayor seguridad. No compartas esta clave con nadie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
