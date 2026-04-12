import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';
import { ShieldAlert, Lock, Save, ArrowRight, CheckCircle2 } from 'lucide-react';

const ChangePassword = () => {
  const { user, login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
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
      
      // Actualizar el objeto de usuario localmente si es posible, o forzar re-login
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
      setError('Error al actualizar la contraseña: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ maxWidth: '450px', padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '12px' }}>¡Contraseña Actualizada!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '32px' }}>Tu cuenta ahora está protegida. Te estamos redirigiendo a tu panel principal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="identity-overlay">
        <div className="identity-mesh"></div>
      </div>

      <div className="login-card" style={{ maxWidth: '500px', flexDirection: 'column' }}>
        <div style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', width: '64px', height: '64px', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '16px', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldAlert size={32} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>Seguridad de Cuenta</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Por políticas institucionales, debes establecer una contraseña privada en tu primer ingreso.</p>
          </div>

          <form onSubmit={handleUpdatePassword}>
            <div className="input-group">
              <label><Lock size={12} style={{ marginRight: '6px' }} /> Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                placeholder="Mínimo 6 caracteres"
                onChange={e => setPassword(e.target.value)}
                required
                className="input-premium"
              />
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label><Lock size={12} style={{ marginRight: '6px' }} /> Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Repite tu contraseña"
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="input-premium"
              />
            </div>

            {error && (
              <div style={{ padding: '12px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button 
              className="login-button" 
              style={{ width: '100%' }} 
              disabled={isLoading}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {isLoading ? 'ACTUALIZANDO...' : 'GUARDAR Y CONTINUAR'} <ArrowRight size={18} />
              </span>
            </button>
          </form>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
            <p style={{ fontSize: '0.75rem', color: '#b45309', display: 'flex', gap: '8px' }}>
              <Lock size={14} style={{ flexShrink: 0 }} />
              <span>Asegúrate de usar una contraseña que no compartas con otros sitios para garantizar la seguridad de tu información académica.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
