import React from 'react';
import { 
  User, Mail, Calendar, BookOpen, Star, 
  MapPin, Phone, Heart, Users, Briefcase, 
  Shield, CreditCard, Clock, CheckCircle2, ChevronRight,
  GraduationCap, Award, Landmark, Fingerprint,
  Activity, Wifi, Monitor, Car, Smartphone, Map, FileText
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';

const ProfileView = ({ user, characterization, onEditRequest }) => {
  
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

  const InfoCard = ({ icon, title, label, value, color = "var(--primary)" }) => (
    <div className="info-item-premium">
      <div className="info-item-icon" style={{ background: color }}>
        {icon}
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
    // Incluímos palabras clave para detectar tecnologías de 6 semestres
    if (p.includes('tecnolog') || p.includes('software') || p.includes('sistemas')) return 6;
    if (p.includes('técnic') || p.includes('tecnic')) return 4;
    return 10; // Default para programas profesionales
  };

  const totalSems = getTotalSemesters(user?.program);

  return (
    <div className="profile-view-wrapper section-reveal">
      {/* HEADER PRINCIPAL PREMIUM REDISEÑADO */}
      <div className="profile-hero-card">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <AvatarUpload user={user} onUploadComplete={() => {}} />
          
          <div className="profile-hero-text">
            <h2 className="profile-name">{user?.name}</h2>
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
            <GPACircle gpa={user?.gpa} />
            <button onClick={onEditRequest} className="btn-edit-profile">
               Actualizar Datos <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* COLUMNA IZQUIERDA: ACADÉMICO */}
        <div className="profile-column">
          <div className="glass-card profile-section">
            <SectionTitle icon={<Award size={20} />} title="Información Académica" />
            <div className="info-items-grid">
               <InfoCard icon={<Calendar size={22} />} label="Semestre Actual" value={user?.semester ? `${user?.semester}° Semestre` : null} color="#4f46e5" />
               <InfoCard icon={<Clock size={22} />} label="Fecha de Ingreso" value={user?.entry_date} color="#10b981" />
               <InfoCard icon={<Landmark size={22} />} label="Sede Institucional" value={characterization?.university_branch || 'Sede Principal'} color="#f59e0b" />
               <InfoCard icon={<BookOpen size={22} />} label="Modalidad Estudio" value={user?.study_modality || 'Presencial'} color="#6366f1" />
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<Fingerprint size={20} />} title="Identidad Institucional" />
            <div className="info-items-grid">
               <InfoCard icon={<Shield size={22} />} label="Tipo de Documento" value={characterization?.document_type} color="#ef4444" />
               <InfoCard icon={<CreditCard size={22} />} label="Número Documento" value={user?.document_id} color="#06b6d4" />
               <InfoCard icon={<Mail size={22} />} label="Email Institucional" value={user?.email} color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PERSONAL */}
        <div className="profile-column">
          <div className="glass-card profile-section">
            <SectionTitle icon={<Activity size={20} />} title="Salud y Bienestar" />
            <div className="info-items-grid">
               <InfoCard icon={<Shield size={22} />} label="EPS Actual" value={characterization?.eps} color="#3b82f6" />
               <InfoCard icon={<Heart size={22} />} label="Grupo Sanguíneo/RH" value={characterization?.blood_type} color="#ef4444" />
               <InfoCard icon={<Activity size={22} />} label="Discapacidad" value={characterization?.disability && characterization.disability !== 'Ninguna' ? characterization.disability : 'No reporta'} color="#8b5cf6" />
               {characterization?.health_notes && (
                 <InfoCard icon={<FileText size={22} />} label="Notas de Salud" value={characterization.health_notes} color="#64748b" />
               )}
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<Landmark size={20} />} title="Entorno Socioeconómico" />
            <div className="info-items-grid">
               <InfoCard icon={<Landmark size={22} />} label="Estrato Social" value={characterization?.estrato ? `Estrato ${characterization.estrato}` : null} color="#f59e0b" />
               <InfoCard icon={<Home size={22} />} label="Vive con" value={characterization?.lives_with} color="#10b981" />
               <InfoCard icon={<Users size={22} />} label="Etnia / Población" value={characterization?.ethnicity && characterization.ethnicity !== 'Ninguna' ? characterization.ethnicity : 'No pertenece'} color="#f43f5e" />
               <InfoCard icon={<Map size={22} />} label="Municipio Nacimiento" value={characterization?.lugar_nacimiento} color="#06b6d4" />
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<Wifi size={20} />} title="Conectividad y Movilidad" />
            <div className="info-items-grid">
               <InfoCard icon={<Wifi size={22} />} label="Acceso a Internet" value={characterization?.has_internet === 'Si' ? 'Tiene acceso' : 'Sin acceso'} color="#0ea5e9" />
               <InfoCard icon={<Monitor size={22} />} label="Computador Propio" value={characterization?.has_computer === 'Si' ? 'Dispone de uno' : 'No dispone'} color="#6366f1" />
               <InfoCard icon={<Car size={22} />} label="Medio de Transporte" value={characterization?.transport_mode} color="#475569" />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PERSONAL Y EMERGENCIA */}
        <div className="profile-column">
          <div className="glass-card profile-section">
            <SectionTitle icon={<User size={20} />} title="Información Personal" />
            <div className="info-items-grid">
               <InfoCard icon={<Phone size={22} />} label="Teléfono Celular" value={characterization?.phone} color="#f43f5e" />
               <InfoCard icon={<MapPin size={22} />} label="Dirección Residencia" value={characterization?.address} color="#3b82f6" />
               <InfoCard icon={<Users size={22} />} label="Estado Civil" value={characterization?.marital_status} color="#ec4899" />
               <InfoCard icon={<Mail size={22} />} label="Email Personal" value={characterization?.correo} color="#8b5cf6" />
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<Phone size={20} />} title="Contacto de Emergencia" />
            <div className="info-items-grid">
               <InfoCard icon={<User size={22} />} label="Nombre Contacto" value={characterization?.emergency_contact} color="#f97316" />
               <InfoCard icon={<Phone size={22} />} label="Teléfono Contacto" value={characterization?.emergency_phone} color="#10b981" />
               <InfoCard icon={<Heart size={22} />} label="Vínculo/Parentesco" value={characterization?.emergency_relationship} color="#0891b2" />
            </div>
          </div>
          
          {(characterization?.is_working === 'Si' || characterization?.work_company) && (
            <div className="glass-card profile-section">
              <SectionTitle icon={<Briefcase size={20} />} title="Información Laboral" />
              <div className="info-items-grid">
                <InfoCard icon={<Landmark size={22} />} label="Empresa/Organización" value={characterization?.work_company} color="#475569" />
                <InfoCard icon={<Briefcase size={22} />} label="Cargo Desempeñado" value={characterization?.work_role} color="#64748b" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
