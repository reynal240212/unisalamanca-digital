import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { supabase } from '../services/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PQRSF = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    document_id: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    terms: false
  });

  const topics = [
    { id: 'peticion', name: 'Petición', desc: 'Solicitud de información o servicios.' },
    { id: 'queja', name: 'Queja', desc: 'Manifestación de inconformidad por un servicio.' },
    { id: 'reclamo', name: 'Reclamo', desc: 'Exigencia por la prestación deficiente de un servicio.' },
    { id: 'sugerencia', name: 'Sugerencia', desc: 'Propuesta para mejorar un servicio.' },
    { id: 'felicitacion', name: 'Felicitación', desc: 'Reconocimiento por un buen servicio.' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateTrackingId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PQR-${date}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newTrackingId = generateTrackingId();

    try {
      const { error: submitError } = await supabase
        .from('pqrsf')
        .insert([{
          full_name: formData.full_name,
          document_id: formData.document_id,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message,
          tracking_id: newTrackingId,
          status: 'pending'
        }]);

      if (submitError) throw submitError;

      setTrackingId(newTrackingId);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting PQRSF:', err);
      setError('Hubo un error al enviar su solicitud. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pqrsf-page">
        <Header />
        <div className="pqrsf-container" style={{ paddingTop: 'calc(var(--nav-height) + 60px)', paddingBottom: '60px' }}>
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle2 size={80} />
            </div>
            <h1>¡Solicitud Enviada!</h1>
            <p className="success-msg">
              Tu solicitud ha sido registrada exitosamente en el sistema de UniSalamanca Digital.
            </p>
            
            <div className="tracking-box">
              <span>Tu código de seguimiento es:</span>
              <div className="tracking-id">{trackingId}</div>
              <p>Guarda este código para consultar el estado de tu solicitud más adelante.</p>
            </div>

            <div className="success-actions">
              <button onClick={() => navigate('/')} className="btn-submit-premium">
                Volver al Inicio
              </button>
              <button onClick={() => setSuccess(false)} className="btn-secondary-premium">
                Enviar otra solicitud
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pqrsf-page">
      <Header />
      
      <header className="pqrsf-header" style={{ paddingTop: 'var(--nav-height)', minHeight: '300px', height: 'auto' }}>
        <div className="header-overlay"></div>
        <div className="header-content" style={{ padding: '80px 20px 100px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3.2rem', marginBottom: '10px' }}>Sistema de PQRSF</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones</p>
        </div>
      </header>

      <div className="pqrsf-main">
        <div className="pqrsf-grid">
          <div className="info-sidebar">
            <div className="info-card">
              <h3><Clock size={20} className="text-cyan" /> Tiempos de Respuesta</h3>
              <ul className="response-times">
                <li><strong>Peticiones:</strong> 15 días hábiles</li>
                <li><strong>Quejas y Reclamos:</strong> 15 días hábiles</li>
                <li><strong>Sugerencias:</strong> 10 días hábiles</li>
              </ul>
              <div className="info-footer">
                <ShieldCheck size={16} />
                <span>Tratamiento de datos según Ley 1581 de 2012</span>
              </div>
            </div>

            <div className="topic-selector-info">
              <h3>¿Qué desea radicar?</h3>
              <div className="topic-hints">
                {topics.map(t => (
                  <div key={t.id} className="topic-hint-item">
                    <strong>{t.name}:</strong> {t.desc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-card-container">
            <form onSubmit={handleSubmit} className="pqrsf-form-premium">
              {error && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-section">
                <div className="section-title">
                  <User size={18} />
                  <span>Información Personal</span>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre Completo *</label>
                    <div className="input-with-icon">
                      <User className="input-icon" size={18} />
                      <input 
                        type="text" 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez"
                        required 
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Número de Documento *</label>
                    <div className="input-with-icon">
                      <FileText className="input-icon" size={18} />
                      <input 
                        type="text" 
                        name="document_id"
                        value={formData.document_id}
                        onChange={handleInputChange}
                        placeholder="Número de identificación"
                        required 
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Correo Electrónico *</label>
                    <div className="input-with-icon">
                      <Mail className="input-icon" size={18} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ejemplo@correo.com"
                        required 
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Celular de Contacto *</label>
                    <div className="input-with-icon">
                      <Phone className="input-icon" size={18} />
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="300 000 0000"
                        required 
                        autoComplete="tel"
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">
                  <MessageSquare size={18} />
                  <span>Detalles de la Solicitud</span>
                </div>

                <div className="form-group">
                  <label>Tema de Ayuda *</label>
                  <select 
                    name="topic" 
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mensaje / Descripción *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Escriba aquí los detalles de su solicitud..."
                    rows="5"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-footer">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    Acepto la <a href="/data-policy" target="_blank">política de tratamiento de datos</a> y los términos y condiciones de UniSalamanca.
                  </span>
                </label>

                <button 
                  type="submit" 
                  className={`btn-submit-premium ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : (
                    <>
                      <span>Radicar Solicitud</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .pqrsf-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .pqrsf-header {
          height: 250px;
          background: var(--primary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .header-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          opacity: 0.9;
        }

        .header-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 0 20px;
        }

        .header-content h1 {
          font-size: 2.8rem;
          font-weight: 900;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .header-content p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .pqrsf-main {
          max-width: 1200px;
          margin: -40px auto 60px;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .pqrsf-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
        }

        .info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card, .topic-selector-info {
          background: white;
          padding: 30px;
          border-radius: 24px;
          box-shadow: var(--card-shadow);
          border: 1px solid #f1f5f9;
        }

        .info-card h3, .topic-selector-info h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .response-times {
          list-style: none;
          padding: 0;
        }

        .response-times li {
          margin-bottom: 12px;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .info-footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #f1f5f9;
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .topic-hint-item {
          font-size: 0.9rem;
          margin-bottom: 10px;
          color: var(--text-muted);
        }

        .form-card-container {
          background: white;
          padding: 40px;
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary);
          font-weight: 800;
          font-size: 1.1rem;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f8fafc;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: var(--text-muted);
        }

        .input-with-icon input {
          padding-left: 45px !important;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          transition: all 0.3s;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--secondary);
          background: white;
          box-shadow: 0 0 0 4px rgba(22, 182, 214, 0.1);
          outline: none;
        }

        .btn-submit-premium {
          width: 100%;
          background: var(--primary);
          color: white;
          padding: 18px;
          border-radius: 15px;
          border: none;
          font-size: 1.1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-submit-premium:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(42, 34, 102, 0.2);
        }

        .btn-secondary-premium {
          width: 100%;
          background: #f1f5f9;
          color: var(--primary);
          padding: 15px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          margin-top: 15px;
        }

        .success-card {
          background: white;
          padding: 60px;
          border-radius: 40px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }

        .tracking-id {
          font-size: 2rem;
          font-weight: 900;
          color: var(--primary);
          margin: 15px 0;
          background: #f0fdf4;
          padding: 15px;
          border-radius: 15px;
          border: 2px dashed var(--success);
          font-family: monospace;
        }

        .error-banner {
          background: #fef2f2;
          color: #b91c1c;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .pqrsf-grid { grid-template-columns: 1fr; }
          .info-sidebar { order: 2; }
          .form-card-container { order: 1; }
        }

        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
          .header-content h1 { font-size: 2rem; }
        }
      `}} />
    </div>
  );
};

export default PQRSF;
