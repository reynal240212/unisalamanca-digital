import React, { useState } from 'react';
import { 
  User, Users, Home, GraduationCap, ArrowRight, ArrowLeft, 
  CheckCircle2, Info, Heart, Shield, Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';

const SalmiHint = ({ text }) => (
  <div className="salmi-hint-container">
    <div className="salmi-avatar-mini">
      <img src="/images/salmi_mascot.png" alt="Salmi" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
    </div>
    <div className="salmi-hint-text">{text}</div>
  </div>
);

const CharacterizationForm = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
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
    { id: 1, label: 'Personal', icon: <User size={18} /> },
    { id: 2, label: 'Familiar', icon: <Users size={18} /> },
    { id: 3, label: 'Socioeconómico', icon: <Home size={18} /> },
    { id: 4, label: 'Académico', icon: <GraduationCap size={18} /> }
  ];

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="section-reveal">
            <SalmiHint text="¡Hola! Empecemos con lo básico. Necesitamos conocerte un poco mejor para personalizar tu experiencia institucional." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label>Fecha de Nacimiento</label>
                <input type="date" className="input-premium" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Grupo Sanguíneo (RH)</label>
                <select className="input-premium" value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(rh => <option key={rh} value={rh}>{rh}</option>)}
                </select>
              </div>
              <div className="form-field-premium" style={{ gridColumn: 'span 2' }}>
                <label>Dirección de Residencia</label>
                <input type="text" className="input-premium" placeholder="Ej: Calle 45 # 23-12" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Teléfono Celular</label>
                <input type="tel" className="input-premium" placeholder="300 000 0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Observaciones de Salud</label>
                <input type="text" className="input-premium" placeholder="Alergias, condiciones..." value={formData.healthNotes} onChange={e => setFormData({...formData, healthNotes: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="section-reveal">
            <SalmiHint text="La familia es lo primero. Cuéntanos quién te acompaña en este camino académico." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label>¿Con quién vives?</label>
                <select className="input-premium" value={formData.livesWith} onChange={e => setFormData({...formData, livesWith: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  <option value="Padres">Padres</option>
                  <option value="Solo">Solo</option>
                  <option value="Otros familiares">Otros familiares</option>
                  <option value="Residencia">Residencia Universitaria</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label>Nivel Educativo de Padres</label>
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
                <label>Contacto de Emergencia</label>
                <input type="text" className="input-premium" placeholder="Nombre completo" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Teléfono de Emergencia</label>
                <input type="tel" className="input-premium" placeholder="Fijo o celular" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="section-reveal">
            <SalmiHint text="Estos datos nos ayudan a gestionar apoyos y beneficios para ti. Todo se maneja de forma confidencial." />
            <div className="form-grid-premium">
              <div className="form-field-premium">
                <label>Estrato Socioeconómico</label>
                <select className="input-premium" value={formData.estrato} onChange={e => setFormData({...formData, estrato: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-field-premium">
                <label>Principal Fuente de Ingresos</label>
                <select className="input-premium" value={formData.incomeSource} onChange={e => setFormData({...formData, incomeSource: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  <option value="Padres">Apoyo de Padres</option>
                  <option value="TrabajoPropio">Trabajo Propio</option>
                  <option value="Becas">Becas/Estímulos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="form-field-premium">
                <label>¿Trabajas actualmente?</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                  {['Si', 'No'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" checked={formData.isWorking === opt} onChange={() => setFormData({...formData, isWorking: opt})} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="section-reveal">
            <SalmiHint text="¡Casi terminamos! Cuéntanos de dónde vienes y qué te apasiona." />
            <div className="form-grid-premium" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-field-premium">
                <label>Colegio de Procedencia</label>
                <input type="text" className="input-premium" placeholder="Nombre de la institución" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Habilidades Digitales</label>
                <input type="text" className="input-premium" placeholder="Ej: Excel, Python, Diseño, etc." value={formData.digitalSkills} onChange={e => setFormData({...formData, digitalSkills: e.target.value})} />
              </div>
              <div className="form-field-premium">
                <label>Intereses y Pasatiempos</label>
                <textarea className="input-premium" rows="3" placeholder="¿Qué te gusta hacer en tu tiempo libre?" value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} style={{ resize: 'none' }}></textarea>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* STEPPER */}
      <div className="characterization-stepper">
        {steps.map(s => (
          <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="step-bubble">
              {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ minHeight: '340px' }}>
        {renderStepContent()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
        <button 
          onClick={prevStep} 
          className="btn-secondary-premium" 
          disabled={step === 1 || isSaving}
          style={{ opacity: (step === 1 || isSaving) ? 0.3 : 1 }}
        >
          <ArrowLeft size={18} /> Anterior
        </button>
        
        {step < 4 ? (
          <button onClick={nextStep} className="btn-primary-premium" disabled={isSaving}>
            Siguiente Paso <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={async () => {
              if (!user?.id) {
                alert('No se pudo identificar al usuario. Por favor, reintenta el login.');
                return;
              }
              
              setIsSaving(true);
              try {
                // Map camelCase to snake_case for DB
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
                
                onComplete();
              } catch (err) {
                console.error('Error saving characterization:', err);
                alert('Error al guardar: ' + err.message);
              } finally {
                setIsSaving(false);
              }
            }} 
            className="btn-primary-premium" 
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            disabled={isSaving}
          >
            {isSaving ? (
              <><Loader2 size={18} className="animate-spin" /> Guardando...</>
            ) : (
              <>Finalizar Caracterización <CheckCircle2 size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterizationForm;
