import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, BarChart2, LogOut, Search,
  Plus, Trash2, X, Save, Clock, MapPin, BookOpen, Menu, ArrowLeft, GraduationCap, Briefcase
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

/* ─── MODAL HORARIO ────────────────────────────────────────────── */
const ScheduleModal = ({ student, onClose, onSaved }) => {
  const [form, setForm] = useState({
    subject: '', teacher: '', credits: 3, period: '2026-1',
    blocks: [{ day_of_week: 'Lunes', start_time: '06:00', end_time: '08:00', classroom: '' }]
  });
  const [saving, setSaving] = useState(false);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const addBlock = () => setForm(f => ({
    ...f, blocks: [...f.blocks, { day_of_week: 'Lunes', start_time: '06:00', end_time: '08:00', classroom: '' }]
  }));

  const removeBlock = (i) => setForm(f => ({ ...f, blocks: f.blocks.filter((_, idx) => idx !== i) }));

  const updateBlock = (i, field, val) => setForm(f => ({
    ...f, blocks: f.blocks.map((b, idx) => idx === i ? { ...b, [field]: val } : b)
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    setSaving(true);
    try {
      const { data: schedule, error: sErr } = await supabase
        .from('schedules')
        .insert({ user_id: student.id, program: student.program, subject: form.subject, teacher: form.teacher, credits: form.credits, period: form.period })
        .select().single();
      if (sErr) throw sErr;

      if (form.blocks.length > 0) {
        const blocks = form.blocks.map(b => ({ schedule_id: schedule.id, ...b }));
        const { error: bErr } = await supabase.from('schedule_blocks').insert(blocks);
        if (bErr) throw bErr;
      }
      onSaved();
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', margin: 0 }}>Agregar Materia</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Para: <strong>{student.name}</strong> · {student.program}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Nombre de la Materia *
              </label>
              <input className="input-premium" style={{ width: '100%' }} required
                value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Ej: Programación Orientada a Objetos" />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Docente</label>
              <input className="input-premium" style={{ width: '100%' }}
                value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}
                placeholder="Nombre del profesor" />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Créditos</label>
              <input className="input-premium" style={{ width: '100%' }} type="number" min={1} max={6}
                value={form.credits} onChange={e => setForm(f => ({ ...f, credits: Number(e.target.value) }))} />
            </div>
          </div>

          {/* BLOQUES HORARIOS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Bloques Horarios
              </label>
              <button type="button" onClick={addBlock}
                style={{ background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> Añadir día
              </button>
            </div>

            {form.blocks.map((block, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Día</label>
                    <select className="input-premium" style={{ background: 'white', padding: '8px' }}
                      value={block.day_of_week} onChange={e => updateBlock(i, 'day_of_week', e.target.value)}>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Inicio</label>
                    <input className="input-premium" type="time" style={{ padding: '8px' }}
                      value={block.start_time} onChange={e => updateBlock(i, 'start_time', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Fin</label>
                    <input className="input-premium" type="time" style={{ padding: '8px' }}
                      value={block.end_time} onChange={e => updateBlock(i, 'end_time', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeBlock(i)} disabled={form.blocks.length === 1}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444', opacity: form.blocks.length === 1 ? 0.3 : 1 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Salón</label>
                  <input className="input-premium" style={{ width: '100%', padding: '8px' }} placeholder="Ej: Aula 201"
                    value={block.classroom} onChange={e => updateBlock(i, 'classroom', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary-premium" style={{ flex: 2 }} disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Materia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── MODAL ASIGNACIÓN DOCENTE ─────────────────────────────────── */
const TeacherAssignmentModal = ({ teacher, programs, onClose, onSaved }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailableSubjects();
  }, []);

  const fetchAvailableSubjects = async () => {
    const { data } = await supabase
      .from('program_curriculum')
      .select('subjects')
      .in('program_id', programs.map(p => p.id));
    
    // Parsear materias de los strings separados por coma
    const allSubjects = data.flatMap(d => d.subjects.split(',').map(s => s.trim()));
    setSubjects([...new Set(allSubjects)].sort());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('teacher_assignments')
        .insert({ 
          teacher_id: teacher.id, 
          subject: selectedSubject,
          period: '2026-1'
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
      <div className="premium-modal-content" style={{ maxWidth: '450px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', margin: 0 }}>Asignar Materia</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Docente: {teacher.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Seleccionar Materia del Programa
            </label>
            <select 
              className="input-premium" 
              style={{ width: '100%' }} 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">-- Seleccionar materia --</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary-premium" style={{ flex: 2 }} disabled={saving}>
              <Save size={16} /> {saving ? 'Asignando...' : 'Confirmar Asignación'}
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
    const { data } = await supabase
      .from('schedules')
      .select('*, schedule_blocks(*)')
      .eq('user_id', student.id)
      .order('subject');
    setSchedules(data || []);
    setLoading(false);
  };

  const deleteSchedule = async (scheduleId) => {
    if (!confirm('¿Eliminar esta materia del horario?')) return;
    await supabase.from('schedules').delete().eq('id', scheduleId);
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
                  <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.program || 'Sin programa'}</p>
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
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{selectedStudent.name}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{selectedStudent.program} · {selectedStudent.semester}</p>
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
          )}
        </div>
      </div>

      {showModal && selectedStudent && (
        <ScheduleModal
          student={selectedStudent}
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
    const { data } = await supabase.from('teacher_assignments').select('*');
    const mapping = {};
    data?.forEach(asg => {
      if (!mapping[asg.teacher_id]) mapping[asg.teacher_id] = [];
      mapping[asg.teacher_id].push(asg);
    });
    setAssignments(mapping);
    setLoading(false);
  };

  const removeAssignment = async (id) => {
    if (!confirm('¿Quitar esta asignación?')) return;
    await supabase.from('teacher_assignments').delete().eq('id', id);
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
      .select('*')
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
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{s.program || 'N/A'}</td>
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
