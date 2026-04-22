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
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { schedule } = useSchedule(user?.id);

  // Lógica para encontrar la próxima clase
  const getNextClass = () => {
    if (!schedule || schedule.length === 0) return null;
    
    const now = new Date();
    const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayEs = daysEs[now.getDay()];
    
    const todayClasses = schedule.filter(s => 
      s.blocks?.some(b => b.day_of_week === currentDayEs)
    );

    if (todayClasses.length === 0) return null;

    const currentTimeStr = now.toTimeString().slice(0, 8);
    
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

  useEffect(() => {
    if (activeTab === 'noticias') {
      const scriptId = 'elfsight-platform-sdk';
      const initElfsight = () => {
        if (window.elfsightPlatform && typeof window.elfsightPlatform.init === 'function') {
          window.elfsightPlatform.init();
        }
      };
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        script.onload = initElfsight;
        document.head.appendChild(script);
      } else {
        setTimeout(initElfsight, 200);
      }
    }
  }, [activeTab]);
  
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
      case 'perfil':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <ProfileView 
              user={studentData} 
              characterization={characterizationData} 
              onEditRequest={() => setActiveTab('caracterizacion')} 
              setActiveTab={setActiveTab}
              nextClass={nextClass}
              qrValue={qrValue}
              timeLeft={timeLeft}
              profileCompleted={profileCompleted}
            />
          </div>
        );
      case 'noticias':
        return (
          <div className="section-reveal-news" style={{ 
              borderRadius: '24px', overflow: 'hidden', minHeight: '800px',
              animation: 'slideUp 0.6s ease-out', background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
              <div style={{ 
                padding: '40px', background: 'linear-gradient(135deg, rgba(42, 34, 102, 0.95) 0%, rgba(22, 182, 214, 0.95) 100%)',
                color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="glass-card" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={28} color="white" />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900 }}>Muro UniSalamanca</h2>
                      <p style={{ margin: '4px 0 0', opacity: 0.9 }}>Sigue el pulso oficial de nuestra comunidad</p>
                    </div>
                  </div>
              </div>
              <div style={{ padding: '0', minHeight: '600px' }}>
                  <div className="elfsight-app-c0513214-3c38-42ef-87e0-f4d7c9105a02" data-elfsight-app-lazy="true"></div>
              </div>
          </div>
        );
      case 'ajustes':
        return (
          <div className="section-reveal" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Settings size={48} color="var(--primary)" />
            <h2 style={{ color: 'var(--primary-dark)', fontWeight: 900 }}>Ajustes de Perfil</h2>
            <p>Pronto podrás personalizar tu carnet y gestionar tus preferencias.</p>
          </div>
        );
      case 'caracterizacion':
        return (
          <div className="section-reveal" style={{ padding: '20px' }}>
            <CharacterizationForm 
              user={{...studentData, characterization: characterizationData}} 
              onComplete={() => {
                checkCharacterization();
                setActiveTab('perfil');
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
      title: 'Mi Identidad',
      items: [
        { id: 'perfil', label: 'Mi Perfil Estudiantil', icon: <UserCircle size={18} />, onClick: () => setActiveTab('perfil') },
      ]
    },
    {
      title: 'Académico',
      items: [
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
        { id: 'noticias', label: 'Eventos y Noticias', icon: <Bell size={18} />, onClick: () => setActiveTab('noticias') },
        { id: 'caracterizacion', label: 'Personalización', icon: <Settings size={18} />, onClick: () => setActiveTab('caracterizacion') },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={studentData}
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

export default StudentDashboard;
