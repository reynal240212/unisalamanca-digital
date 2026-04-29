import React from 'react';
import { Shield, User, Users, Heart, GraduationCap, MapPin, Phone, HeartPulse, Briefcase, Monitor, AlertCircle } from 'lucide-react';

const CharacterizationReport = ({ student, charData }) => {
  if (!student) return null;

  // Calcular edad
  const calcAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const age = calcAge(charData?.birth_date);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  const Section = ({ title, icon, children, cols = 2 }) => (
    <div style={{ marginBottom: '28px', pageBreakInside: 'avoid' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px', marginBottom: '15px' }}>
        <div style={{ color: '#1e3a8a' }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
        {children}
      </div>
    </div>
  );

  const DataField = ({ label, value, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ margin: '3px 0 0', fontSize: '0.9rem', fontWeight: 600, color: value ? '#1e293b' : '#94a3b8', fontStyle: value ? 'normal' : 'italic' }}>
        {value || 'No registrado'}
      </p>
    </div>
  );

  const Badge = ({ label, color = '#1e3a8a', bg = '#e0e7ff' }) => (
    <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block' }}>
      {label}
    </span>
  );

  return (
    <div id="printable-ficha" className="print-only" style={{ 
      padding: '50px', 
      background: 'white', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* HEADER OFICIAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '4px double #e2e8f0', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/images/escudo.png" alt="Logo" style={{ height: '80px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a' }}>UNIVERSIDAD UNISALAMANCA</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>SECRETARÍA GENERAL Y REGISTRO ACADÉMICO</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>FICHA DE CARACTERIZACIÓN INSTITUCIONAL · V2026</p>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>FECHA DE EMISIÓN</p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#1e293b' }}>{new Date().toLocaleDateString('es-CO')}</p>
          </div>
          {student.semester && (
            <Badge label={`Semestre ${student.semester}`} color="#1e3a8a" bg="#e0e7ff" />
          )}
          {student.study_modality && (
            <Badge label={student.study_modality} color="#065f46" bg="#d1fae5" />
          )}
        </div>
      </div>

      {/* BANNER ESTUDIANTE */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', borderRadius: '16px', padding: '20px 28px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
          <img src={student.photo_url || '/images/default-avatar.png'} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.3rem', fontWeight: 900 }}>{student.name}</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            {student.program} · Código: {student.code || student.document_id}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>ESTADO</p>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#4ade80' }}>{student.status || 'ACTIVO'}</p>
        </div>
      </div>

      {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
      <Section title="Información Personal e Identidad" icon={<User size={18} />}>
        <DataField label="Nombre Completo" value={charData?.nombre_completo || student.name} />
        <DataField label="Documento de Identidad" value={charData?.identificacion || student.document_id} />
        <DataField label="Tipo de Documento" value={charData?.document_type} />
        <DataField label="Género" value={charData?.gender} />
        <DataField label="Estado Civil" value={charData?.marital_status} />
        <DataField label="Fecha de Nacimiento" value={formatDate(charData?.birth_date)} />
        {age && <DataField label="Edad" value={`${age} años`} />}
        <DataField label="Tipo de Sangre (RH)" value={charData?.blood_type} />
        <DataField label="Correo Institucional" value={charData?.correo || student.email} span={2} />
        <DataField label="Teléfono de Contacto" value={charData?.phone} />
        <DataField label="Lugar de Nacimiento" value={charData?.lugar_nacimiento} />
        <DataField label="Lugar de Expedición Doc." value={charData?.lugar_expedicion} />
        <DataField label="Etnia / Grupo Étnico" value={charData?.ethnicity} />
        <DataField label="Discapacidad" value={charData?.disability} />
        <DataField label="¿Es víctima del conflicto?" value={charData?.is_victim} />
        <DataField label="Dirección de Residencia" value={charData?.address} span={2} />
        <DataField label="Barrio" value={charData?.barrio} />
        <DataField label="Ciudad de Residencia" value={charData?.ciudad_residencia} />
        <DataField label="Departamento de Residencia" value={charData?.depto_residencia} />
        <DataField label="Localidad" value={charData?.localidad} />
        <DataField label="Medio de Transporte" value={charData?.transport_mode} />
      </Section>

      {/* SECCIÓN 2: SALUD Y AFILIACIONES */}
      <Section title="Salud y Afiliaciones" icon={<HeartPulse size={18} />}>
        <DataField label="EPS" value={charData?.eps} />
        <DataField label="Caja de Compensación" value={charData?.caja_compensacion} />
        <DataField label="Grupo SISBEN" value={charData?.grupo_sisben} />
        <DataField label="Observaciones Médicas / Alergias" value={charData?.health_notes} span={2} />
      </Section>

      {/* SECCIÓN 3: ENTORNO FAMILIAR */}
      <Section title="Entorno Familiar y Contactos" icon={<Users size={18} />}>
        <DataField label="Convive con" value={charData?.lives_with} />
        <DataField label="Nivel Educativo Padres" value={charData?.parent_education} />
        <DataField label="¿Tiene hijos?" value={charData?.has_children} />
        <DataField label="Contacto de Emergencia" value={charData?.emergency_contact} />
        <DataField label="Relación con el Contacto" value={charData?.emergency_relationship} />
        <DataField label="Teléfono de Emergencia" value={charData?.emergency_phone} />
      </Section>

      {/* SECCIÓN 4: SOCIOECONÓMICA */}
      <Section title="Información Socioeconómica" icon={<Heart size={18} />}>
        <DataField label="Estrato Socioeconómico" value={charData?.estrato ? `Estrato ${charData.estrato}` : null} />
        <DataField label="Fuente de Ingresos" value={charData?.income_source} />
        <DataField label="¿Realiza Actividades Laborales?" value={charData?.is_working} />
        <DataField label="Empresa donde labora" value={charData?.work_company} />
        <DataField label="Cargo" value={charData?.work_role} />
        <DataField label="¿Tiene computador?" value={charData?.has_computer} />
        <DataField label="¿Tiene Internet?" value={charData?.has_internet} />
      </Section>

      {/* SECCIÓN 5: ACADÉMICA */}
      <Section title="Antecedentes Académicos" icon={<GraduationCap size={18} />}>
        <DataField label="Colegio de Procedencia" value={charData?.previous_school} />
        <DataField label="Último Grado Aprobado" value={charData?.last_degree} />
        <DataField label="Año de Graduación" value={charData?.graduation_year} />
        <DataField label="Programa Académico" value={student.program} />
        <DataField label="Modalidad de Estudio" value={student.study_modality} />
        <DataField label="Semestre Actual" value={student.semester ? `Semestre ${student.semester}` : null} />
        <DataField label="Habilidades Digitales" value={charData?.digital_skills} span={2} />
        <DataField label="Intereses Culturales / Deportivos" value={charData?.interests} span={2} />
      </Section>

      {/* FOOTER OFICIAL */}
      <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            Este documento es una representación digital oficial de la información suministrada por el estudiante.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Universidad UniSalamanca · Sistema de Identidad Digital · {new Date().getFullYear()}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color="#1e3a8a" />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e3a8a' }}>DOCUMENTO OFICIAL</span>
        </div>
      </div>

      <style>{`
        @media screen {
          .print-only { display: none; }
        }
        @media print {
          .print-only { display: block !important; }
          body * { visibility: hidden; }
          #printable-ficha, #printable-ficha * { visibility: visible; }
          #printable-ficha { position: absolute; left: 0; top: 0; width: 100%; padding: 30px; }
        }
      `}</style>
    </div>
  );
};

export default CharacterizationReport;
