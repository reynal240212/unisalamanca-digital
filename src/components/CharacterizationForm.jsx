import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Users, Home, GraduationCap, ArrowRight, ArrowLeft, 
  CheckCircle2, Info, Heart, Shield, Loader2, CreditCard, Mail,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../services/supabase';
import useColombiaGeo from '../hooks/useColombiaGeo';

/* ─────────────────────────────────────────────────────────
   SALMI HINT — pequeño bloque de contexto por paso
───────────────────────────────────────────────────────── */
const SalmiHint = ({ text }) => (
  <div style={{ 
    display: 'flex', gap: '15px', alignItems: 'center', 
    background: 'rgba(22, 182, 214, 0.06)', padding: '16px 20px', 
    borderLeft: '4px solid var(--secondary)', borderRadius: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  }}>
    <div style={{ width: '42px', height: '42px', flexShrink: 0, background: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <img src="/images/salmi-premium-v2.png" alt="Salmi" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
    <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600, lineHeight: '1.4', flex: '1', minWidth: '200px' }}>{text}</div>
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
   PILL SELECT — Selector tipo botón con estilo premium
───────────────────────────────────────────────────────── */
const PillSelect = ({ name, value, selected, onChange, label }) => (
  <label className="gender-pill-label" style={{
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
      name={name}
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
    {label || value}
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
  const [geoData, setGeoData] = useState({});
  const [healthData, setHealthData] = useState({ eps: [], cajas: [] });
  const [institutions, setInstitutions] = useState([]);
  const [daneSchools, setDaneSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

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
    // Personales originarios
    lugarNacimiento: '',
    lugarExpedicion: '',
    eps: '',
    cajaCompensacion: '',
    isVictim: 'No',
    // Personales contacto
    birthDate: '', 
    deptoResidencia: '',
    ciudadResidencia: '',
    address: '', 
    barrio: '', 
    phone: '', 
    bloodType: '', 
    healthNotes: '',
    documentType: '', 
    ethnicity: '', 
    disability: '',
    // Familiares
    livesWith: '', 
    emergencyContact: '', 
    emergencyPhone: '', 
    parentEducation: '', 
    maritalStatus: '', 
    hasChildren: 'No', 
    emergencyRelationship: '',
    // Socioeconómicos
    estrato: '', 
    incomeSource: '', 
    isWorking: 'No',
    hasComputer: 'No',
    hasInternet: 'No',
    transportMode: '',
    // Académicos
    previousSchool: '', 
    digitalSkills: '', 
    interests: '',
    workCompany: '', 
    workRole: '',
    localidad: '',
    // Académicos nuevos
    lastDegree: '',
    graduationYear: '',
    lastInstitution: '',
    diplomaUrl: '',
    // Legal
    policiesAccepted: false
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

    // Cargar Geodatos, Entidades de Salud e Instituciones
    const loadExtraData = async () => {
      try {
        const [geoRes, healthRes, instRes] = await Promise.all([
          fetch('/geo_colombia.json'),
          fetch('/health_entities.json'),
          fetch('/institutions.json')
        ]);
        if (geoRes.ok) setGeoData(await geoRes.json());
        if (healthRes.ok) setHealthData(await healthRes.json());
        if (instRes.ok) {
          const data = await instRes.json();
          setInstitutions(data.top_universities || []);
        }
      } catch (err) {
        console.warn('Error cargando datos extra:', err);
      }
    };
    loadExtraData();
  }, []);

  // ── Cargar Colegios desde DANE según Ciudad ───────────
  useEffect(() => {
    const fetchSchools = async () => {
      const city = formData.ciudadResidencia;
      if (!city || city === '-- Seleccione un municipio --') return;
      
      setLoadingSchools(true);
      try {
        // Normalizar nombre de ciudad para la API (usualmente en MAYÚSCULAS)
        const normalizedCity = city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const url = `https://www.datos.gov.co/resource/upkm-vdjb.json?nombremunicipio=${normalizedCity}&$limit=1500`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Extraer nombres únicos
          const names = [...new Set(data.map(item => item.nombreestablecimiento))].sort();
          setDaneSchools(names);
        }
      } catch (err) {
        console.warn('Error conectando con DANE API:', err);
      } finally {
        setLoadingSchools(false);
      }
    };

    if (step >= 4) { // Cargar cuando el usuario se acerca al paso académico
      fetchSchools();
    }
  }, [formData.ciudadResidencia, step]);

  // ── Prellenar datos existentes ─────────────────────────
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    
    if (user?.characterization) {
      hasInitialized.current = true;
      const d = user.characterization;
      setFormData(prev => ({
        ...prev,
        identificacion: d.identificacion || user?.document_number || '',
        nombreCompleto: d.nombre_completo || user?.name || '',
        correo: d.correo || user?.email || '',
        genero: d.gender || '',
        grupoSisben: d.grupo_sisben || '',
        // Nuevos
        lugarNacimiento: d.lugar_nacimiento || '',
        lugarExpedicion: d.lugar_expedicion || '',
        eps: d.eps || '',
        cajaCompensacion: d.caja_compensacion || '',
        deptoResidencia: d.depto_residencia || '',
        ciudadResidencia: d.ciudad_residencia || '',
        isVictim: d.is_victim || 'No',
        hasComputer: d.has_computer || 'No',
        hasInternet: d.has_internet || 'No',
        transportMode: d.transport_mode || '',
        policiesAccepted: d.policies_accepted || false,
        // Base
        birthDate: d.birth_date || '',
        address: d.address || '',
        barrio: d.barrio || '',
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
        workRole: d.work_role || '',
        localidad: d.localidad || '',
        lastDegree: d.last_degree || '',
        graduationYear: d.graduation_year || '',
        lastInstitution: d.last_institution || '',
        diplomaUrl: d.diploma_url || ''
      }));
    } else if (user && user.id && !hasInitialized.current) {
      hasInitialized.current = true;
      // Pre-fill desde datos de sesión si no hay characterization
      setFormData(prev => ({
        ...prev,
        identificacion: user.document_number || '',
        nombreCompleto: user.name || '',
        correo: user.email || ''
      }));
    }
  }, [user?.id]);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
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
    { id: 4, label: 'Académico', icon: <GraduationCap size={18} /> },
    { id: 5, label: 'Expediente', icon: <Shield size={18} /> }
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
        // Nuevos
        lugar_nacimiento: formData.lugarNacimiento,
        lugar_expedicion: formData.lugarExpedicion,
        eps: formData.eps,
        caja_compensacion: formData.cajaCompensacion,
        depto_residencia: formData.deptoResidencia,
        ciudad_residencia: formData.ciudadResidencia,
        is_victim: formData.isVictim,
        has_computer: formData.hasComputer,
        has_internet: formData.hasInternet,
        transport_mode: formData.transportMode,
        policies_accepted: formData.policiesAccepted,
        // Campos existentes
        birth_date: formData.birthDate,
        blood_type: formData.bloodType,
        address: formData.address,
        barrio: formData.barrio,
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
        localidad: formData.localidad,
        last_degree: formData.lastDegree,
        graduation_year: formData.graduationYear,
        last_institution: formData.lastInstitution,
        diploma_url: formData.diplomaUrl,
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

  // ── Hook de Geodatos (DANE) ──────────────────────────
  const { departments, getCitiesByDept, allCities, loading: geoLoading } = useColombiaGeo();

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

              {/* Lugar de Nacimiento */}
              <div className="form-field-premium">
                <label style={labelStyle}>Lugar de Nacimiento</label>
                <input
                  list="all-cities-list"
                  className="input-premium"
                  placeholder="Escribe tu municipio de nacimiento"
                  value={formData.lugarNacimiento}
                  onChange={e => set('lugarNacimiento', e.target.value)}
                  style={inputStyle('lugarNacimiento')}
                />
                <datalist id="all-cities-list">
                  {allCities.slice(0, 500).map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* Lugar de Expedición */}
              <div className="form-field-premium">
                <label style={labelStyle}>Lugar de Expedición del ID</label>
                <input
                  list="all-cities-list"
                  className="input-premium"
                  placeholder="Lugar donde expediste tu cédula"
                  value={formData.lugarExpedicion}
                  onChange={e => set('lugarExpedicion', e.target.value)}
                  style={inputStyle('lugarExpedicion')}
                />
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>EPS Actual</label>
                <input
                  type="text"
                  className="input-premium"
                  placeholder="Ej: Sura, Sanitas, Coomeva..."
                  value={formData.eps}
                  onChange={e => set('eps', e.target.value)}
                  style={inputStyle('eps')}
                  list="eps-list"
                />
                <datalist id="eps-list">
                  {healthData.eps.map(e => <option key={e} value={e} />)}
                </datalist>
              </div>

              {/* Caja de Compensación */}
              <div className="form-field-premium">
                <label style={labelStyle}>Caja de Compensación</label>
                <input
                  type="text"
                  className="input-premium"
                  placeholder="Ej: Cafam, Colsubsidio..."
                  value={formData.cajaCompensacion}
                  onChange={e => set('cajaCompensacion', e.target.value)}
                  style={inputStyle('cajaCompensacion')}
                  list="cajas-list"
                />
                <datalist id="cajas-list">
                  {healthData.cajas.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* Víctima del conflicto */}
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>¿Es víctima del conflicto armado?</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {['Si', 'No'].map(opt => (
                    <PillSelect
                      key={opt}
                      name="isVictim"
                      value={opt}
                      label={opt === 'Si' ? 'Sí, soy víctima' : 'No reporto'}
                      selected={formData.isVictim === opt}
                      onChange={v => set('isVictim', v)}
                    />
                  ))}
                </div>
              </div>

              {/* Grupo SISBEN */}
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Grupo SISBEN *</label>
                <select
                  className="input-premium"
                  value={formData.grupoSisben}
                  onChange={e => set('grupoSisben', e.target.value)}
                  style={{ ...inputStyle('grupoSisben'), cursor: 'pointer', appearance: 'none' }}
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
                    <PillSelect
                      key={g}
                      name="genero"
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
                <label style={labelStyle}>Departamento de Residencia</label>
                <select 
                  className="input-premium" 
                  value={formData.deptoResidencia} 
                  onChange={e => {
                    set('deptoResidencia', e.target.value);
                    set('ciudadResidencia', ''); // reset city on dept change
                  }}
                  style={inputStyle('deptoResidencia')}
                >
                  <option value="">{geoLoading ? 'Cargando departamentos...' : '-- Seleccionar --'}</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Ciudad / Municipio</label>
                <select 
                  className="input-premium" 
                  value={formData.ciudadResidencia} 
                  onChange={e => set('ciudadResidencia', e.target.value)}
                  disabled={!formData.deptoResidencia}
                  style={inputStyle('ciudadResidencia')}
                >
                  <option value="">-- Seleccionar --</option>
                  {getCitiesByDept(formData.deptoResidencia).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Dirección de Residencia Actual</label>
                <input type="text" className="input-premium" placeholder="Ej: Calle 45 # 23-12" value={formData.address} onChange={e => set('address', e.target.value)} />
              </div>

              <div className="form-field-premium">
                <label style={labelStyle}>Barrio</label>
                <input 
                  type="text" 
                  className="input-premium" 
                  placeholder="Ej: Los Laureles" 
                  value={formData.barrio} 
                  onChange={e => set('barrio', e.target.value)}
                  style={inputStyle('barrio')}
                  list="barrios-list"
                />
                <datalist id="barrios-list">
                  {(geoData[formData.ciudadResidencia] && formData.localidad) 
                    ? geoData[formData.ciudadResidencia].localidades.find(l => l.nombre === formData.localidad)?.barrios.map(b => <option key={b} value={b} />)
                    : (geoData[formData.ciudadResidencia]
                        ? geoData[formData.ciudadResidencia].localidades.flatMap(l => l.barrios).slice(0, 200).map(b => <option key={b} value={b} />)
                        : null
                      )
                  }
                </datalist>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>
                  {geoData[formData.ciudadResidencia] 
                    ? `✨ Sugerencias oficiales para ${formData.ciudadResidencia} disponibles.`
                    : `💡 Escribe tu barrio (entrada libre para ${formData.ciudadResidencia || 'tu ciudad'}).`
                  }
                </div>
              </div>

              {geoData[formData.ciudadResidencia] && (
                <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>{geoData[formData.ciudadResidencia].tipo} ({formData.ciudadResidencia})</label>
                  <select 
                    className="input-premium" 
                    value={formData.localidad} 
                    onChange={e => set('localidad', e.target.value)}
                    style={inputStyle('localidad')}
                  >
                    <option value="">-- Seleccionar {geoData[formData.ciudadResidencia].tipo} --</option>
                    {geoData[formData.ciudadResidencia]?.localidades.map(l => (
                      <option key={l.nombre} value={l.nombre}>{l.nombre}</option>
                    ))}
                  </select>
                </div>
              )}

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

              <div className="form-field-premium">
                <label className="label-premium">¿Posee Computador propio?</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {['Si', 'No'].map(opt => (
                    <PillSelect
                      key={opt}
                      name="hasComputer"
                      value={opt}
                      selected={formData.hasComputer === opt}
                      onChange={v => set('hasComputer', v)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-field-premium">
                <label className="label-premium">¿Cuenta con servicio de Internet?</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {['Si', 'No'].map(opt => (
                    <PillSelect
                      key={opt}
                      name="hasInternet"
                      value={opt}
                      selected={formData.hasInternet === opt}
                      onChange={v => set('hasInternet', v)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-field-premium">
                <label className="label-premium">Medio de Transporte Principal</label>
                <select className="input-premium" value={formData.transportMode} onChange={e => set('transportMode', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {['Bus / Transporte Público', 'Moto', 'Bicicleta', 'Carro Propio', 'Caminando', 'Otro'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
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

      case 5:
        return (
          <div className="section-reveal">
            <SalmiHint text="Paso final: Adjunta tu respaldo académico para validar tu perfil estudiantil." />
            <div className="form-grid-premium">
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label className="label-premium">Último Título o Grado Obtenido *</label>
                <select className="input-premium" value={formData.lastDegree} onChange={e => set('lastDegree', e.target.value)}>
                  <option value="">Seleccione...</option>
                  <option value="Bachiller">Bachiller</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Tecnólogo">Tecnólogo</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Posgrado">Especialización / Maestría</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div className="form-field-premium">
                <label className="label-premium">Institución Educativa</label>
                <input 
                  type="text" 
                  className="input-premium" 
                  placeholder="Ej: Universidad Nacional" 
                  value={formData.lastInstitution} 
                  onChange={e => set('lastInstitution', e.target.value)} 
                  list="inst-list"
                />
                <datalist id="inst-list">
                  <optgroup label="Universidades Sugeridas">
                    {institutions.map(i => <option key={`uni-${i}`} value={i} />)}
                  </optgroup>
                  <optgroup label={`Colegios en ${formData.ciudadResidencia}`}>
                    {daneSchools.map(s => <option key={`sch-${s}`} value={s} />)}
                  </optgroup>
                </datalist>
                {loadingSchools && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Loader2 size={10} className="animate-spin" /> Buscando colegios oficiales en {formData.ciudadResidencia}...
                  </div>
                )}
              </div>

              <div className="form-field-premium">
                <label className="label-premium">Año de Graduación</label>
                <input type="number" className="input-premium" placeholder="Ej: 2024" value={formData.graduationYear} onChange={e => set('graduationYear', e.target.value)} />
              </div>

              {/* Módulo de Carga Visual */}
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label className="label-premium">Soporte Digital (Diploma / Acta de Grado)</label>
                <div style={{ 
                  border: '2px dashed #e2e8f0', 
                  borderRadius: '16px', 
                  padding: '40px 20px', 
                  textAlign: 'center',
                  background: 'rgba(248, 250, 252, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ background: '#f1f5f9', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                    <Shield size={24} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    Haz clic para subir o arrastra tu diploma
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                    PDF, JPG o PNG (Max. 5MB)
                  </div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>
                  <Info size={14} /> Tu documento será procesado bajo la Ley 1581 (Habeas Data) solo para fines de registro institucional.
                </div>
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
      <div className="section-reveal" style={{ maxWidth: '1250px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>¡Todo listo, {user?.name?.split(' ')[0]}!</h2>
          <p style={{ color: '#64748b', marginTop: '10px' }}>Revisa que toda tu información sea correcta antes de activar tu carnet.</p>
        </div>

        <SummarySection icon={<User size={18} />} title="IDENTIFICACIÓN Y CONTACTO" stepTarget={1} fields={[
           {label: 'No. Identificación', value: formData.identificacion },
          { label: 'Nombre Completo', value: formData.nombreCompleto },
          { label: 'Correo', value: formData.correo },
          { label: 'Género', value: formData.genero },
          { label: 'Nacimiento', value: `${formData.birthDate} - ${formData.lugarNacimiento}` },
          { label: 'Expedición ID', value: formData.lugarExpedicion },
          { label: 'EPS / Caja', value: `${formData.eps} / ${formData.cajaCompensacion}` },
          { label: 'SISBEN / Víctima', value: `${formData.grupoSisben} / ${formData.isVictim}` },
          { label: 'Ubicación', value: `${formData.deptoResidencia}, ${formData.ciudadResidencia}` },
          { label: 'Dirección', value: `${formData.address} (${formData.barrio})` },
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
           {label: 'Estrato', value: formData.estrato },
          { label: 'Ingresos', value: formData.incomeSource },
          { label: 'Labora', value: formData.isWorking },
          { label: 'Empresa', value: formData.workCompany },
          { label: 'Cargo', value: formData.workRole },
          { label: 'Conectividad', value: `PC: ${formData.hasComputer} | Internet: ${formData.hasInternet}` },
          { label: 'Transporte', value: formData.transportMode },
        ]} />

        <SummarySection icon={<GraduationCap size={18} />} title="ACADEMIA E INTERESES" stepTarget={4} fields={[
          { label: 'Procedencia', value: formData.previousSchool },
          { label: 'Habilidades', value: formData.digitalSkills },
        ]} />

        <SummarySection icon={<Shield size={18} />} title="EXPEDIENTE ACADÉMICO" stepTarget={5} fields={[
          { label: 'Grado', value: formData.lastDegree },
          { label: 'Institución', value: formData.lastInstitution },
          { label: 'Año', value: formData.graduationYear },
          { label: 'Diploma', value: formData.diplomaUrl ? 'Cargado ✅' : 'Pendiente 📄' },
        ]} />

         <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SalmiHint text="¡Excelente trabajo! Si crees que todo está en orden, acepta la política de datos para finalizar el proceso y activar tu carnet." />
          
          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(22,182,214,0.2)', borderRadius: '15px', background: 'white' }}>
            <label style={{ display: 'flex', gap: '15px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.policiesAccepted} 
                onChange={e => set('policiesAccepted', e.target.checked)}
                style={{ width: '22px', height: '22px', marginTop: '3px', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5', fontWeight: 600 }}>
                He leído y acepto la <strong style={{ color: 'var(--secondary)' }}>Política de Tratamiento de Datos Personales</strong> (Habeas Data) 
                de la Universidad UniSalamanca. Entiendo que mi fotografía y datos serán tratados 
                con fines académicos, de seguridad e identificación institucional. 
                <Link to="/data-policy" target="_blank" style={{ color: 'var(--secondary)', marginLeft: '6px', textDecoration: 'underline' }}>Ver política completa</Link>
              </div>
            </label>
          </div>
        </div>

        <button 
          onClick={handleFinalize} 
          className="btn-primary-premium" 
          disabled={isSaving || !formData.policiesAccepted}
          style={{ 
            width: '100%', 
            padding: '20px', 
            background: formData.policiesAccepted ? 'var(--primary)' : '#cbd5e1', 
            marginTop: '20px', 
            boxShadow: formData.policiesAccepted ? '0 20px 40px rgba(42,34,102,0.2)' : 'none',
            cursor: formData.policiesAccepted ? 'pointer' : 'not-allowed'
          }}
        >
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
      maxWidth: '1250px', 
      margin: '0 auto', 
      boxShadow: '0 40px 100px rgba(0,0,0,0.1)'
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
        <button onClick={prevStep} className="btn-secondary-premium nav-btn-mobile" disabled={step === 1 || isSaving}
          style={{ 
            opacity: (step === 1 || isSaving) ? 0.3 : 1, 
            padding: '14px 28px'
          }}>
          <ArrowLeft size={18} /> Anterior
        </button>

        {step < 5 ? (
          <button onClick={handleNext} className="btn-primary-premium nav-btn-mobile" disabled={isSaving}
            style={{ 
              padding: '14px 28px', 
              background: 'var(--primary)'
            }}>
            Continuar <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={() => setShowSuccess(true)} className="btn-primary-premium nav-btn-mobile"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary), #0e94ad)', 
              padding: '14px 32px'
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
