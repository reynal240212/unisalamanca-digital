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

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  // Dynamic QR Logic
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrSeed, setQrSeed] = useState(Date.now());
  const [studentData, setStudentData] = useState(user || {
    name: 'Cargando...',
    program: '...',
    semester: '-',
    photo_url: null,
    id: '00000000'
  });
  const [characterizationData, setCharacterizationData] = useState(null);

  useEffect(() => {
    if (user) {
      setStudentData(user);
      checkCharacterization();
    }
    
    // Timer for QR Rotation
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setQrSeed(Date.now()); // Rotate QR
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const checkCharacterization = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('characterization')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setProfileCompleted(true);
        setCharacterizationData(data);
      }
    } catch (err) {
      console.error('Error checking characterization:', err);
    }
  };

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
                    ¡Hola, {studentData?.name?.split(' ')[0] || 'Estudiante'}! 👋
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
                      <button onClick={() => setActiveTab('caracterizacion')} className="btn-primary-premium">Empezar</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="sidebar-label-premium" style={{ padding: '0 0 15px', color: '#94a3b8' }}>Identidad Digital</h3>
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                  <StudentCardComponent 
                    student={studentData} 
                    qrValue={`USAL-${studentData.id}-${qrSeed}`} 
                    timeLeft={timeLeft}
                    progress={profileCompleted ? 100 : 45} 
                    onPrintRequest={() => alert('Generando PDF Premium...')}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'caracterizacion':
        return (
          <div className="section-reveal">
            <CharacterizationForm user={user} onComplete={() => {
              setProfileCompleted(true);
              setActiveTab('dashboard');
              alert('¡Caracterización completada con éxito!');
            }} />
          </div>
        );
      case 'qr':
        return (
          <div className="section-reveal" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
             <StudentCardComponent 
                student={studentData} 
                qrValue={`USAL-${studentData.id}`} 
                progress={profileCompleted ? 100 : 45} 
                onPrintRequest={() => alert('Generando PDF Premium...')}
              />
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
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{studentData?.name?.split(' ')[0] || 'Estudiante'}</p>
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
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`nav-item-premium ${activeTab === item.id ? 'active' : ''}`}>
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
