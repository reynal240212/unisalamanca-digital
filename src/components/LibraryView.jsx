import React, { useState } from 'react';
import { 
  Library, Search, Book, Bookmark, Clock, 
  MapPin, CheckCircle2, ChevronRight, Info, Database
} from 'lucide-react';

const LibraryView = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
    }, 2000);
  };

  const books = [
    { title: 'Cálculo Diferencial', author: 'Stewart', status: 'Disponible', location: 'Piso 2 - Sala A' },
    { title: 'Marketing Digital 2024', author: 'Kotler', status: 'Prestado', location: 'Reserva Digital' },
    { title: 'Derecho Constitucional', author: 'Naranjo', status: 'Disponible', location: 'Piso 3 - Estante B' },
  ];

  return (
    <div className="section-reveal library-container">
      {/* HEADER */}
      <div className="grades-header-premium glass-card">
        <div className="grades-header-main">
          <div className="header-icon-box">
            <Library size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Biblioteca UniSalamanca</h1>
            <p className="welcome-subtitle">Busca recursos físicos, digitales y reserva espacios de estudio.</p>
          </div>
        </div>

        <div className="semester-selector-wrapper" style={{ minWidth: '300px' }}>
          <div className="floating-input-group" style={{ position: 'relative' }}>
            <Search className="input-icon-modern" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Buscar libros, tesis, revistas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="select-premium"
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grades-stats-grid">
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <Book className="text-primary" size={20} />
            <span>Libros Prestados</span>
          </div>
          <div className="kpi-value">02</div>
        </div>
        
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <Bookmark className="text-secondary" size={20} />
            <span>Reservas Activas</span>
          </div>
          <div className="kpi-value">01</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <Clock className="text-accent" size={20} />
            <span>Multas Pendientes</span>
          </div>
          <div className="kpi-value">$0</div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: ESTADO VACÍO */}
      <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(42, 34, 102, 0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
          margin: '0 auto 20px'
        }}>
          <Database size={40} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-dark)' }}>Sincronización Pendiente</h3>
          <p style={{ color: '#64748b', maxWidth: '400px', margin: '8px auto' }}>
            El catálogo de la **Biblioteca Física y Digital** se está sincronizando. Pronto podrás buscar y reservar recursos desde aquí.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
          <span className="status-tag en-curso">
            <Clock size={14} /> Esperando Conexión
          </span>
        </div>

        <div className="table-footer-info" style={{ marginTop: '40px' }}>
          <Info size={16} /> 
          <p>Para préstamos urgentes, por favor dirígete a la recepción de la biblioteca institucional.</p>
        </div>
      </div>

      {/* MODAL DE RESERVA SIMPLE */}
      {showBookingModal && (
        <div className="sidebar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative' }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontWeight: 900, color: 'var(--primary-dark)' }}>Reserva Exitosa</h2>
                <p style={{ color: '#64748b' }}>Te hemos enviado la confirmación a tu correo institucional.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '10px' }}>Reserva de Espacio</h2>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>Selecciona el cubículo o sala que necesites.</p>
                
                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="input-label-premium">Tipo de Espacio</label>
                    <select className="select-premium" style={{ width: '100%' }}>
                      <option>Cubículo Individual</option>
                      <option>Sala de Estudio Grupal (Máx. 6)</option>
                      <option>Laboratorio de Computación</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="input-label-premium">Horario</label>
                    <input type="datetime-local" className="select-premium" style={{ width: '100%' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="button" className="nav-item-premium" onClick={() => setShowBookingModal(false)} style={{ margin: 0, justifyContent: 'center' }}>CANCELAR</button>
                    <button type="button" className="btn-login-modern" style={{ margin: 0, flex: 1 }} onClick={handleBooking}>RESERVAR</button>
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

export default LibraryView;
