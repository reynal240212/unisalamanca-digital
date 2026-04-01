import React, { useState } from 'react';
import { 
  User, Users, Home, GraduationCap, ArrowRight, ArrowLeft, 
  CheckCircle2, Info, Heart, Shield, Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';

const SalmiHint = ({ text }) => (
  <div className="salmi-hint-container section-reveal" style={{ 
    display: 'flex', gap: '15px', alignItems: 'center', 
    background: 'rgba(22, 182, 214, 0.05)', padding: '20px', 
    borderLeft: '4px solid var(--secondary)', borderRadius: '16px',
    marginBottom: '30px', animation: 'slideRight 0.5s ease-out'
  }}>
    <div className="salmi-avatar-mini" style={{ width: '50px', height: '50px', flexShrink: 0, background: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <img src="/images/salmi-premium-v2.png" alt="Salmi" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
    <div className="salmi-hint-text" style={{ fontSize: '0.9rem', color: '#1e3a8a', fontWeight: 600, lineHeight: '1.4' }}>{text}</div>
  </div>
);

const CharacterizationForm = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personales
    birthDate: '', address: '', phone: '', bloodType: '', healthNotes: '',
    // Familiares
    livesWith: '', emergencyContact: '', emergencyPhone: '', parentEducation: '',
    // Socioeconómicos
    estrato: '', incomeSource: '', isWorking: 'No',
    // Académicos
    previousSchool: '', digitalSkills: '', interests: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { id: 1, label: 'Identidad', icon: <User size={18} /> },
    { id: 2, label: 'Entorno', icon: <Users size={18} /> },
    { id: 3, label: 'Bienestar', icon: <Home size={18} /> },
    { id: 4, label: 'Academia', icon: <GraduationCap size={18} /> }
  ];

  const handleFinalize = async () => {
    if (!user?.id) {
        alert('No se pudo identificar al usuario. Por favor, reintenta el login.');
        return;
    }
    
    setIsSaving(true);
    try {
        const dbData = {
          user_id: user.id,
          birth_date: formData.birthDate,
          blood_type: formData.bloodType,
          address: formData.address,
          phone: formData.phone,
          health_notes: formData.healthNotes,
          lives_with: formData.livesWith,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          parent_education: formData.parentEducation,
          estrato: parseInt(formData.estrato) || null,
          income_source: formData.incomeSource,
          is_working: formData.isWorking,
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

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-fade-in">
            <SalmiHint text="¡Hola! Empecemos con lo básico. Necesitamos conocerte un poco mejor para personalizar tu experiencia institucional." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label className="label-premium">Fecha de Nacimiento</label>
                <input type="date" className="input-premium" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Grupo Sanguíneo (RH)</label>
                <select className="input-premium" value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(rh => <option key={rh} value={rh}>{rh}</option>)}
                </select>
              </div>
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label className="label-premium">Dirección de Residencia Actual</label>
                <input type="text" className="input-premium" placeholder="Ej: Calle 45 # 23-12, Barrio" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Teléfono Celular Personal</label>
                <input type="tel" className="input-premium" placeholder="300 000 0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Condiciones Médicas / Alergias</label>
                <input type="text" className="input-premium" placeholder="Ninguna" value={formData.healthNotes} onChange={e => setFormData({...formData, healthNotes: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-fade-in">
            <SalmiHint text="La familia es lo primero. Cuéntanos quién te acompaña en este camino académico." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label className="label-premium">¿Con quién vives actualmente?</label>
                <select className="input-premium" value={formData.livesWith} onChange={e => setFormData({...formData, livesWith: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  <option value="Padres">Padres</option>
                  <option value="Solo">Solo</option>
                  <option value="Otros familiares">Otros familiares</option>
                  <option value="Residencia">Residencia Universitaria</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Nivel Educativo de tus Padres</label>
                <select className="input-premium" value={formData.parentEducation} onChange={e => setFormData({...formData, parentEducation: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Técnico">Técnico/Tecnólogo</option>
                  <option value="Universitario">Universitario</option>
                  <option value="Postgrado">Postgrado</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Contacto de Emergencia</label>
                <input type="text" className="input-premium" placeholder="Nombre completo" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Teléfono del Contacto</label>
                <input type="tel" className="input-premium" placeholder="Celular de contacto" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-fade-in">
            <SalmiHint text="Estos datos nos ayudan a gestionar apoyos y beneficios para ti. Todo se maneja de forma confidencial." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label className="label-premium">Estrato Socioeconómico</label>
                <select className="input-premium" value={formData.estrato} onChange={e => setFormData({...formData, estrato: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Fuente Secundaria de Ingresos</label>
                <select className="input-premium" value={formData.incomeSource} onChange={e => setFormData({...formData, incomeSource: e.target.value})}>
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
                      <input 
                        type="radio" 
                        name="working"
                        className="radio-premium"
                        checked={formData.isWorking === opt} 
                        onChange={() => setFormData({...formData, isWorking: opt})} 
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>{opt === 'Si' ? 'Sí, trabajo' : 'No en el momento'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-fade-in">
            <SalmiHint text="¡Casi terminamos! Cuéntanos de dónde vienes y qué te apasiona." />
            <div className="form-grid-premium" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-field-premium">
                <label className="label-premium">Institución Educativa de Procedencia</label>
                <input type="text" className="input-premium" placeholder="Nombre completo del colegio" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Habilidades Digitales (Software, herramientas...)</label>
                <input type="text" className="input-premium" placeholder="Ej: Office, Adobe, Programación, etc." value={formData.digitalSkills} onChange={e => setFormData({...formData, digitalSkills: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label className="label-premium">Intereses Artísticos, Deportivos o Culturales</label>
                <textarea className="input-premium" rows="3" placeholder="¿Cómo te gusta aprovechar tu tiempo libre?" value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} style={{ resize: 'none' }}></textarea>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="glass-card section-reveal" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '60px 40px' }}>
        <div className="success-lottie-container" style={{ width: '120px', height: '120px', margin: '0 auto 30px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={64} color="var(--success)" className="animate-bounce" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '15px' }}>¡Caracterización Exitosa!</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Gracias {user?.name?.split(' ')[0]}, tus datos han sido sincronizados. Ahora tienes acceso total a tu Identidad Digital.
        </p>
        <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <SalmiHint text="¡Felicidades! Has completado tu proceso de caracterización. ¡Bienvenido a la comunidad UniSalamanca!" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
      {/* STEPPER PREMIUM */}
      <div className="characterization-stepper" style={{ marginBottom: '50px' }}>
        {steps.map(s => (
          <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="step-bubble" style={{ 
                transform: step === s.id ? 'scale(1.1)' : 'scale(1)',
                boxShadow: step === s.id ? '0 0 20px rgba(22, 182, 214, 0.3)' : 'none'
            }}>
              {step > s.id ? <CheckCircle2 size={24} className="text-secondary" /> : s.icon}
            </div>
            <span className="step-label" style={{ 
                fontWeight: step === s.id ? 900 : 600,
                color: step === s.id ? 'var(--primary)' : '#94a3b8',
                fontSize: '0.75rem',
                marginTop: '12px'
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ minHeight: '380px' }}>
        {renderStepContent()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '30px', borderTop: '1px dotted #e2e8f0' }}>
        <button 
          onClick={prevStep} 
          className="btn-secondary-premium" 
          disabled={step === 1 || isSaving}
          style={{ opacity: (step === 1 || isSaving) ? 0.3 : 1, padding: '14px 28px' }}
        >
          <ArrowLeft size={18} /> Anterior Paso
        </button>
        
        {step < 4 ? (
          <button 
            onClick={nextStep} 
            className="btn-primary-premium" 
            disabled={isSaving}
            style={{ padding: '14px 28px', background: 'var(--primary)' }}
          >
            Continuar <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={handleFinalize} 
            className="btn-primary-premium" 
            style={{ 
                background: 'linear-gradient(135deg, var(--secondary), #0e94ad)',
                padding: '14px 32px'
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <><Loader2 size={18} className="animate-spin" /> Sincronizando...</>
            ) : (
              <>Guardar y Finalizar <CheckCircle2 size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterizationForm;
