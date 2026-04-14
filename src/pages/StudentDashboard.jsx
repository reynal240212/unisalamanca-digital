import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, UserCircle, QrCode, LogOut, 
  Bell, Settings, BookOpen, ShieldCheck, Star, Calendar, Menu,
  Library, HeartPulse, Wallet, MapPin, Clock, ArrowLeft, Headphones
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CharacterizationForm from '../components/CharacterizationForm';
import StudentCardComponent from '../components/StudentCardComponent';
import SalmiAdviceComponent from '../components/SalmiAdviceComponent';
import SalmiChatbot from '../components/SalmiChatbot';
import StudentSchedule from '../components/StudentSchedule';
import ProfileView from '../components/ProfileView';
import GradesView from '../components/GradesView';
import LibraryView from '../components/LibraryView';
import WellbeingView from '../components/WellbeingView';
import FinanceView from '../components/FinanceView';

import { useQR } from '../hooks/useQR';
import { useCharacterization } from '../hooks/useCharacterization';
import { useSchedule } from '../hooks/useSchedule';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { qrValue, timeLeft } = useQR(user?.id);
  const { profileCompleted, characterizationData, checkCharacterization, setProfileCompleted } = useCharacterization(user?.id);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { schedule } = useSchedule(user?.id);

  // Lógica para encontrar la próxima clase
  const getNextClass = () => {
    if (!schedule || schedule.length === 0) return null;
    
    const now = new Date();
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayEs = daysEs[now.getDay()];
    
    // Filtrar clases de hoy
    const todayClasses = schedule.filter(s => 
      s.blocks?.some(b => b.day_of_week === currentDayEs)
    );

    if (todayClasses.length === 0) return null;

    const currentTimeStr = now.toTimeString().slice(0, 8); // "HH:MM:SS"
    
    // Encontrar la clase que sigue o la que está ocurriendo ahora
    const next = todayClasses
      .map(s => {
        const block = s.blocks.find(b => b.day_of_week === currentDayEs);
        return { ...s, ...block };
      })
      .filter(c => c.end_time > currentTimeStr)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

    return next;
  };

  const nextClass = getNextClass();
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
            {/* HEROU SECTION CON SALMI MENTOR */}
            <div className="dashboard-hero-layout" style={{ marginBottom: '24px' }}>
               <SalmiAdviceComponent student={studentData} characterization={characterizationData} />
            </div>

            <div className="dashboard-grid-premium">
              {/* COLUMNA IZQUIERDA: ESTADO Y PRÓXIMA CLASE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card welcome-header" style={{ padding: '30px' }}>
                  <h1 className="welcome-title" style={{ fontSize: '1.8rem' }}>
                    ¡Hola, {(studentData?.name || 'Estudiante').split(' ')[0]}! 👋
                  </h1>
                  <p className="welcome-subtitle">
                    Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}.
                  </p>
                  
                  {/* BARRA DE PROGRESO SEMESTRAL (Sencilla) */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                      <span>AVANCE DEL SEMESTRE</span>
                      <span>35%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '10px' }}></div>
                    </div>
                  </div>
                </div>

                {/* WIDGET PRÓXIMA CLASE */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: nextClass ? 'var(--secondary)' : '#cbd5e1' }}></div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary-dark)' }}>PRÓXIMA CLASE</h3>
                  </div>

                  {nextClass ? (
                    <div className="kpi-card-premium" style={{ background: 'rgba(22, 182, 214, 0.03)', border: '1px solid rgba(22, 182, 214, 0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{nextClass.subject}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{nextClass.teacher}</p>
                        </div>
                        <div style={{ padding: '4px 10px', background: 'white', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--secondary)' }}>
                           {nextClass.start_time?.slice(0, 5)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                            <MapPin size={14} /> {nextClass.classroom}
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                            <Clock size={14} /> Hoy
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #e2e8f0' }}>
                       <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>No tienes más clases hoy. ¡Descansa!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA: ACCIONES Y RESUMEN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* ACCIONES RÁPIDAS */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary-dark)' }}>ACCESOS RÁPIDOS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { icon: <Wallet size={18} />, label: 'Mis Pagos', tab: 'finanzas' },
                      { icon: <Library size={18} />, label: 'Biblioteca', tab: 'biblioteca' },
                      { icon: <Bell size={18} />, label: 'Mensajes', tab: 'noticias' },
                      { icon: <ShieldCheck size={18} />, label: 'Soporte', tab: 'ajustes' }
                    ].map((btn, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveTab(btn.tab)}
                        className="dashboard-action-btn" 
                        style={{ margin: 0 }}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KPI CARDS (Rediseñadas en vertical para esta columna) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {[
                    { icon: <BookOpen className="text-primary" />, label: 'Mi Semestre', value: studentData.semester || '...' },
                    { icon: <Star className="text-secondary" />, label: 'Mi Promedio', value: studentData.gpa || '0.0' },
                  ].map((stat, i) => (
                    <div key={i} className="kpi-card-premium" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         {stat.icon}
                         <div>
                           <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</p>
                           <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-dark)' }}>{stat.value}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!profileCompleted && (
                  <div className="glass-card alert-characterization" style={{ border: '2px dashed var(--secondary)', background: 'rgba(22, 182, 214, 0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <UserCircle size={24} color="var(--secondary)" />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem' }}>Tarea Pendiente</h3>
                          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Tu carnet digital requiere que completes tu caracterización.</p>
                        </div>
                        <button onClick={() => navigate('/characterization')} className="btn-primary-premium" style={{ width: '100%' }}>Completar</button>
                    </div>
                  </div>
                )}
              </div>
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
      case 'notas':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <GradesView user={studentData} />
          </div>
        );
      case 'biblioteca':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <LibraryView user={studentData} />
          </div>
        );
      case 'bienestar':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <WellbeingView user={studentData} />
          </div>
        );
      case 'finanzas':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <FinanceView user={studentData} />
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    {
      title: 'Experiencia',
      items: [
        { id: 'dashboard', label: 'Mi Panel', icon: <LayoutDashboard size={18} />, onClick: () => setActiveTab('dashboard') },
        { id: 'qr', label: 'Identificación QR', icon: <QrCode size={18} />, onClick: () => setActiveTab('qr') },
        { id: 'horario', label: 'Agenda Semanal', icon: <Calendar size={18} />, onClick: () => setActiveTab('horario') },
        { id: 'notas', label: 'Rendimiento Académico', icon: <BookOpen size={18} />, onClick: () => setActiveTab('notas') },
      ]
    },
    {
      title: 'Campus Digital',
      items: [
        { id: 'biblioteca', label: 'Biblioteca Digital', icon: <Library size={18} />, onClick: () => setActiveTab('biblioteca') },
        { id: 'bienestar', label: 'Vida Universitaria', icon: <HeartPulse size={18} />, onClick: () => setActiveTab('bienestar') },
        { id: 'finanzas', label: 'Gestión Financiera', icon: <Wallet size={18} />, onClick: () => setActiveTab('finanzas') },
      ]
    },
    {
      title: 'Comunidad',
      items: [
        { id: 'perfil', label: 'Perfil de Estudiante', icon: <UserCircle size={18} />, onClick: () => setActiveTab('perfil') },
        { id: 'noticias', label: 'Eventos y Noticias', icon: <Bell size={18} />, onClick: () => setActiveTab('noticias') },
        { id: 'caracterizacion', label: 'Personalización', icon: <Settings size={18} />, onClick: () => setActiveTab('caracterizacion') },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
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
      
      {/* ASISTENTE SALMI FLOTANTE */}
      <SalmiChatbot />
    </DashboardLayout>
  );
};

export default StudentDashboard;
