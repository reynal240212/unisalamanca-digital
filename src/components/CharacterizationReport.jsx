import React from 'react';
import { Shield, User, Users, Heart, GraduationCap, MapPin, Phone, HeartPulse } from 'lucide-react';

const CharacterizationReport = ({ student, charData }) => {
  if (!student || !charData) return null;

  const Section = ({ title, icon, children }) => (
    <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px', marginBottom: '15px' }}>
        <div style={{ color: '#1e3a8a' }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase' }}>{title}</h3>
      </div>
      <div className="responsive-grid-2" style={{ gap: '15px' }}>
        {children}
      </div>
    </div>
  );

  const DataField = ({ label, value }) => (
    <div>
      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{value || 'NO REGISTRADO'}</p>
    </div>
  );

  return (
    <div id="printable-ficha" className="print-only" style={{ 
      padding: '50px', 
      background: 'white', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* HEADER OFICIAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '4px double #e2e8f0', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/images/escudo.png" alt="Logo" style={{ height: '80px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a' }}>UNIVERSIDAD UNISALAMANCA</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>SECRETARÍA GENERAL Y REGISTRO ACADÉMICO</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>FICHA DE CARACTERIZACIÓN INSTITUCIONAL - V2026</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>FECHA DE EMISIÓN</p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e293b' }}>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* CUERPO DEL REPORTE */}
      <Section title="Información Personal e Identidad" icon={<User size={20} />}>
        <DataField label="Nombre Completo" value={student.name} />
        <DataField label="Documento / ID" value={student.document_id} />
        <DataField label="Fecha de Nacimiento" value={charData.birth_date} />
        <DataField label="Tipo de Sangre (RH)" value={charData.blood_type} />
        <DataField label="Correo Institucional" value={student.email} />
        <DataField label="Teléfono de Contacto" value={charData.phone} />
        <div style={{ gridColumn: 'span 2' }}>
          <DataField label="Dirección de Residencia" value={charData.address} />
        </div>
      </Section>

      <Section title="Entorno Familiar y Emergencias" icon={<Users size={20} />}>
        <DataField label="Convive con" value={charData.lives_with} />
        <DataField label="Nivel Educativo Padres" value={charData.parent_education} />
        <DataField label="Contacto de Emergencia" value={charData.emergency_contact} />
        <DataField label="Teléfono de Emergencia" value={charData.emergency_phone} />
      </Section>

      <Section title="Bienestar y Socioeconomía" icon={<HeartPulse size={20} />}>
        <DataField label="Estrato Socioeconómico" value={charData.estrato} />
        <DataField label="Fuente de Ingresos" value={charData.income_source} />
        <DataField label="¿Realiza Actividades Laborales?" value={charData.is_working} />
        <div style={{ gridColumn: 'span 2' }}>
          <DataField label="Observaciones Médicas / Alergias" value={charData.health_notes} />
        </div>
      </Section>

      <Section title="Antecedentes e Intereses" icon={<GraduationCap size={20} />}>
        <DataField label="Colegio de Procedencia" value={charData.previous_school} />
        <DataField label="Programa Académico" value={student.program} />
        <div style={{ gridColumn: 'span 2' }}>
          <DataField label="Habilidades Digitales" value={charData.digital_skills} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <DataField label="Intereses Culturales / Deportivos" value={charData.interests} />
        </div>
      </Section>

      {/* FOOTER OFICIAL */}
      <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
          Este documento es una representación digital oficial de la información suministrada por el estudiante bajo juramento.
        </p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>
          Universidad UniSalamanca - Sistema de Identidad Digital Alta Fidelidad
        </p>
      </div>

      <style>{`
        @media screen {
          .print-only { display: none; }
        }
        @media print {
          .print-only { display: block !important; }
          body * { visibility: hidden; }
          #printable-ficha, #printable-ficha * { visibility: visible; }
          #printable-ficha { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CharacterizationReport;
