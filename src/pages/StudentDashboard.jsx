import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, UserCircle, QrCode, LogOut, 
  Bell, Settings, BookOpen, ShieldCheck, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CharacterizationForm from '../components/CharacterizationForm';
import StudentCardComponent from '../components/StudentCardComponent';
import SalmiAdviceComponent from '../components/SalmiAdviceComponent';
import SalmiChatbot from '../components/SalmiChatbot';

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
          <div className="section-reveal">
            <SalmiAdviceComponent student={studentData} characterization={characterizationData} />
            <div className="student-dashboard-grid">
              <div>
                <div className="glass-card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))' }}>
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
                    ¡Hola, {(studentData?.name || 'Estudiante').split(' ')[0]}! 👋
                  </h1>
                  <p style={{ color: '#64748b', marginTop: '8px', fontSize: '0.95rem' }}>
                    Bienvenido a tu ecosistema digital UniSalamanca. Aquí tienes todo bajo control.
                  </p>
                  
                  <div className="kpi-grid-premium" style={{ marginTop: '32px' }}>
                    {[
                      { icon: <BookOpen className="text-primary" />, label: 'Mi Semestre', value: studentData.semester || '...' },
                      { icon: <Star className="text-secondary" />, label: 'Mi Promedio', value: studentData.gpa || '0.0' },
                      { icon: <Bell className="text-accent" />, label: 'Notificaciones', value: '3' }
                    ].map((stat, i) => (
                      <div key={i} className="kpi-card-premium" style={{ padding: '20px' }}>
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
                    <div className="banner-caracterizacion-premium">
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                        <UserCircle size={32} color="var(--secondary)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Completa tu Caracterización</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Es necesario este paso para activar todas las funcionalidades de tu carnet digital.</p>
                      </div>
                      <button onClick={() => navigate('/characterization')} className="btn-primary-premium">Empezar</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="sidebar-label-premium" style={{ padding: '0 0 15px', color: '#94a3b8' }}>Identidad Digital</h3>
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                  <StudentCardComponent 
                    student={studentData} 
                    qrValue={qrValue} 
                    timeLeft={timeLeft}
                    progress={profileCompleted ? 100 : 45} 
                    onPrintRequest={() => alert('Generando PDF Premium...')}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'noticias':
        return (
          <div className="section-reveal" style={{ 
              background: 'white', 
              borderRadius: '30px', 
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 10px 40px',
              overflow: 'hidden',
              minHeight: '800px',
              animation: 'slideUp 0.6s ease-out'
          }}>
              <div style={{ 
                padding: '30px 40px', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white'
              }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '45px', height: '45px', background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)', borderRadius: '15px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Bell size={24} color="white" />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Muro UniSalamanca</h2>
                      <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Sigue el pulso oficial de nuestra comunidad</p>
                    </div>
                  </div>
              </div>
              
              <div style={{ padding: '20px', minHeight: '400px' }}>
                  <div 
                    className="elfsight-app-c0513214-3c38-42ef-87e0-f4d7c9105a02" 
                    data-elfsight-app-lazy="true"
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
      default: return null;
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar">
         <img src="/images/logo.png" alt="US" style={{ height: '24px' }} />
         <button onClick={toggleSidebar} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <QrCode size={20} />
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
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); closeSidebar(); }} 
              className={`nav-item-premium ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <p className="sidebar-label-premium">Servicios</p>
          {[
            { id: 'caracterizacion', label: 'Caracterización', icon: <UserCircle size={18} /> },
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

      {/* SALMI CHATBOT ASISTENTE 24/7 */}
      <SalmiChatbot />
    </div>
  </div>
);
};

export default StudentDashboard;
