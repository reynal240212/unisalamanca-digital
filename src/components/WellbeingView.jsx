import React, { useState } from 'react';
import { 
  HeartPulse, Activity, Users, Calendar, 
  MapPin, Clock, ChevronRight, Info, CheckCircle2, Database
} from 'lucide-react';

const WellbeingView = ({ user }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const services = [
    { id: 'psicologia', name: 'Apoyo Psicológico', icon: <HeartPulse size={24} />, color: '#ec4899', desc: 'Asesoría profesional para tu salud mental y emocional.' },
    { id: 'deportes', name: 'Deportes y Recreación', icon: <Activity size={24} />, color: '#16a34a', desc: 'Inscripción a torneos, gimnasio y actividades físicas.' },
    { id: 'cultura', name: 'Cultura y Arte', icon: <Users size={24} />, color: '#f59e0b', desc: 'Talleres de danza, música, teatro y grupos culturales.' },
  ];

  const upcomingAppointments = [
    { service: 'Orientación Académica', date: '15 Abr 2026', time: '10:00 AM', status: 'Confirmada' },
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedService(null);
      setBookingSuccess(false);
    }, 2000);
  };

  return (
    <div className="section-reveal wellbeing-container">
      {/* HEADER */}
      <div className="grades-header-premium glass-card">
        <div className="grades-header-main">
          <div className="header-icon-box" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <HeartPulse size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Bienestar Universitario</h1>
            <p className="welcome-subtitle">Tu desarrollo integral es nuestra prioridad. Accede a salud, deporte y cultura.</p>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: ESTADO VACÍO */}
      <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', marginTop: '24px' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899',
          margin: '0 auto 20px'
        }}>
          <Database size={40} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-dark)' }}>Sincronización de Servicios Pendiente</h3>
          <p style={{ color: '#64748b', maxWidth: '450px', margin: '8px auto' }}>
            Los servicios de **Bienestar Universitario** (Salud, Deportes y Cultura) están siendo integrados con el sistema de agendamiento central.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
          <span className="status-tag en-curso" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <Clock size={14} /> Configurando Agenda
          </span>
        </div>

        <div className="table-footer-info" style={{ marginTop: '50px' }}>
          <Info size={16} /> 
          <p>La atención presencial en el Bloque C continúa funcionando con normalidad para todos los estudiantes.</p>
        </div>
      </div>

      {/* MODAL DE AGENDAMIENTO */}
      {selectedService && (
        <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative' }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontWeight: 900, color: 'var(--primary-dark)' }}>Cita Agendada</h2>
                <p style={{ color: '#64748b' }}>Te esperamos en Bienestar el {new Date().toLocaleDateString('es-ES')}.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedService.color }}>
                      {selectedService.icon}
                   </div>
                   <h2 style={{ fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>Solicitar {selectedService.name}</h2>
                </div>
                
                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="input-label-premium">Motivo de Consulta</label>
                    <textarea 
                      placeholder="Breve descripción..." 
                      className="select-premium" 
                      style={{ width: '100%', height: '80px', paddingTop: '12px', resize: 'none' }}
                    ></textarea>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="input-label-premium">Fecha Sugerida</label>
                      <input type="date" className="select-premium" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label className="input-label-premium">Jornada</label>
                      <select className="select-premium" style={{ width: '100%' }}>
                        <option>Mañana</option>
                        <option>Tarde</option>
                        <option>Noche</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="button" className="nav-item-premium" onClick={() => setSelectedService(null)} style={{ margin: 0, justifyContent: 'center' }}>CANCELAR</button>
                    <button type="submit" className="btn-login-modern" style={{ margin: 0, flex: 1, background: selectedService.color }}>CONFIRMAR</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellbeingView;
