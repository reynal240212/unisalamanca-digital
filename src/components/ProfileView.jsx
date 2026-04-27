import React from 'react';
import { 
  User, Mail, Calendar, BookOpen, Star, 
  MapPin, Phone, Heart, Users, Briefcase, 
  Shield, CreditCard, Clock, CheckCircle2, ChevronRight,
  GraduationCap, Award, Landmark, Fingerprint,
  Activity, FileText, QrCode, Wallet, Bell, 
  ShieldCheck as ShieldIcon, Library
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
    const max = 5.0;
    const percentage = (value / max) * 100;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="gpa-stats-mini">
        <div className="gpa-circle-wrapper-mini">
          <svg width="70" height="70">
            <circle className="gpa-circle-bg" cx="35" cy="35" r={radius} />
            <circle 
              className="gpa-circle-progress" 
              cx="35" 
              cy="35" 
              r={radius} 
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className="gpa-text-mini">{value.toFixed(1)}</div>
        </div>
        <div className="gpa-info-mini">
          <span className="gpa-label">Promedio</span>
        </div>
      </div>
    );
  };

  const InfoRow = ({ icon, label, value }) => (
    <div className="whatsapp-info-row">
      <div className="whatsapp-row-icon">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="whatsapp-row-content">
        <div className="whatsapp-row-text">
          <span className="whatsapp-label">{label}</span>
          <span className="whatsapp-value">{value || 'No reportado'}</span>
        </div>
        <ChevronRight size={16} className="whatsapp-arrow" />
      </div>
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div className="whatsapp-section-header">
      {title}
    </div>
  );

  const totalSems = 10;

  return (
    <div className="profile-whatsapp-view">
      
      {/* 1. HERO SECTION (FULL WIDTH) */}
      <div className="whatsapp-hero">
        <div className="whatsapp-hero-top">
          <AvatarUpload user={user} onUploadComplete={() => {}} />
          <div className="whatsapp-hero-info">
             <h2 className="whatsapp-name">{user?.name || 'Estudiante'}</h2>
             <div className="whatsapp-status-badges">
                <span className="whatsapp-badge role">{user?.role}</span>
                <span className="whatsapp-badge active">{user?.status}</span>
             </div>
             <p className="whatsapp-program-text">{user?.program}</p>
          </div>
        </div>

        <div className="whatsapp-hero-stats">
           <GPACircle gpa={user?.gpa} />
           <div className="whatsapp-hero-actions">
              <button onClick={() => setIsCardModalOpen(true)} className="whatsapp-action-btn qr">
                 <QrCode size={18} /> Carnet
              </button>
              <button onClick={onEditRequest} className="whatsapp-action-btn edit">
                 <User size={18} /> Editar
              </button>
           </div>
        </div>
      </div>

      {/* 2. ADVICE COMPONENT (INTEGRATED) */}
      <div className="whatsapp-advice-container">
         <SalmiAdviceComponent student={user} characterization={characterization} />
      </div>


      {/* 3. QUICK INSIGHTS (NEXT CLASS) */}
      <div className="whatsapp-quick-insight" onClick={() => setActiveTab('horario')}>
         <div className="insight-icon">
            <Clock size={20} color="var(--secondary)" />
         </div>
         <div className="insight-content">
            <span className="insight-label">Próxima Clase</span>
            <span className="insight-value">
               {nextClass ? `${nextClass.subject} - ${nextClass.start_time?.slice(0,5)}` : 'Sin clases hoy'}
            </span>
         </div>
         <ChevronRight size={18} color="#cbd5e1" />
      </div>

      {/* 4. EXPEDIENTE (WHATSAPP LIST STYLE) */}
      <div className="whatsapp-record-list">
        <SectionHeader title="Información Académica" />
        <InfoRow icon={<Calendar />} label="Semestre Actual" value={user?.semester ? `${user?.semester}° Semestre` : null} />
        <InfoRow icon={<Landmark />} label="Sede Institucional" value={characterization?.university_branch} />
        <InfoRow icon={<BookOpen />} label="Modalidad" value={user?.study_modality} />

        <SectionHeader title="Identidad Estudiantil" />
        <InfoRow icon={<Fingerprint />} label="Documento" value={user?.document_id} />
        <InfoRow icon={<Mail />} label="Email Institucional" value={user?.email} />

        <SectionHeader title="Salud y Contacto" />
        <InfoRow icon={<Activity />} label="EPS / Salud" value={characterization?.eps} />
        <InfoRow icon={<Heart />} label="Grupo Sanguíneo" value={characterization?.blood_type} />
        <InfoRow icon={<Phone />} label="Celular" value={characterization?.phone} />
        <InfoRow icon={<MapPin />} label="Dirección" value={characterization?.address} />

        <SectionHeader title="Emergencia" />
        <InfoRow icon={<User />} label="Contacto" value={characterization?.emergency_contact} />
        <InfoRow icon={<Phone />} label="Teléfono" value={characterization?.emergency_phone} />

        <SectionHeader title="Otros Servicios" />
        <div className="whatsapp-services-grid">
           {[
             { icon: <Wallet />, label: 'Pagos', tab: 'finanzas' },
             { icon: <Library />, label: 'Biblioteca', tab: 'biblioteca' },
             { icon: <Bell />, label: 'Avisos', tab: 'noticias' },
             { icon: <ShieldIcon />, label: 'Soporte', tab: 'ajustes' }
           ].map((s, i) => (
             <button key={i} onClick={() => setActiveTab(s.tab)} className="whatsapp-service-btn">
                <div className="service-icon-circle">{s.icon}</div>
                <span>{s.label}</span>
             </button>
           ))}
        </div>
      </div>

      <Modal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} title="Mi Credencial Digital">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StudentCardComponent student={user} qrValue={qrValue} timeLeft={timeLeft} progress={profileCompleted ? 100 : 45} />
        </div>
      </Modal>

    </div>
  );
};

export default ProfileView;
