import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, UserCircle, QrCode, LogOut, 
  Bell, Settings, BookOpen, ShieldCheck, Star, Calendar, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CharacterizationForm from '../components/CharacterizationForm';
import StudentCardComponent from '../components/StudentCardComponent';
import SalmiAdviceComponent from '../components/SalmiAdviceComponent';
import SalmiChatbot from '../components/SalmiChatbot';
import StudentSchedule from '../components/StudentSchedule';
import ProfileView from '../components/ProfileView';

import { useQR } from '../hooks/useQR';
import { useCharacterization } from '../hooks/useCharacterization';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { qrValue, timeLeft } = useQR(user?.id);
  const { profileCompleted, characterizationData, checkCharacterization, setProfileCompleted } = useCharacterization(user?.id);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Efecto para inicializar Elfsight cuando cambie la pestaña a noticias
  useEffect(() => {
    if (activeTab === 'noticias') {
      const scriptId = 'elfsight-platform-sdk';
      
      // Función para inicializar el widget
      const initElfsight = () => {
        if (window.elfsightPlatform && typeof window.elfsightPlatform.init === 'function') {
          window.elfsightPlatform.init();
        }
      };

      // Si el script no existe, lo inyectamos
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        script.onload = initElfsight;
        document.head.appendChild(script);
      } else {
        // Si ya existe, solo re-inicializamos
        setTimeout(initElfsight, 200);
      }
    }
  }, [activeTab]);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  const [studentData, setStudentData] = useState(user || {
    name: 'Cargando...',
    program: '...',
    semester: '-',
    photo_url: null,
    id: '00000000'
  });

  useEffect(() => {
    if (user) {
      setStudentData(user);
      checkCharacterization();
    }
  }, [user, checkCharacterization]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="section-reveal dashboard-main-content">
            {/* MENTOR DIGITAL — TEMPORALMENTE OCULTO */}
            {/* <SalmiAdviceComponent student={studentData} characterization={characterizationData} /> */}
            <div className="section-reveal-single">
              <div className="glass-card welcome-header">
                <h1 className="welcome-title">
                  ¡Hola, {(studentData?.name || 'Estudiante').split(' ')[0]}! 👋
                </h1>
                <p className="welcome-subtitle">
                  Bienvenido a tu ecosistema digital UniSalamanca. Aquí tienes todo bajo control.
                </p>
                
                <div className="stats-grid-responsive">
                  {[
                    { icon: <BookOpen className="text-primary" />, label: 'Mi Semestre', value: studentData.semester || '...' },
                    { icon: <Star className="text-secondary" />, label: 'Mi Promedio', value: studentData.gpa || '0.0' },
                    { icon: <Bell className="text-accent" />, label: 'Notificaciones', value: '3' }
                  ].map((stat, i) => (
                    <div key={i} className="kpi-card-premium">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                         {stat.icon}
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-dark)' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

                {!profileCompleted && (
                  <div className="glass-card" style={{ border: '2px dashed var(--secondary)', background: 'rgba(22, 182, 214, 0.05)', marginTop: '20px' }}>
                    <div className="flex-center-between">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                          <UserCircle size={32} color="var(--secondary)" />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontWeight: 800 }}>Completa tu Caracterización</h3>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Es necesario este paso para activar tu carnet digital.</p>
                        </div>
                      </div>
                      <button onClick={() => navigate('/characterization')} className="btn-primary-premium">Empezar</button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      case 'noticias':
        return (
          <div className="section-reveal-news" style={{ 
              borderRadius: '24px', 
              overflow: 'hidden',
              minHeight: '800px',
              animation: 'slideUp 0.6s ease-out',
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
              <div style={{ 
                padding: '40px', 
                background: 'linear-gradient(135deg, rgba(42, 34, 102, 0.95) 0%, rgba(22, 182, 214, 0.95) 100%)',
                color: 'white',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(10px)', borderRadius: '18px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                      <Bell size={28} color="white" />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Muro UniSalamanca</h2>
                      <p style={{ margin: '4px 0 0', fontSize: '0.95rem', opacity: 0.9, fontWeight: 500 }}>Sigue el pulso oficial de nuestra comunidad</p>
                    </div>
                  </div>
              </div>
              
              <div style={{ padding: '0', minHeight: '600px', background: 'transparent' }}>
                  <div 
                    className="elfsight-app-c0513214-3c38-42ef-87e0-f4d7c9105a02" 
                    data-elfsight-app-lazy="true"
                    style={{ width: '100%' }}
                  ></div>
              </div>
          </div>
        );
      case 'ajustes':
        return (
          <div className="section-reveal" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ 
              width: '100px', height: '100px', background: 'white', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <Settings size={48} color="var(--primary)" />
            </div>
            <h2 style={{ color: 'var(--primary-dark)', fontWeight: 900 }}>Ajustes de Perfil</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '10px auto' }}>
              Pronto podrás personalizar tu carnet, cambiar tu foto y gestionar tus preferencias de seguridad.
            </p>
          </div>
        );
      case 'qr':
        return (
          <div className="section-reveal" style={{ textAlign: 'center', padding: '40px 20px' }}>
             <h2 style={{ color: 'var(--primary-dark)', fontWeight: 900 }}>Mi Credencial Digital</h2>
             <p style={{ color: '#64748b', marginBottom: '30px' }}>Usa este código para ingresar a las instalaciones.</p>
             <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StudentCardComponent 
                  student={studentData} 
                  qrValue={qrValue} 
                  timeLeft={timeLeft}
                  progress={profileCompleted ? 100 : 45} 
                  onPrintRequest={() => alert('Generando PDF Premium...')}
                />
             </div>
          </div>
        );
      case 'caracterizacion':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <CharacterizationForm 
              user={{...studentData, characterization: characterizationData}} 
              onComplete={() => {
                checkCharacterization();
                setActiveTab('dashboard');
              }} 
            />
          </div>
        );
      case 'horario':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <StudentSchedule student={studentData} />
          </div>
        );
      case 'perfil':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <ProfileView 
              user={studentData} 
              characterization={characterizationData} 
              onEditRequest={() => setActiveTab('caracterizacion')} 
            />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="student-dashboard-wrapper">
      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar">
         <img src="/images/escudo.png" alt="US" style={{ height: '28px' }} />
         <button onClick={toggleSidebar} className="menu-circle">
            <Menu size={20} />
         </button>
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className="student-sidebar-layout">
        {/* SIDEBAR ESTUDIANTE PREMIUM */}
        <aside className={`student-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-profile-mini">
             <div className="avatar-mini-sidebar">
                <img src={studentData.photo_url || '/images/default-avatar.png'} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{(studentData?.name || 'Estudiante').split(' ')[0]}</p>
                <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{studentData.program?.substring(0, 15)}...</p>
             </div>
          </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p className="sidebar-label-premium">Principal</p>
          {[
            { id: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={18} /> },
            { id: 'qr', label: 'Mi Carnet QR', icon: <QrCode size={18} /> },
            { id: 'horario', label: 'Mi Horario', icon: <Calendar size={18} /> },
            { id: 'perfil', label: 'Mi Perfil', icon: <UserCircle size={18} /> },
            { id: 'caracterizacion', label: 'Actualizar Datos', icon: <Settings size={18} /> },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); closeSidebar(); }} 
              className={`nav-item-premium ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          {[
            { id: 'noticias', label: 'Noticias US', icon: <Bell size={18} /> },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                if (item.id === 'caracterizacion') {
                    navigate('/characterization');
                } else {
                    setActiveTab(item.id);
                }
                closeSidebar();
              }} 
              className={`nav-item-premium ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <p className="sidebar-label-premium">Cuenta</p>
          <button className="nav-item-premium"><Settings size={18} /> Ajustes</button>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} className="btn-logout-premium" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)' }}>
             <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="student-main-container">
        {renderContent()}
      </main>

      {/* SALMI CHATBOT ASISTENTE 24/7 — TEMPORALMENTE OCULTO */}
      {/* <SalmiChatbot /> */}
    </div>
  </div>
);
};

export default StudentDashboard;
