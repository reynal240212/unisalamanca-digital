import React, { useState, useEffect } from 'react';
import { 
  User, Users, Home, GraduationCap, ArrowRight, ArrowLeft, 
  CheckCircle2, Info, Heart, Shield, Loader2, CreditCard, Mail,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../services/supabase';

/* ─────────────────────────────────────────────────────────
   SALMI HINT — pequeño bloque de contexto por paso
───────────────────────────────────────────────────────── */
const SalmiHint = ({ text }) => (
  <div style={{ 
    display: 'flex', gap: '15px', alignItems: 'center', 
    background: 'rgba(22, 182, 214, 0.06)', padding: '18px 20px', 
    borderLeft: '4px solid var(--secondary)', borderRadius: '16px',
    marginBottom: '30px'
  }}>
    <div style={{ width: '46px', height: '46px', flexShrink: 0, background: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <img src="/images/salmi-premium-v2.png" alt="Salmi" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
    <div style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: 600, lineHeight: '1.5' }}>{text}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   FIELD MESSAGE — helper visual de validación
───────────────────────────────────────────────────────── */
const FieldMsg = ({ type, text }) => {
  if (!text) return null;
  const isError = type === 'error';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      marginTop: '5px', fontSize: '0.77rem', fontWeight: 600,
      color: isError ? '#ef4444' : '#16a34a'
    }}>
      {isError ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
      {text}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   RADIO PILL GÉNERO
───────────────────────────────────────────────────────── */
const GenderPill = ({ value, selected, onChange }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    cursor: 'pointer',
    padding: '9px 16px',
    borderRadius: '50px',
    border: `1.5px solid ${selected ? 'var(--secondary)' : '#e2e8f0'}`,
    background: selected ? 'rgba(22,182,214,0.08)' : 'white',
    fontWeight: 600, fontSize: '0.85rem',
    color: selected ? 'var(--secondary)' : '#475569',
    transition: 'all 0.2s',
    userSelect: 'none',
    boxShadow: selected ? '0 0 0 3px rgba(22,182,214,0.12)' : 'none'
  }}>
    <input
      type="radio"
      name="genero"
      value={value}
      checked={selected}
      onChange={() => onChange(value)}
      style={{ display: 'none' }}
    />
    <span style={{
      width: '10px', height: '10px', borderRadius: '50%',
      border: `2px solid ${selected ? 'var(--secondary)' : '#cbd5e1'}`,
      background: selected ? 'var(--secondary)' : 'transparent',
      flexShrink: 0, transition: 'all 0.2s'
    }} />
    {value}
  </label>
);

/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const CharacterizationForm = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sisbenGroups, setSisbenGroups] = useState([]);
  const [sisbenStatus, setSisbenStatus] = useState('loading'); // loading | ok | fallback

  // ── Errores de validación ──────────────────────────────
  const [errors, setErrors] = useState({});

  // ── Datos del formulario ───────────────────────────────
  const [formData, setFormData] = useState({
    // ★ Datos de registro (nuevos)
    identificacion: '',
    nombreCompleto: '',
    correo: '',
    genero: '',
    grupoSisben: '',
    // Personales
    birthDate: '', address: '', phone: '', bloodType: '', healthNotes: '',
    documentType: '', ethnicity: '', disability: '',
    // Familiares
    livesWith: '', emergencyContact: '', emergencyPhone: '', parentEducation: '', 
    maritalStatus: '', hasChildren: 'No', emergencyRelationship: '',
    // Socioeconómicos
    estrato: '', incomeSource: '', isWorking: 'No',
    // Académicos
    previousSchool: '', digitalSkills: '', interests: '',
    workCompany: '', workRole: ''
  });

  // ── Cargar SISBEN desde archivo externo ───────────────
  useEffect(() => {
    const loadSisben = async () => {
      try {
        // Intenta desde /sisben.json (archivo en /public)
        const res = await fetch('/sisben.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        setSisbenGroups(data.grupos || []);
        setSisbenStatus('ok');
      } catch {
        // Fallback embebido
        setSisbenGroups([
          { codigo: 'A1', descripcion: 'Grupo A1 - Pobreza Extrema' },
          { codigo: 'A2', descripcion: 'Grupo A2 - Pobreza Extrema' },
          { codigo: 'A3', descripcion: 'Grupo A3 - Pobreza Extrema' },
          { codigo: 'A4', descripcion: 'Grupo A4 - Pobreza Extrema' },
          { codigo: 'A5', descripcion: 'Grupo A5 - Pobreza Extrema' },
          { codigo: 'B1', descripcion: 'Grupo B1 - Pobreza' },
          { codigo: 'B2', descripcion: 'Grupo B2 - Pobreza' },
          { codigo: 'B3', descripcion: 'Grupo B3 - Pobreza' },
          { codigo: 'B4', descripcion: 'Grupo B4 - Pobreza' },
          { codigo: 'B5', descripcion: 'Grupo B5 - Pobreza' },
          { codigo: 'B6', descripcion: 'Grupo B6 - Pobreza' },
          { codigo: 'B7', descripcion: 'Grupo B7 - Pobreza' },
          { codigo: 'C1', descripcion: 'Grupo C1 - Vulnerable' },
          { codigo: 'C2', descripcion: 'Grupo C2 - Vulnerable' },
          { codigo: 'C3', descripcion: 'Grupo C3 - Vulnerable' },
          { codigo: 'C4', descripcion: 'Grupo C4 - Vulnerable' },
          { codigo: 'C5', descripcion: 'Grupo C5 - Vulnerable' },
          { codigo: 'C6', descripcion: 'Grupo C6 - Vulnerable' },
          { codigo: 'C7', descripcion: 'Grupo C7 - Vulnerable' },
          { codigo: 'C8', descripcion: 'Grupo C8 - Vulnerable' },
          { codigo: 'NO_SISBEN', descripcion: 'No clasificado / Sin SISBEN' },
        ]);
        setSisbenStatus('fallback');
      }
    };
    loadSisben();
  }, []);

  // ── Prellenar datos existentes ─────────────────────────
  useEffect(() => {
    if (user?.characterization) {
      const d = user.characterization;
      setFormData(prev => ({
        ...prev,
        identificacion: d.identificacion || user?.document_number || '',
        nombreCompleto: d.nombre_completo || user?.name || '',
        correo: d.correo || user?.email || '',
        genero: d.gender || '',
        grupoSisben: d.grupo_sisben || '',
        birthDate: d.birth_date || '',
        address: d.address || '',
        phone: d.phone || '',
        bloodType: d.blood_type || '',
        healthNotes: d.health_notes || '',
        documentType: d.document_type || '',
        ethnicity: d.ethnicity || '',
        disability: d.disability || '',
        livesWith: d.lives_with || '',
        emergencyContact: d.emergency_contact || '',
        emergencyPhone: d.emergency_phone || '',
        parentEducation: d.parent_education || '',
        maritalStatus: d.marital_status || '',
        hasChildren: d.has_children || 'No',
        emergencyRelationship: d.emergency_relationship || '',
        estrato: d.estrato?.toString() || '',
        incomeSource: d.income_source || '',
        isWorking: d.is_working || 'No',
        previousSchool: d.previous_school || '',
        digitalSkills: d.digital_skills || '',
        interests: d.interests || '',
        workCompany: d.work_company || '',
        workRole: d.work_role || ''
      }));
    } else if (user) {
      // Pre-fill desde datos de sesión si no hay characterization
      setFormData(prev => ({
        ...prev,
        identificacion: user.document_number || '',
        nombreCompleto: user.name || '',
        correo: user.email || ''
      }));
    }
  }, [user]);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const set = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' })); // clear error on change
  };

  // ── Validaciones ───────────────────────────────────────
  const VALIDATIONS = {
    identificacion: (v) => {
      if (!v) return 'La identificación es obligatoria.';
      if (!/^\d+$/.test(v)) return 'Solo se permiten números.';
      if (v.length < 6) return 'Mínimo 6 dígitos.';
      if (v.length > 10) return 'Máximo 10 dígitos.';
      return '';
    },
    nombreCompleto: (v) => {
      if (!v.trim()) return 'El nombre es obligatorio.';
      if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9]/.test(v)) return 'No se permiten caracteres especiales.';
      if (v.trim().length < 3) return 'Mínimo 3 caracteres.';
      return '';
    },
    correo: (v) => {
      if (!v.trim()) return 'El correo es obligatorio.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Correo electrónico inválido.';
      return '';
    },
    birthDate: (v) => {
      if (!v) return 'La fecha de nacimiento es obligatoria.';
      if (new Date(v) < new Date('1955-01-01')) return 'Fecha mínima: 01/01/1955.';
      if (new Date(v) > new Date()) return 'La fecha no puede ser futura.';
      return '';
    },
    grupoSisben: (v) => (!v ? 'Seleccione un grupo SISBEN.' : ''),
    genero: (v) => (!v ? 'Seleccione una opción de género.' : ''),
  };

  const validateStep1 = () => {
    const fields = ['identificacion', 'nombreCompleto', 'correo', 'birthDate', 'grupoSisben', 'genero'];
    const newErrors = {};
    let valid = true;
    fields.forEach(f => {
      const err = VALIDATIONS[f] ? VALIDATIONS[f](formData[f]) : '';
      if (err) { newErrors[f] = err; valid = false; }
    });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return valid;
  };

  const steps = [
    { id: 1, label: 'Identidad', icon: <User size={18} /> },
    { id: 2, label: 'Entorno',   icon: <Users size={18} /> },
    { id: 3, label: 'Bienestar', icon: <Home size={18} /> },
    { id: 4, label: 'Academia',  icon: <GraduationCap size={18} /> }
  ];

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    nextStep();
  };

  // ── Guardar en Supabase ───────────────────────────────
  const handleFinalize = async () => {
    if (!user?.id) { alert('No se pudo identificar al usuario. Reintenta el login.'); return; }
    setIsSaving(true);
    try {
      const dbData = {
        user_id: user.id,
        // Nuevos campos
        identificacion: formData.identificacion,
        nombre_completo: formData.nombreCompleto,
        correo: formData.correo,
        grupo_sisben: formData.grupoSisben,
        // Campos existentes
        birth_date: formData.birthDate,
        blood_type: formData.bloodType,
        address: formData.address,
        phone: formData.phone,
        health_notes: formData.healthNotes,
        document_type: formData.documentType,
        gender: formData.genero,
        ethnicity: formData.ethnicity,
        disability: formData.disability,
        lives_with: formData.livesWith,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        emergency_relationship: formData.emergencyRelationship,
        parent_education: formData.parentEducation,
        marital_status: formData.maritalStatus,
        has_children: formData.hasChildren,
        estrato: parseInt(formData.estrato) || null,
        income_source: formData.incomeSource,
        is_working: formData.isWorking,
        work_company: formData.workCompany,
        work_role: formData.workRole,
        previous_school: formData.previousSchool,
        digital_skills: formData.digitalSkills,
        interests: formData.interests,
        completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('characterization')
        .upsert(dbData, { onConflict: 'user_id' });

      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => onComplete(), 3000);
    } catch (err) {
      console.error('Error saving characterization:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Estilos de input reutilizables ────────────────────
  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    color: '#1e293b',
    background: errors[field] ? '#fef2f2' : 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: errors[field] ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '7px'
  };

  // ── Contenido por paso ────────────────────────────────
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <SalmiHint text="¡Hola! Comencemos verificando y completando tus datos de identificación. Esta información es fundamental para tu carnet digital." />

            {/* ─ Fila 1: Identificación + Nombre ─ */}
            <div className="form-grid-premium">
              {/* Identificación */}
              <div className="form-field-premium">
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CreditCard size={13} /> Número de Identificación *
                  </span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="6 a 10 dígitos"
                  value={formData.identificacion}
                  maxLength={10}
                  onChange={e => set('identificacion', e.target.value.replace(/\D/g, ''))}
                  style={inputStyle('identificacion')}
                />
                <FieldMsg type="error" text={errors.identificacion} />
              </div>

              {/* Nombre Completo */}
              <div className="form-field-premium">
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={13} /> Nombre Completo *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Sin caracteres especiales"
                  value={formData.nombreCompleto}
                  maxLength={80}
                  onChange={e => {
                    const val = e.target.value;
                    // Bloquea caracteres especiales en tiempo real
                    if (!/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9]/.test(val) || val === '') {
                      set('nombreCompleto', val);
                    } else {
                      set('nombreCompleto', val); // almacena pero marca error
                    }
                  }}
                  style={inputStyle('nombreCompleto')}
                />
                <FieldMsg type="error" text={errors.nombreCompleto} />
              </div>

              {/* Correo */}
              <div className="form-field-premium">
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={13} /> Correo Electrónico *
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="usuario@dominio.com"
                  value={formData.correo}
                  onChange={e => set('correo', e.target.value)}
                  style={inputStyle('correo')}
                />
                <FieldMsg type="error" text={errors.correo} />
              </div>

              {/* Fecha de Nacimiento */}
              <div className="form-field-premium">
                <label style={labelStyle}>Fecha de Nacimiento *</label>
                <input
                  type="date"
                  className="input-premium"
                  min="1955-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.birthDate}
                  onChange={e => set('birthDate', e.target.value)}
                  style={inputStyle('birthDate')}
                />
                <FieldMsg type="error" text={errors.birthDate} />
              </div>

              {/* Grupo SISBEN */}
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Grupo SISBEN *</label>
                <select
                  value={formData.grupoSisben}
                  onChange={e => set('grupoSisben', e.target.value)}
                  style={{ ...inputStyle('grupoSisben'), cursor: 'pointer', appearance: 'auto' }}
                >
                  <option value="">
                    {sisbenStatus === 'loading' ? 'Cargando grupos SISBEN…' : '-- Seleccione un grupo --'}
                  </option>
                  {sisbenGroups.map(g => (
                    <option key={g.codigo} value={g.codigo}>{g.descripcion}</option>
                  ))}
                </select>
                {sisbenStatus === 'ok' && (
                  <div style={{ fontSize: '0.73rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
                    ✅ {sisbenGroups.length} grupos cargados desde sisben.json
                  </div>
                )}
                {sisbenStatus === 'fallback' && (
                  <div style={{ fontSize: '0.73rem', color: '#f59e0b', marginTop: '4px', fontWeight: 600 }}>
                    ⚠ Datos precargados — coloca sisben.json en /public para actualizar.
                  </div>
                )}
                <FieldMsg type="error" text={errors.grupoSisben} />
              </div>

              {/* Género — Radio Pills */}
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Género *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
                  {['Masculino', 'Femenino', 'No Binario', 'Transgénero', 'Cisgénero'].map(g => (
                    <GenderPill
                      key={g}
                      value={g}
                      selected={formData.genero === g}
                      onChange={v => set('genero', v)}
                    />
                  ))}
                </div>
                <FieldMsg type="error" text={errors.genero} />
              </div>

              {/* Tipo de Documento + RH */}
              <div className="form-field-premium">
                <label style={labelStyle}>Tipo de Documento</label>
                <select className="input-premium" value={formData.documentType} onChange={e => set('documentType', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['C.C.', 'T.I.', 'C.E.', 'Pasaporte', 'PEP'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Grupo Sanguíneo (RH)</label>
                <select className="input-premium" value={formData.bloodType} onChange={e => set('bloodType', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(rh => <option key={rh} value={rh}>{rh}</option>)}
                </select>
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Pertenencia Étnica</label>
                <select className="input-premium" value={formData.ethnicity} onChange={e => set('ethnicity', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['Ninguna', 'Afrocolombiano', 'Indígena', 'Raizal', 'Palenquero', 'Rrom'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Discapacidad (si aplica)</label>
                <select className="input-premium" value={formData.disability} onChange={e => set('disability', e.target.value)}>
                  <option value="Ninguna">Ninguna</option>
                  {['Física', 'Visual', 'Auditiva', 'Cognitiva', 'Múltiple'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Dirección de Residencia Actual</label>
                <input type="text" className="input-premium" placeholder="Ej: Calle 45 # 23-12, Barrio" value={formData.address} onChange={e => set('address', e.target.value)} />
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Teléfono Celular Personal</label>
                <input type="tel" className="input-premium" placeholder="300 000 0000" value={formData.phone} onChange={e => set('phone', e.target.value)} />
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Condiciones Médicas / Alergias</label>
                <input type="text" className="input-premium" placeholder="Ninguna" value={formData.healthNotes} onChange={e => set('healthNotes', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <SalmiHint text="La familia es lo primero. Cuéntanos quién te acompaña en este camino académico." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label className="label-premium">¿Con quién vives actualmente?</label>
                <select className="input-premium" value={formData.livesWith} onChange={e => set('livesWith', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="Padres">Padres</option>
                  <option value="Solo">Solo</option>
                  <option value="Otros familiares">Otros familiares</option>
                  <option value="Residencia">Residencia Universitaria</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Nivel Educativo de tus Padres</label>
                <select className="input-premium" value={formData.parentEducation} onChange={e => set('parentEducation', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Estado Civil</label>
                <select className="input-premium" value={formData.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['Soltero', 'Casado', 'Unión Libre', 'Divorciado', 'Viudo'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">¿Tiene Hijos?</label>
                <select className="input-premium" value={formData.hasChildren} onChange={e => set('hasChildren', e.target.value)}>
                  <option value="No">No</option>
                  <option value="Si">Sí</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Contacto de Emergencia</label>
                <input type="text" className="input-premium" placeholder="Nombre completo" value={formData.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Parentesco</label>
                <input type="text" className="input-premium" placeholder="Ej: Madre, Padre, Esposo..." value={formData.emergencyRelationship} onChange={e => set('emergencyRelationship', e.target.value)} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Teléfono del Contacto</label>
                <input type="tel" className="input-premium" placeholder="Celular de contacto" value={formData.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <SalmiHint text="Estos datos nos ayudan a gestionar apoyos y beneficios para ti. Todo se maneja de forma confidencial." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label className="label-premium">Estrato Socioeconómico</label>
                <select className="input-premium" value={formData.estrato} onChange={e => set('estrato', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Fuente Secundaria de Ingresos</label>
                <select className="input-premium" value={formData.incomeSource} onChange={e => set('incomeSource', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="Padres">Apoyo Familiar</option>
                  <option value="TrabajoPropio">Ingresos Propios</option>
                  <option value="Becas">Becas Estatales/Privadas</option>
                  <option value="Otros">Otros recursos</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">¿Realizas actividades laborales?</label>
                <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                  {['Si', 'No'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="radio" name="working" className="radio-premium" checked={formData.isWorking === opt} onChange={() => set('isWorking', opt)} />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>{opt === 'Si' ? 'Sí, trabajo' : 'No en el momento'}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.isWorking === 'Si' && (
                <>
                  <div className="form-field-premium">
                    <label className="label-premium">Empresa / Lugar de Trabajo</label>
                    <input type="text" className="input-premium" placeholder="Nombre de la empresa" value={formData.workCompany} onChange={e => set('workCompany', e.target.value)} />
                  </div>
                  <div className="form-field-premium">
                    <label className="label-premium">Cargo u Ocupación</label>
                    <input type="text" className="input-premium" placeholder="Ej: Asistente, Vendedor..." value={formData.workRole} onChange={e => set('workRole', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <SalmiHint text="¡Casi terminamos! Cuéntanos de dónde vienes y qué te apasiona." />
            <div className="form-grid-premium" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-field-premium">
                <label className="label-premium">Institución Educativa de Procedencia</label>
                <input type="text" className="input-premium" placeholder="Nombre completo del colegio" value={formData.previousSchool} onChange={e => set('previousSchool', e.target.value)} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Habilidades Digitales (Software, herramientas...)</label>
                <input type="text" className="input-premium" placeholder="Ej: Office, Adobe, Programación, etc." value={formData.digitalSkills} onChange={e => set('digitalSkills', e.target.value)} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Intereses Artísticos, Deportivos o Culturales</label>
                <textarea className="input-premium" rows="3" placeholder="¿Cómo te gusta aprovechar tu tiempo libre?" value={formData.interests} onChange={e => set('interests', e.target.value)} style={{ resize: 'none' }} />
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  // ── Vista de éxito / resumen ──────────────────────────
  if (showSuccess) {
    const SummarySection = ({ icon, title, fields, stepTarget }) => (
      <div className="glass-card section-reveal" style={{ padding: '25px', marginBottom: '20px', border: '1px solid rgba(22,182,214,0.1)', background: 'rgba(255,255,255,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px', color: 'white' }}>{icon}</div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{title}</h3>
          </div>
          <button onClick={() => { setStep(stepTarget); setShowSuccess(false); }} style={{ padding: '6px 12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', color: '#64748b' }}>
            Editar <User size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '15px' }}>
          {fields.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{f.value || 'No reportado'}</div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="section-reveal" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>¡Todo listo, {user?.name?.split(' ')[0]}!</h2>
          <p style={{ color: '#64748b', marginTop: '10px' }}>Revisa que toda tu información sea correcta antes de activar tu carnet.</p>
        </div>

        <SummarySection icon={<User size={18} />} title="IDENTIFICACIÓN Y CONTACTO" stepTarget={1} fields={[
          { label: 'No. Identificación', value: formData.identificacion },
          { label: 'Nombre Completo', value: formData.nombreCompleto },
          { label: 'Correo', value: formData.correo },
          { label: 'Género', value: formData.genero },
          { label: 'SISBEN', value: formData.grupoSisben },
          { label: 'Nacimiento', value: formData.birthDate },
          { label: 'RH', value: formData.bloodType },
          { label: 'Celular', value: formData.phone },
        ]} />

        <SummarySection icon={<Users size={18} />} title="ENTORNO FAMILIAR" stepTarget={2} fields={[
          { label: 'Vive con', value: formData.livesWith },
          { label: 'Estado Civil', value: formData.maritalStatus },
          { label: 'Hijos', value: formData.hasChildren },
          { label: 'Contacto Emergencia', value: formData.emergencyContact },
          { label: 'Parentesco', value: formData.emergencyRelationship },
          { label: 'Tel. Emergencia', value: formData.emergencyPhone },
        ]} />

        <SummarySection icon={<Heart size={18} />} title="BIENESTAR Y SOCIOECONOMÍA" stepTarget={3} fields={[
          { label: 'Estrato', value: formData.estrato },
          { label: 'Ingresos', value: formData.incomeSource },
          { label: 'Labora', value: formData.isWorking },
          { label: 'Empresa', value: formData.workCompany },
          { label: 'Cargo', value: formData.workRole },
        ]} />

        <SummarySection icon={<GraduationCap size={18} />} title="ACADEMIA E INTERESES" stepTarget={4} fields={[
          { label: 'Procedencia', value: formData.previousSchool },
          { label: 'Habilidades', value: formData.digitalSkills },
        ]} />

        <div style={{ marginTop: '30px' }}>
          <SalmiHint text="¡Excelente trabajo! Si crees que todo está en orden, presiona el botón inferior para finalizar el proceso y activar tu carnet." />
        </div>

        <button onClick={handleFinalize} className="btn-primary-premium" disabled={isSaving}
          style={{ width: '100%', padding: '20px', background: 'var(--primary)', marginTop: '20px', boxShadow: '0 20px 40px rgba(42,34,102,0.2)' }}>
          {isSaving
            ? <><Loader2 size={18} className="animate-spin" /> Guardando en la nube…</>
            : <>CONFIRMAR Y ACTIVAR MI CARNET <ArrowRight size={20} /></>}
        </button>
      </div>
    );
  }

  // ── Vista principal del stepper ───────────────────────
  return (
    <div className="glass-card" style={{ 
      maxWidth: '850px', 
      margin: '0 auto', 
      boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
      padding: window.innerWidth < 768 ? '20px' : '40px'
    }}>
      {/* STEPPER */}
      <div className="characterization-stepper" style={{ marginBottom: '48px' }}>
        {steps.map(s => (
          <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="step-bubble" style={{
              transform: step === s.id ? 'scale(1.1)' : 'scale(1)',
              boxShadow: step === s.id ? '0 0 20px rgba(22,182,214,0.3)' : 'none'
            }}>
              {step > s.id ? <CheckCircle2 size={24} className="text-secondary" /> : s.icon}
            </div>
            <span className="step-label" style={{
              fontWeight: step === s.id ? 900 : 600,
              color: step === s.id ? 'var(--primary)' : '#94a3b8',
              fontSize: '0.75rem', marginTop: '12px'
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ minHeight: '420px' }}>
        {renderStepContent()}
      </div>

      {/* BOTONES NAVEGACIÓN */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '40px', 
        paddingTop: '30px', 
        borderTop: '1px dotted #e2e8f0',
        flexWrap: 'wrap',
        gap: '15px' 
      }}>
        <button onClick={prevStep} className="btn-secondary-premium" disabled={step === 1 || isSaving}
          style={{ 
            opacity: (step === 1 || isSaving) ? 0.3 : 1, 
            padding: '14px 28px',
            flex: window.innerWidth < 480 ? '1' : 'none'
          }}>
          <ArrowLeft size={18} /> Anterior
        </button>

        {step < 4 ? (
          <button onClick={handleNext} className="btn-primary-premium" disabled={isSaving}
            style={{ 
              padding: '14px 28px', 
              background: 'var(--primary)',
              flex: window.innerWidth < 480 ? '1' : 'none'
            }}>
            Continuar <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={() => setShowSuccess(true)} className="btn-primary-premium"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary), #0e94ad)', 
              padding: '14px 32px',
              flex: window.innerWidth < 480 ? '1' : 'none'
            }}
            disabled={isSaving}>
            {isSaving
              ? <><Loader2 size={18} className="animate-spin" /> Sincronizando...</>
              : <>Revisar <CheckCircle2 size={18} /></>}
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterizationForm;
