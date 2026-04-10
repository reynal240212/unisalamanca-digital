import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, LogOut, Menu, Image as ImageIcon, 
  Heart, BarChart2, ShieldCheck, UserCircle 
} from 'lucide-react';
import PhotoValidationModule from '../components/PhotoValidationModule';

const BienestarDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('validacion');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalEstudiantes: 0, pendientesFoto: 0 });

  useEffect(() => {
    if (!user || (user.role !== 'BIENESTAR' && user.role !== 'ADMIN')) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from('user')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'ESTUDIANTE');

    const { count: pending } = await supabase
      .from('user')
      .select('*', { count: 'exact', head: true })
      .eq('photo_status', 'pending');

    setStats({ totalEstudiantes: total || 0, pendientesFoto: pending || 0 });
  };

  const navItems = [
    { id: 'validacion', icon: <ImageIcon size={18} />, label: 'Validación de Fotos' },
    { id: 'estudiantes', icon: <Users size={18} />, label: 'Directorio Estudiantil' },
    { id: 'reportes', icon: <BarChart2 size={18} />, label: 'Reportes de Bienestar' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar">
        <span style={{ fontWeight: 900, color: 'var(--primary)' }}>Bienestar Universitario</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle">
          <Menu size={20} />
        </button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '14px', 
              background: 'linear-gradient(135deg, #ec4899, #be185d)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 900, color: 'white', fontSize: '1.2rem' 
            }}>
              {(user?.name || 'B').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0, color: 'white' }}>{user?.name?.split(' ')[0]}</p>
              <span style={{ 
                fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', 
                background: 'rgba(236, 72, 153, 0.2)', color: '#fbcfe8', 
                padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' 
              }}>
                Bienestar
              </span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          {user?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')} className="admin-nav-item" style={{ marginBottom: '12px', borderLeft: '3px solid var(--secondary)', background: 'rgba(255,255,255,0.05)' }}>
              <ImageIcon size={18} style={{ transform: 'rotate(180deg)' }} /> <span>Volver a Admin</span>
            </button>
          )}
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }}
              className={`admin-nav-item ${activeNav === item.id ? 'active' : ''}`}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-logout-premium">
            <LogOut size={18} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-container">
        <div className="section-reveal">
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Panel de Bienestar</h1>
            <p style={{ color: '#64748b' }}>Gestión de identidad y acompañamiento estudiantil</p>
          </div>

          <div className="responsive-grid-3" style={{ marginBottom: '40px' }}>
            <div className="kpi-card">
              <div className="kpi-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}><Users size={22} /></div>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Estudiantes</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{stats.totalEstudiantes}</h3>
            </div>
            <div className="kpi-card" style={{ border: '2px solid rgba(22, 182, 214, 0.2)' }}>
              <div className="kpi-icon-box" style={{ background: '#ecfeff', color: 'var(--primary)' }}><ImageIcon size={22} /></div>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Fotos Pendientes</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{stats.pendientesFoto}</h3>
            </div>
          </div>

          {activeNav === 'validacion' && <PhotoValidationModule />}
          
          {activeNav === 'estudiantes' && (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
               <UserCircle size={48} color="#94a3b8" style={{ marginBottom: '20px' }} />
               <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Directorio Estudiantil</h3>
               <p style={{ color: '#64748b' }}>Acceso a fichas técnicas y caracterización en desarrollo.</p>
            </div>
          )}
          
          {activeNav === 'reportes' && (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
               <BarChart2 size={48} color="#94a3b8" style={{ marginBottom: '20px' }} />
               <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Reportes de Bienestar</h3>
               <p style={{ color: '#64748b' }}>Gráficas de riesgo y deserción próximamente.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BienestarDashboard;
