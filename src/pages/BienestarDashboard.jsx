import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, LogOut, Menu, Image as ImageIcon, 
  Heart, BarChart2, ShieldCheck, UserCircle, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import PhotoValidationModule from '../components/PhotoValidationModule';
import DashboardLayout from '../components/layout/DashboardLayout';

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
  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      title: 'Administración',
      items: [
        { id: 'back_admin', icon: <ArrowLeft size={18} />, label: 'Volver a Panel Admin', onClick: () => navigate('/admin') }
      ]
    }] : []),
    {
      title: 'Gestión Institucional',
      items: [
        { id: 'validacion', icon: <ImageIcon size={18} />, label: 'Validación de Fotos', onClick: () => setActiveNav('validacion') },
        { id: 'estudiantes', icon: <Users size={18} />, label: 'Expedientes', onClick: () => setActiveNav('estudiantes') },
        { id: 'reportes', icon: <BarChart2 size={18} />, label: 'Analítica de Riesgo', onClick: () => setActiveNav('reportes') },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        {/* HEADER SECTION */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-1.2px' }}>
            Bienestar Universitario
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1.1rem', fontWeight: 500 }}>
            Infraestructura de acompañamiento y validación estudiantil.
          </p>
        </div>

        {/* METRICS SUMMARY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div className="kpi-card" style={{ padding: '32px' }}>
            <div className="kpi-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <Users size={24} />
            </div>
            <p style={{ margin: '16px 0 6px', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Población Estudiantil</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1e293b', margin: 0, lineHeight: 1 }}>{stats.totalEstudiantes}</h3>
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, paddingBottom: '8px' }}>+ Activos</span>
            </div>
          </div>

          <div className="kpi-card" style={{ padding: '32px', border: '2px solid rgba(22, 182, 214, 0.2)' }}>
            <div className="kpi-icon-box" style={{ background: '#ecfeff', color: 'var(--primary)' }}>
              <ImageIcon size={24} />
            </div>
            <p style={{ margin: '16px 0 6px', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Verificaciones Pendientes</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary)', margin: 0, lineHeight: 1 }}>{stats.pendientesFoto}</h3>
              <button 
                onClick={() => setActiveNav('validacion')} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', paddingBottom: '8px' }}
              >
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MODULE RENDERER */}
        <div className="section-reveal">
          {activeNav === 'validacion' && (
             <div style={{ background: 'white', borderRadius: '32px', padding: '10px', boxShadow: 'var(--card-shadow)', border: '1px solid #f1f5f9' }}>
               <PhotoValidationModule />
             </div>
          )}
          
          {activeNav === 'estudiantes' && (
            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '32px', border: '1px dotted #e2e8f0' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#94a3b8' }}>
                 <UserCircle size={48} />
               </div>
               <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', marginBottom: '12px' }}>Directorio y Expedientes</h3>
               <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                 En la siguiente fase, podrás acceder a las fichas técnicas, historial de caracterización y seguimientos psicosociales de cada estudiante.
               </p>
               <button className="btn-secondary-premium" style={{ marginTop: '32px', padding: '12px 32px' }}>Solicitar Acceso Temprano</button>
            </div>
          )}
          
          {activeNav === 'reportes' && (
            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '32px' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#0ea5e9' }}>
                 <BarChart2 size={48} />
               </div>
               <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', marginBottom: '12px' }}>Inteligencia de Datos</h3>
               <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                 Estamos integrando algoritmos de detección de riesgo de deserción y analítica de salud mental institucional. Estará disponible en el próximo ciclo académico.
               </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
  );
};

export default BienestarDashboard;
