import React from 'react';
import { 
  User, Mail, Calendar, BookOpen, Star, 
  MapPin, Phone, Heart, Users, Briefcase, 
  Shield, CreditCard, Clock, CheckCircle2, ChevronRight,
  GraduationCap, Award, Landmark, Fingerprint,
  Activity, Wifi, Monitor, Car, Smartphone, Map, FileText, Home,
  QrCode, Wallet, Bell, ShieldCheck as ShieldIcon, Library
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import SalmiAdviceComponent from './SalmiAdviceComponent';
import StudentCardComponent from './StudentCardComponent';
import Modal from './common/Modal';

const ProfileView = ({ 
  user, 
  characterization, 
  onEditRequest, 
  setActiveTab,
  nextClass,
  qrValue,
  timeLeft,
  profileCompleted
}) => {
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  
  const GPACircle = ({ gpa }) => {
    const value = parseFloat(gpa) || 0;
    const max = 5.0; // Sistema de calificación de 0 a 5.0
    const percentage = (value / max) * 100;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="gpa-stats-container">
        <div className="gpa-circle-wrapper">
          <svg className="gpa-circle-svg">
            <circle className="gpa-circle-bg" cx="40" cy="40" r={radius} />
            <circle 
              className="gpa-circle-progress" 
              cx="40" 
              cy="40" 
              r={radius} 
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className="gpa-circle-text">{value.toFixed(1)}</div>
        </div>
        <div className="gpa-label-group">
          <span className="gpa-label-title" style={{ display: 'block', fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.9rem' }}>Promedio</span>
          <span className="gpa-label-subtitle" style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Acumulado</span>
        </div>
      </div>
    );
  };

  const SemesterProgress = ({ current, total = 10 }) => {
    const curr = parseInt(current) || 1;
    const percentage = (curr / total) * 100;

    return (
      <div className="semester-timeline-container">
        <div className="timeline-header">
          <span className="timeline-label">Grado de Avance</span>
          <span className="timeline-percent">{curr} de {total} Semestres</span>
        </div>
        <div className="timeline-track">
          <div className="timeline-bar" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  const InfoCard = ({ icon, label, value }) => (
    <div className="info-item-premium">
      <div className="info-item-icon">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="info-item-content">
        <span className="info-item-label">{label}</span>
        <span className="info-item-value">{value || 'No reportado'}</span>
      </div>
    </div>
  );

  const SectionTitle = ({ icon, title }) => (
    <div className="profile-section-header">
      <div className="section-header-icon">{icon}</div>
      <h3 className="section-header-title">{title}</h3>
    </div>
  );

  const getTotalSemesters = (program) => {
    const p = program?.toLowerCase() || '';
    if (p.includes('tecnolog') || p.includes('software') || p.includes('sistemas')) return 6;
    if (p.includes('técnic') || p.includes('tecnic')) return 4;
    return 10;
  };

  const totalSems = getTotalSemesters(user?.program);

  return (
    <div className="profile-view-wrapper section-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. SALMI MENTOR ADVICE - INTEGRATED AT THE TOP */}
      <div className="dashboard-hero-layout">
         <SalmiAdviceComponent student={user} characterization={characterization} />
      </div>

      {/* 2. SUPER HERO CARD - PROFILE + ACTIONS */}
      <div className="profile-hero-card">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <AvatarUpload user={user} onUploadComplete={() => {}} />
          
          <div className="profile-hero-text">
            <h2 className="profile-name" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>{user?.name || 'Estudiante'} 👋</h2>
            <div className="profile-badges">
              <span className="badge-premium role-badge">
                 <Shield size={14} /> {user?.role || 'ESTUDIANTE'}
              </span>
              <span className="badge-premium status-badge">
                 <CheckCircle2 size={14} /> {user?.status || 'Active'}
              </span>
            </div>
            <p className="profile-program">
              <GraduationCap size={20} /> {user?.program}
            </p>
            
            <SemesterProgress current={user?.semester} total={totalSems} />
          </div>

          <div className="profile-hero-actions">
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setIsCardModalOpen(true)} 
                className="btn-edit-profile" 
                style={{ background: 'var(--secondary)', flex: 1 }}
              >
                 <QrCode size={18} /> Ver Carnet Digital
              </button>
              <button onClick={onEditRequest} className="btn-edit-profile" style={{ flex: 1 }}>
                 Actualizar Perfil <ChevronRight size={18} />
              </button>
            </div>
            <GPACircle gpa={user?.gpa} />
          </div>
        </div>
      </div>

      {/* 3. DASHBOARD QUICK INSIGHTS GRID */}
      <div className="dashboard-grid-premium">
         {/* NEXT CLASS WIDGET */}
         <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: nextClass ? 'var(--secondary)' : '#cbd5e1', boxShadow: nextClass ? '0 0 10px var(--secondary)' : 'none' }}></div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Próxima Clase</h3>
            </div>

            {nextClass ? (
              <div style={{ background: 'rgba(22, 182, 214, 0.03)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(22, 182, 214, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{nextClass.subject}</h4>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{nextClass.teacher}</p>
                  </div>
                  <div style={{ padding: '8px 16px', background: 'white', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900, color: 'var(--secondary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                     {nextClass.start_time?.slice(0, 5)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '25px', marginTop: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                      <MapPin size={16} color="var(--secondary)" /> {nextClass.classroom}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                      <Clock size={16} color="var(--secondary)" /> Hoy
                   </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                 <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>No tienes más clases programadas para hoy.</p>
              </div>
            )}
         </div>

         {/* QUICK ACCESS BUTTONS */}
         <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 900, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Acceso Directo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[
                { icon: <Wallet size={20} />, label: 'Pagos', tab: 'finanzas' },
                { icon: <Library size={20} />, label: 'Libros', tab: 'biblioteca' },
                { icon: <Bell size={20} />, label: 'Avisos', tab: 'noticias' },
                { icon: <ShieldIcon size={20} />, label: 'Ayuda', tab: 'ajustes' }
              ].map((btn, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTab(btn.tab)}
                  className="dashboard-action-btn" 
                  style={{ margin: 0, padding: '16px', borderRadius: '18px', gap: '10px' }}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
         </div>
      </div>

      {/* 4. CARNET DIGITAL MODAL */}
      <Modal 
        isOpen={isCardModalOpen} 
        onClose={() => setIsCardModalOpen(false)} 
        title="Mi Credencial Digital"
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StudentCardComponent 
            student={user} 
            qrValue={qrValue} 
            timeLeft={timeLeft}
            progress={profileCompleted ? 100 : 45} 
            onPrintRequest={() => alert('Generando PDF Premium...')}
          />
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          Presenta este código en los puntos de acceso de la universidad.
        </p>
      </Modal>

      {/* 5. UNIFIED STUDENT RECORD */}
      <div className="glass-card profile-unified-card section-reveal">
        <div className="unified-card-header">
           <FileText size={22} color="var(--primary)" />
           <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-dark)' }}>Expediente Único Estudiantil</h3>
        </div>

        <div className="unified-sections-grid">
          {/* SECCIÓN 1: ACADÉMICO */}
          <section className="unified-section">
            <SectionTitle icon={<Award size={18} />} title="Académico" />
            <div className="unified-items-list">
               <InfoCard icon={<Calendar />} label="Semestre Actual" value={user?.semester ? `${user?.semester}° Semestre` : null} />
               <InfoCard icon={<Clock />} label="Fecha de Ingreso" value={user?.entry_date} />
               <InfoCard icon={<Landmark />} label="Sede" value={characterization?.university_branch || 'Sede Principal'} />
               <InfoCard icon={<BookOpen />} label="Modalidad" value={user?.study_modality || 'Presencial'} />
            </div>
          </section>

          {/* SECCIÓN 2: IDENTIDAD */}
          <section className="unified-section">
            <SectionTitle icon={<Fingerprint size={18} />} title="Identidad" />
            <div className="unified-items-list">
               <InfoCard icon={<Shield />} label="Documento" value={characterization?.document_type} />
               <InfoCard icon={<CreditCard />} label="Número" value={user?.document_id} />
               <InfoCard icon={<Mail />} label="Email" value={user?.email} />
            </div>
          </section>

          {/* SECCIÓN 3: SALUD */}
          <section className="unified-section">
            <SectionTitle icon={<Activity size={18} />} title="Salud" />
            <div className="unified-items-list">
               <InfoCard icon={<Shield />} label="EPS" value={characterization?.eps} />
               <InfoCard icon={<Heart />} label="Grupo Sanguíneo" value={characterization?.blood_type} />
               <InfoCard icon={<Activity />} label="Discapacidad" value={characterization?.disability && characterization.disability !== 'Ninguna' ? characterization.disability : 'No reporta'} />
               {characterization?.health_notes && (
                 <InfoCard icon={<FileText />} label="Notas Médicas" value={characterization.health_notes} />
               )}
            </div>
          </section>

          {/* SECCIÓN 4: SOCIOECONÓMICO */}
          <section className="unified-section">
            <SectionTitle icon={<Landmark size={18} />} title="Entorno" />
            <div className="unified-items-list">
               <InfoCard icon={<Landmark />} label="Estrato" value={characterization?.estrato ? `Estrato ${characterization.estrato}` : null} />
               <InfoCard icon={<Home />} label="Vive con" value={characterization?.lives_with} />
               <InfoCard icon={<Users />} label="Población" value={characterization?.ethnicity && characterization.ethnicity !== 'Ninguna' ? characterization.ethnicity : 'No pertenece'} />
               <InfoCard icon={<Map />} label="Origen" value={characterization?.lugar_nacimiento} />
            </div>
          </section>

          {/* SECCIÓN 5: PERSONAL */}
          <section className="unified-section">
            <SectionTitle icon={<User size={18} />} title="Personal" />
            <div className="unified-items-list">
               <InfoCard icon={<Users />} label="Estado Civil" value={characterization?.marital_status} />
               <InfoCard icon={<Phone />} label="Celular" value={characterization?.phone} />
               <InfoCard icon={<MapPin />} label="Dirección" value={characterization?.address} />
               <InfoCard icon={<Mail />} label="Email Personal" value={characterization?.correo} />
            </div>
          </section>

          {/* SECCIÓN 6: EMERGENCIA */}
          <section className="unified-section">
            <SectionTitle icon={<Phone size={18} />} title="Emergencia" />
            <div className="unified-items-list">
               <InfoCard icon={<User />} label="Contacto" value={characterization?.emergency_contact} />
               <InfoCard icon={<Phone />} label="Teléfono" value={characterization?.emergency_phone} />
               <InfoCard icon={<Heart />} label="Parentesco" value={characterization?.emergency_relationship} />
            </div>
          </section>

          {/* SECCIÓN 7: LABORAL (SI APLICA) */}
          {(characterization?.is_working === 'Si' || characterization?.work_company) && (
            <section className="unified-section">
              <SectionTitle icon={<Briefcase size={18} />} title="Laboral" />
              <div className="unified-items-list">
                <InfoCard icon={<Landmark />} label="Empresa" value={characterization?.work_company} />
                <InfoCard icon={<Briefcase />} label="Cargo" value={characterization?.work_role} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
