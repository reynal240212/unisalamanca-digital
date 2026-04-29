import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, UserCircle, QrCode, LogOut, 
  Bell, Settings, BookOpen, ShieldCheck, Star, Calendar, Menu,
  Library, HeartPulse, Wallet, MapPin, Clock, ArrowLeft, Headphones, Sparkles, BarChart3,
  Award, Briefcase, FileText
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StudentCardComponent from '../components/StudentCardComponent';
import SalmiAdviceComponent from '../components/SalmiAdviceComponent';
import SalmiChatbot from '../components/SalmiChatbot';
import ProfileView from '../components/ProfileView';
import LibraryView from '../components/LibraryView';
import FinanceView from '../components/FinanceView';

const MOCK_JOBS = [
  { id: 1, title: 'Analista de Sistemas Senior', company: 'TechSoluciones SAS', salary: '$4.5M - $5.5M', location: 'Remoto / Bogotá', tags: ['React', 'Node.js', 'SQL'], type: 'Tiempo Completo' },
  { id: 2, title: 'Coordinador de Proyectos', company: 'Innova Global', salary: '$3.8M - $4.2M', location: 'Sede Norte', tags: ['Gestión', 'PMI', 'Agile'], type: 'Híbrido' },
  { id: 3, title: 'Desarrollador Fullstack Jr', company: 'Startup Ventures', salary: '$2.5M - $3.2M', location: 'Remoto', tags: ['Javascript', 'Python', 'Git'], type: 'Tiempo Completo' },
  { id: 4, title: 'Especialista en Marketing Digital', company: 'Creative Agency', salary: '$3.0M - $3.5M', location: 'Bogotá', tags: ['SEO', 'Ads', 'Analytics'], type: 'Freelance' },
];

const GraduateDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const navigate = useNavigate();

  const [graduateData, setGraduateData] = useState(user || {
    name: 'Cargando...',
    program: '...',
    graduation_year: '-',
    photo_url: null,
    id: '00000000'
  });

  useEffect(() => {
    if (user) {
      setGraduateData(user);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'perfil':
        return (
          <div className="section-reveal" style={{ padding: 0 }}>
             <div style={{ 
               padding: '40px', 
               background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
               borderRadius: '32px',
               color: 'white',
               marginBottom: '30px',
               position: 'relative',
               overflow: 'hidden'
             }}>
               <div style={{ position: 'relative', zIndex: 2 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '24px', 
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem'
                    }}>
                      🎓
                    </div>
                    <div>
                      <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900 }}>¡Hola, {graduateData.name.split(' ')[0]}!</h1>
                      <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '1.1rem', fontWeight: 500 }}>Orgullo UniSalamanca • Egresado de {graduateData.program}</p>
                    </div>
                 </div>
               </div>
               <div style={{ 
                 position: 'absolute', 
                 right: '-50px', 
                 top: '-50px', 
                 width: '250px', 
                 height: '250px', 
                 background: 'radial-gradient(circle, rgba(22, 182, 214, 0.15) 0%, transparent 70%)',
                 borderRadius: '50%'
               }} />
             </div>

             <div className="responsive-grid-2" style={{ gap: '24px' }}>
                <div className="kpi-card" style={{ background: 'white', padding: '30px', borderRadius: '24px' }}>
                   <div className="kpi-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                     <Award size={24} />
                   </div>
                   <h4 style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem' }}>Estado de Egresado</h4>
                   <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Título Registrado</p>
                </div>
                <div className="kpi-card" 
                  onClick={() => setActiveTab('empleo')}
                  style={{ background: 'white', padding: '30px', borderRadius: '24px', cursor: 'pointer' }}
                >
                   <div className="kpi-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                     <Briefcase size={24} />
                   </div>
                   <h4 style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem' }}>Bolsa de Empleo</h4>
                   <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{MOCK_JOBS.length} Ofertas Nuevas</p>
                </div>
             </div>
          </div>
        );
      case 'empleo':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <div className="dashboard-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 900, color: '#0f172a', margin: 0 }}>Oportunidades de Carrera</h2>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>
                {MOCK_JOBS.length} Vacantes Activas
              </span>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {MOCK_JOBS.map(job => (
                <div key={job.id} className="kpi-card dashboard-header-flex" style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                      <Briefcase size={24} color="#94a3b8" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: 800 }}>{job.title}</h4>
                      <p style={{ margin: '4px 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{job.company} • {job.location}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {job.tags.map(tag => (
                          <span key={tag} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#16a34a', fontWeight: 800, fontSize: '1.1rem' }}>{job.salary}</p>
                    <button className="btn-primary-premium" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.75rem' }}>
                      Postularme
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certificados':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
              <FileText size={64} color="var(--primary)" style={{ marginBottom: '20px' }} />
              <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Certificados y Diplomas</h2>
              <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 30px' }}>Descarga tus actas de grado, certificados de notas y duplicados de diploma de forma digital.</p>
              <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                {['Acta de Grado', 'Certificado de Notas', 'Certificado de Egresado'].map(doc => (
                  <button key={doc} className="dashboard-action-btn" style={{ justifyContent: 'space-between', padding: '16px 24px' }}>
                    <span>{doc}</span>
                    <Sparkles size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'biblioteca':
        return <div className="section-reveal" style={{ padding: '20px' }}><LibraryView user={graduateData} /></div>;
      case 'finanzas':
        return <div className="section-reveal" style={{ padding: '20px' }}><FinanceView user={graduateData} /></div>;
      case 'noticias':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px' }}>
              <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Comunidad de Egresados</h2>
              <p style={{ color: '#64748b' }}>Eventos, encuentros y noticias exclusivas para nuestra red de alumni.</p>
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                <p style={{ fontWeight: 600, color: '#94a3b8' }}>Próximamente: Muro de Egresados</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    {
      title: 'Mi Identidad Alumni',
      items: [
        { id: 'perfil', label: 'Mi Perfil de Egresado', icon: <UserCircle size={18} />, onClick: () => setActiveTab('perfil') },
        { id: 'certificados', label: 'Trámites y Diplomas', icon: <Award size={18} />, onClick: () => setActiveTab('certificados') },
      ]
    },
    {
      title: 'Beneficios y Red',
      items: [
        { id: 'empleo', label: 'Bolsa de Empleo', icon: <Briefcase size={18} />, onClick: () => setActiveTab('empleo') },
        { id: 'noticias', label: 'Eventos Alumni', icon: <Bell size={18} />, onClick: () => setActiveTab('noticias') },
        { id: 'biblioteca', label: 'Acceso a Biblioteca', icon: <Library size={18} />, onClick: () => setActiveTab('biblioteca') },
        { id: 'finanzas', label: 'Estado de Cuenta', icon: <Wallet size={18} />, onClick: () => setActiveTab('finanzas') },
      ]
    },
    {
      title: 'Soporte',
      items: [
        { id: 'salmi_chat', label: 'Asistente Salmi AI', icon: <Sparkles size={18} />, onClick: () => window.dispatchEvent(new CustomEvent('open-salmi-chat')) },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={graduateData}
      navItems={navItems}
      activeNav={activeTab}
      setActiveNav={setActiveTab}
      logout={logout}
      navigate={navigate}
      variant="student"
    >
      <div className="section-reveal">
        {renderContent()}
      </div>
      <SalmiChatbot />
    </DashboardLayout>
  );
};

export default GraduateDashboard;
