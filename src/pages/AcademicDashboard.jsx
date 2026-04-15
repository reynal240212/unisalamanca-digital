import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CurriculumView from '../components/CurriculumView';
import {
  Users, Calendar, BarChart2, LogOut, Search,
  Plus, Trash2, X, Save, Clock, MapPin, BookOpen, Menu, ArrowLeft, GraduationCap, Briefcase
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

/* ─── COMPONENTE SALMI IA ALERTS ────────────────────────────────── */
const SalmiExamAlerts = ({ schedules, periodConfig }) => {
  // Simulación de detección de parciales basada en el cronograma estándar (Semanas 6, 12, 18)
  // En una fase posterior esto usará la tabla academic_config
  const examWeeks = periodConfig?.exam_weeks || [6, 12, 18];
  
  return (
    <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '20px', padding: '20px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.3 }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart2 size={18} color="var(--primary)" />
        </div>
        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>SALMI IA: INSIGHTS ACADÉMICOS</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Próximo Parcial</p>
          <p style={{ margin: '4px 0 0', fontWeight: 900, fontSize: '1.1rem' }}>Semana {examWeeks[0]}</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b' }}>Preparando alertas de estudio...</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Carga Académica</p>
          <p style={{ margin: '4px 0 0', fontWeight: 900, fontSize: '1.1rem' }}>{schedules.length} Materias</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b' }}>{schedules.reduce((acc, s) => acc + (s.credits || 0), 0)} créditos activos</p>
        </div>
      </div>
    </div>
  );
};

/* ─── MODAL HORARIO ────────────────────────────────────────────── */
const ScheduleModal = ({ student, onClose, onSaved, existingSchedules = [] }) => {
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [curriculum, setCurriculum] = useState([]);
  const [activePeriod, setActivePeriod] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [student]);

  const fetchInitialData = async () => {
    setLoadingInitial(true);
    try {
      // 1. Obtener periodo activo
      const { data: period } = await supabase
        .from('academic_periods')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      setActivePeriod(period);

      // 2. Obtener pénsum del programa del estudiante
      const { data: subs } = await supabase
        .from('subjects')
        .select('*')
        .eq('program_id', student.program_id)
        .order('semester');
      
      setCurriculum(subs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleSubjectChange = async (subjectId) => {
    const sub = curriculum.find(s => s.id === subjectId);
    setSelectedSubject(sub);
    setSelectedSection(null);
    setAvailableSections([]);
    setError(null);

    if (sub && activePeriod) {
      const { data: sections } = await supabase
        .from('academic_sections')
        .select(`
          *,
          teacher:user(id, name),
          blocks:schedule_blocks(*)
        `)
        .eq('subject_id', sub.id)
        .eq('period_id', activePeriod.id);
      
      setAvailableSections(sections || []);
    }
  };

  const checkConflict = (section) => {
    if (!section || !section.blocks) return false;
    
    for (const newBlock of section.blocks) {
      for (const enrolled of existingSchedules) {
        for (const existingBlock of enrolled.schedule_blocks) {
          if (newBlock.day_of_week === existingBlock.day_of_week) {
            const start1 = newBlock.start_time;
            const end1 = newBlock.end_time;
            const start2 = existingBlock.start_time;
            const end2 = existingBlock.end_time;

            if (start1 < end2 && end1 > start2) {
              return `Conflicto el ${newBlock.day_of_week} con la materia "${enrolled.subject}"`;
            }
          }
        }
      }
    }
    return null;
  };

  const handleSectionSelect = (sectionId) => {
    const sec = availableSections.find(s => s.id === sectionId);
    const conflict = checkConflict(sec);
    if (conflict) {
      setError(conflict);
    } else {
      setError(null);
    }
    setSelectedSection(sec);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;
    setSaving(true);
    try {
      const { error: enrollErr } = await supabase
        .from('academic_enrollments')
        .insert({ 
          student_id: student.id, 
          section_id: selectedSection.id,
          status: 'ACTIVE'
        });

      if (enrollErr) throw enrollErr;
      
      onSaved();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Agrupar materias por categoría inteligente
  const suggested = curriculum.filter(s => s.semester === student.semester);
  const advance = curriculum.filter(s => s.semester > student.semester);
  const pending = curriculum.filter(s => s.semester < student.semester);

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', margin: 0 }}>Asignación Inteligente</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Estudiante: <strong>{student.name}</strong> · Semestre {student.semester}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        {loadingInitial ? <p style={{ textAlign: 'center', padding: '40px' }}>Cargando pénsum...</p> : (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                1. Seleccionar Materia del Pénsum
              </label>
              <select 
                className="input-premium" 
                style={{ width: '100%' }}
                onChange={e => handleSubjectChange(e.target.value)}
                value={selectedSubject?.id || ''}
                required
              >
                <option value="">-- Buscar materia --</option>
                <optgroup label="✨ Semestre Sugerido">
                  {suggested.map(s => <option key={s.id} value={s.id}>{s.name} ({s.credits} cred)</option>)}
                </optgroup>
                <optgroup label="⚠️ Materias Pendientes">
                  {pending.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </optgroup>
                <optgroup label="🚀 Adelanto de Materias">
                  {advance.map(s => <option key={s.id} value={s.id}>{s.name} (Semestre {s.semester})</option>)}
                </optgroup>
              </select>
            </div>

            {selectedSubject && (
              <div className="section-reveal" style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                  2. Seleccionar Sección y Horario
                </label>
                
                {availableSections.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, margin: 0 }}>
                    No hay secciones abiertas para esta materia en el periodo actual.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {availableSections.map(sec => (
                      <button 
                        key={sec.id}
                        type="button"
                        onClick={() => handleSectionSelect(sec.id)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '12px', textAlign: 'left',
                          background: selectedSection?.id === sec.id ? 'white' : 'transparent',
                          border: selectedSection?.id === sec.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>DOCENTE: {sec.teacher?.name || 'Por asignar'}</span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {sec.id.slice(0,8)}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                          {(sec.blocks || []).map((b, idx) => (
                            <span key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>
                              {b.day_of_week} ({b.start_time?.slice(0,5)} - {b.end_time?.slice(0,5)})
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={16} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
              <button 
                type="submit" 
                className="btn-primary-premium" 
                style={{ flex: 2 }} 
                disabled={saving || !selectedSection || !!error}
              >
                <Save size={16} /> {saving ? 'Matriculando...' : 'Confirmar Matrícula'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ─── MODAL ASIGNACIÓN DOCENTE ─────────────────────────────────── */
const TeacherAssignmentModal = ({ teacher, programs, onClose, onSaved }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activePeriod, setActivePeriod] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [programs]);

  const fetchInitialData = async () => {
    // 1. Obtener periodo activo
    const { data: period } = await supabase
      .from('academic_periods')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();
    setActivePeriod(period);

    // 2. Obtener materias de los programas
    const { data } = await supabase
      .from('subjects')
      .select('*, program:academic_programs(name)')
      .in('program_id', programs.map(p => p.id))
      .order('name');
    
    setSubjects(data || []);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !activePeriod) return;
    setSaving(true);
    try {
      // 3NF: Crear la sección para el profesor y materia
      const { error } = await supabase
        .from('academic_sections')
        .insert({ 
          teacher_id: teacher.id, 
          subject_id: selectedSubject,
          period_id: activePeriod.id
        });

      if (error) throw error;
      onSaved();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', margin: 0 }}>Asignar Carga Docente</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Profesor: {teacher.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Seleccionar Materia (Mis Programas)
            </label>
            <select 
              className="input-premium" 
              style={{ width: '100%' }} 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">-- Materias disponibles --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - Semestre {s.semester} ({s.program?.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} /> Periodo Académico: <strong>{activePeriod?.name || 'Cargando...'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary-premium" style={{ flex: 2 }} disabled={saving || !activePeriod}>
              <Save size={16} /> {saving ? 'Asignando...' : 'Confirmar Carga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── SECCIÓN HORARIOS ─────────────────────────────────────────── */
const HorariosSection = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.program || '').toLowerCase().includes(search.toLowerCase())
  );

  const loadSchedules = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    // 3NF Join query
    const { data, error } = await supabase
      .from('academic_enrollments')
      .select(`
        id,
        academic_sections (
          id,
          subjects (name, credits),
          user (name),
          academic_periods (name),
          schedule_blocks (*)
        )
      `)
      .eq('student_id', student.id);
    
    if (error) {
      console.error('Error cargando horario:', error);
      setSchedules([]);
    } else {
      const formatted = (data || []).map(e => {
        const sec = Array.isArray(e.academic_sections) ? e.academic_sections[0] : e.academic_sections;
        if (!sec) return null;
        
        const subjectData = Array.isArray(sec.subjects) ? sec.subjects[0] : sec.subjects;
        const teacherData = Array.isArray(sec.user) ? sec.user[0] : sec.user;
        const periodData = Array.isArray(sec.academic_periods) ? sec.academic_periods[0] : sec.academic_periods;

        return {
          id: e.id,
          subject: subjectData?.name || 'Materia desconocida',
          credits: subjectData?.credits || 0,
          period: periodData?.name || 'N/A',
          teacher: teacherData?.name || 'Sin asignar',
          schedule_blocks: sec.schedule_blocks || []
        };
      }).filter(Boolean);

      setSchedules(formatted);
    }
    setLoading(false);
  };

  const deleteSchedule = async (scheduleId) => {
    if (!confirm('¿Eliminar esta materia del horario?')) return;
    const { error } = await supabase.from('academic_enrollments').delete().eq('id', scheduleId);
    if (error) alert('Error al eliminar: ' + error.message);
    loadSchedules(selectedStudent);
  };

  return (
    <div className="section-reveal">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Gestión de Horarios</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Asigna y administra los horarios de los estudiantes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* LISTA DE ESTUDIANTES */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}
                placeholder="Buscar estudiante..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Sin estudiantes</p>
            ) : filtered.map(s => (
              <button key={s.id} onClick={() => loadSchedules(s)}
                style={{
                  width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                  background: selectedStudent?.id === s.id ? 'var(--primary)' : 'transparent',
                  color: selectedStudent?.id === s.id ? 'white' : '#1e293b',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid #f8fafc', transition: 'all 0.15s'
                }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: selectedStudent?.id === s.id ? 'rgba(255,255,255,0.2)' : `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 93%)`,
                  color: selectedStudent?.id === s.id ? 'white' : `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem'
                }}>
                  {(s.name || '?').charAt(0)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {typeof s.program === 'object' ? s.program?.name : (s.program || 'Sin programa')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DE HORARIO DEL ESTUDIANTE */}
        <div>
          {!selectedStudent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: 'white', borderRadius: '20px', border: '2px dashed #e2e8f0', gap: '12px' }}>
              <Calendar size={40} color="#cbd5e1" />
              <p style={{ color: '#94a3b8', fontWeight: 600 }}>Selecciona un estudiante para ver o editar su horario</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SalmiExamAlerts schedules={schedules} />
              
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{selectedStudent.name}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {typeof selectedStudent.program === 'object' ? selectedStudent.program?.name : selectedStudent.program} · {selectedStudent.semester}
                  </p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary-premium">
                  <Plus size={16} /> Agregar Materia
                </button>
              </div>

              <div style={{ padding: '20px' }}>
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Cargando...</p>
                ) : schedules.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                    <BookOpen size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: 600, margin: 0 }}>Sin materias asignadas</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Usa el botón "Agregar Materia" para comenzar</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {schedules.map(s => (
                      <div key={s.id} style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <h4 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{s.subject}</h4>
                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                              Docente: {s.teacher || 'Sin asignar'} · {s.credits} créditos · Período {s.period}
                            </p>
                          </div>
                          <button onClick={() => deleteSchedule(s.id)}
                            style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(s.schedule_blocks || []).map((b, i) => (
                            <span key={i} style={{
                              background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                              padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#475569',
                              display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                              <Clock size={11} color="var(--primary)" />
                              {b.day_of_week} {b.start_time?.slice(0,5)}–{b.end_time?.slice(0,5)}
                              {b.classroom && <><MapPin size={11} color="#94a3b8" /> {b.classroom}</>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {showModal && selectedStudent && (
        <ScheduleModal
          student={selectedStudent}
          existingSchedules={schedules}
          onClose={() => setShowModal(false)}
          onSaved={() => loadSchedules(selectedStudent)}
        />
      )}
    </div>
  );
};

/* ─── SECCIÓN DOCENTES ─────────────────────────────────────────── */
const DocentesSection = ({ teachers, directorPrograms }) => {
  const [assignments, setAssignments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [teachers]);

  const fetchAssignments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('academic_sections')
      .select(`
        *,
        subject:subjects(name)
      `);
    const mapping = {};
    data?.forEach(asg => {
      if (!mapping[asg.teacher_id]) mapping[asg.teacher_id] = [];
      mapping[asg.teacher_id].push({
        id: asg.id,
        subject: asg.subject.name
      });
    });
    setAssignments(mapping);
    setLoading(false);
  };

  const removeAssignment = async (id) => {
    if (!confirm('¿Quitar esta asignación?')) return;
    await supabase.from('academic_sections').delete().eq('id', id);
    fetchAssignments();
  };

  return (
    <div className="section-reveal">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Planta Docente</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Gestión de carga académica institucional</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table className="premium-table">
          <thead>
            <tr>
              {['PROFESOR', 'CARGA ACADÉMICA', 'ACCIONES'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id}>
                <td style={{ width: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 900 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{t.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(assignments[t.id] || []).length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Sin asignación</span>
                    ) : (
                      assignments[t.id].map(asg => (
                        <span key={asg.id} style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookOpen size={12} /> {asg.subject}
                          <button onClick={() => removeAssignment(asg.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                            <X size={10} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td style={{ width: '150px' }}>
                  <button 
                    onClick={() => { setSelectedTeacher(t); setShowModal(true); }}
                    className="btn-primary-premium" 
                    style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                  >
                    <Plus size={14} /> Asignar Carga
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedTeacher && (
        <TeacherAssignmentModal 
          teacher={selectedTeacher}
          programs={directorPrograms}
          onClose={() => setShowModal(false)}
          onSaved={fetchAssignments}
        />
      )}
    </div>
  );
};

/* ─── ACADEMIC DASHBOARD PRINCIPAL ────────────────────────────── */
const AcademicDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const [activeNav, setActiveNav] = useState('horarios');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isCoord = user?.role === 'COORD_ACADEMICO';
  const myPrograms = user?.directorship_programs || [];

  useEffect(() => {
    if (!user || (!['COORD_ACADEMICO', 'DIRECTOR_PROGRAMA', 'ADMIN'].includes(user.role))) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    await fetchStudents();
    await fetchTeachers();
    await fetchPrograms();
  };

  const fetchStudents = async () => {
    let query = supabase
      .from('user')
      .select('*, program:academic_programs(id, name)')
      .eq('role', 'ESTUDIANTE')
      .eq('status', 'Active')
      .order('name');

    // Directores solo ven su programa
    if (!isCoord && myPrograms.length > 0) {
      query = query.in('program', myPrograms);
    }

    const { data } = await query;
    setStudents(data || []);
  };

  const fetchTeachers = async () => {
    // Para la lógica real de la U, los directores pueden ver a todos los profesores
    // pero solo asignarles materias de SUS programas.
    const { data } = await supabase
      .from('user')
      .select('*')
      .eq('role', 'PROFESOR')
      .eq('status', 'Active')
      .order('name');
    setTeachers(data || []);
  };

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from('academic_programs')
      .select('*')
      .in('name', myPrograms);
    setAcademicPrograms(data || []);
  };

  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      title: 'Administración',
      items: [
        { id: 'back_admin', icon: <ArrowLeft size={18} />, label: 'Volver a Panel Admin', onClick: () => navigate('/admin') }
      ]
    }] : []),
    {
      title: 'Gestión Académica',
      items: [
        { id: 'horarios', icon: <Calendar size={18} />, label: 'Horarios Estudiantiles' },
        { id: 'docentes', icon: <GraduationCap size={18} />, label: 'Gestión Docente' },
        { id: 'estudiantes', icon: <Users size={18} />, label: 'Listado Estudiantes' },
        { id: 'curriculum', icon: <BookOpen size={18} />, label: 'Pénsum Institucional' },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      logout={logout}
      navigate={navigate}
    >
      {activeNav === 'horarios' && <HorariosSection students={students} />}
      {activeNav === 'docentes' && <DocentesSection teachers={teachers} directorPrograms={academicPrograms} />}
      {activeNav === 'curriculum' && <CurriculumView />}
      {activeNav === 'estudiantes' && (
        <div className="section-reveal">
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
            {isCoord ? 'Todos los Estudiantes' : 'Mis Estudiantes'}
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>
            {students.length} estudiante{students.length !== 1 ? 's' : ''} activo{students.length !== 1 ? 's' : ''}
            {!isCoord && myPrograms.length > 0 && ` en tus programas`}
          </p>
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  {['ESTUDIANTE', 'PROGRAMA', 'SEMESTRE', 'ESTADO'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '12px',
                          background: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 93%)`,
                          color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                        }}>
                          {(s.name || '?').charAt(0)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{s.name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{s.program?.name || 'N/A'}</td>
                    <td><span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>{s.semester}</span></td>
                    <td><span className={`status-badge ${s.status === 'Active' ? 'status-active' : 'status-suspended'}`}>{s.status === 'Active' ? 'Activo' : 'Suspendido'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AcademicDashboard;
