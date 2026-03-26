import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({
      q: `${num1} + ${num2} = ?`,
      a: num1 + num2
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (parseInt(captchaInput) !== captcha.a) {
      setError('Captcha incorrecto. Inténtalo de nuevo.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      // Success redirection based on role
      if (user.role === 'VALIDADOR') {
        navigate('/validator');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Error en el inicio de sesión');
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="info-side">
          <div className="mascot-container">
            <img src="/images/squirrel.png" alt="Mascota" />
          </div>
          <h2>NUESTRA COMUNIDAD</h2>
          <p>El talento se está moviendo y merece ser visto. Muy pronto lo verás...</p>
        </div>
        
        <div className="form-side">
          <div className="logo-box">
            <img src="/images/logo.png" alt="Logo" />
            <p>Identidad Digital Estudiantil</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo Universitario</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="usuario@unisalamanca.edu.co" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Tu contraseña" 
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            
            <div className="captcha-box">
              <label className="captcha-header">Verificación de Seguridad</label>
              <div className="captcha-content">
                <div className="puzzle-text">{captcha.q}</div>
                <input 
                  type="number" 
                  value={captchaInput} 
                  onChange={(e) => setCaptchaInput(e.target.value)} 
                  placeholder="?" 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                "INGRESAR AHORA"
              )}
            </button>
            
            {error && <div className="error-msg" style={{ display: 'block' }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
