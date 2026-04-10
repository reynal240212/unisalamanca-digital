import React from 'react';
import { 
  User, Mail, Calendar, BookOpen, Star, 
  MapPin, Phone, Heart, Users, Briefcase, 
  Shield, CreditCard, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';

const ProfileView = ({ user, characterization, onEditRequest }) => {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';
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

  return (
    <div className="profile-view-wrapper section-reveal">
      {/* HEADER PRINCIPAL */}
      <div className="profile-hero-card glass-card">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <AvatarUpload user={user} onUploadComplete={() => {}} />
          <div className="profile-hero-text">
            <h2 className="profile-name">{user?.name}</h2>
            <div className="profile-badges">
              <span className="badge-premium role-badge">
                 <Shield size={12} /> {user?.role || 'ESTUDIANTE'}
              </span>
              <span className="badge-premium status-badge">
                 <CheckCircle2 size={12} /> {user?.status || 'Active'}
              </span>
            </div>
            <p className="profile-program">{user?.program}</p>
          </div>
          <button onClick={onEditRequest} className="btn-edit-profile">
             Actualizar Datos <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="profile-grid">
        {/* COLUMNA IZQUIERDA: ACADÉMICO */}
        <div className="profile-column">
          <div className="glass-card profile-section">
            <SectionTitle icon={<BookOpen size={20} />} title="Información Académica" />
            <div className="info-items-grid">
               <InfoCard icon={<Calendar size={18} />} label="Semestre Actual" value={user?.semester} color="#4f46e5" />
               <InfoCard icon={<Star size={18} />} label="Promedio (GPA)" value={user?.gpa} color="#f59e0b" />
               <InfoCard icon={<Clock size={18} />} label="Fecha Ingreso" value={user?.entry_date} color="#10b981" />
               <InfoCard icon={<CreditCard size={18} />} label="Modalidad" value={user?.study_modality} color="#6366f1" />
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<User size={20} />} title="Identidad Institucional" />
            <div className="info-items-grid">
               <InfoCard icon={<Shield size={18} />} label="Tipo Documento" value={characterization?.document_type} color="#ef4444" />
               <InfoCard icon={<CreditCard size={18} />} label="Número Documento" value={user?.document_id} color="#06b6d4" />
               <InfoCard icon={<Mail size={18} />} label="Correo Institucional" value={user?.email} color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PERSONAL Y CONTACTO */}
        <div className="profile-column">
          <div className="glass-card profile-section">
            <SectionTitle icon={<Users size={20} />} title="Información Personal" />
            <div className="info-items-grid">
               <InfoCard icon={<Phone size={18} />} label="Teléfono Celular" value={characterization?.phone} color="#f43f5e" />
               <InfoCard icon={<MapPin size={18} />} label="Dirección" value={characterization?.address} color="#3b82f6" />
               <InfoCard icon={<Heart size={18} />} label="Grupo Sanguíneo" value={characterization?.blood_type} color="#de1f26" />
               <InfoCard icon={<Users size={18} />} label="Estado Civil" value={characterization?.marital_status} color="#ec4899" />
            </div>
          </div>

          <div className="glass-card profile-section">
            <SectionTitle icon={<Shield size={20} />} title="Contacto de Emergencia" />
            <div className="info-items-grid">
               <InfoCard icon={<User size={18} />} label="Nombre Contacto" value={characterization?.emergency_contact} color="#f97316" />
               <InfoCard icon={<Phone size={18} />} label="Teléfono" value={characterization?.emergency_phone} color="#10b981" />
               <InfoCard icon={<Users size={18} />} label="Parentesco" value={characterization?.emergency_relationship} color="#0891b2" />
            </div>
          </div>
          
          {characterization?.is_working === 'Si' && (
            <div className="glass-card profile-section">
              <SectionTitle icon={<Briefcase size={20} />} title="Información Laboral" />
              <div className="info-items-grid">
                <InfoCard icon={<Briefcase size={18} />} label="Empresa" value={characterization?.work_company} color="#475569" />
                <InfoCard icon={<User size={18} />} label="Cargo" value={characterization?.work_role} color="#64748b" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
