import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, BarChart2, LogOut, Search,
  Plus, Trash2, X, Save, Clock, MapPin, BookOpen, Menu, ArrowLeft
} from 'lucide-react';

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

/* ─── ACADEMIC DASHBOARD PRINCIPAL ────────────────────────────── */
const AcademicDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [activeNav, setActiveNav] = useState('horarios');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isCoord = user?.role === 'COORD_ACADEMICO';
  const myPrograms = user?.directorship_programs || [];

  useEffect(() => {
    if (!user || (!['COORD_ACADEMICO', 'DIRECTOR_PROGRAMA', 'ADMIN'].includes(user.role))) {
      navigate('/login');
      return;
    }
    fetchStudents();
  }, [user]);

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

  const navItems = [
    { id: 'horarios', icon: <Calendar size={18} />, label: 'Horarios' },
    { id: 'estudiantes', icon: <Users size={18} />, label: 'Estudiantes' },
  ];

  const getRoleLabel = () => {
    if (user?.role === 'COORD_ACADEMICO') return 'Coordinador Académico';
    if (user?.role === 'DIRECTOR_PROGRAMA') return 'Director de Programa';
    return user?.role;
  };

  const roleBadgeColor = isCoord ? 'var(--secondary)' : '#7c3aed';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/escudo.png" alt="US" style={{ height: '32px' }} />
          <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>
            {isCoord ? 'Coordinación' : 'Dirección'}
          </span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle">
          <Menu size={20} />
        </button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: roleBadgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>
              {(user?.name || 'A').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>
                {user?.name?.split(' ')[0]}
              </p>
              <span style={{
                fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
                background: roleBadgeColor, color: 'white', padding: '2px 8px',
                borderRadius: '20px', display: 'inline-block', marginTop: '4px'
              }}>
                {getRoleLabel()}
              </span>
            </div>
          </div>

          {!isCoord && myPrograms.length > 0 && (
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '10px' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>Tus Programas</p>
              {myPrograms.map(p => (
                <p key={p} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0', lineHeight: 1.3 }}>· {p}</p>
              ))}
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          {user?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')} className="admin-nav-item" style={{ marginBottom: '12px', borderLeft: '3px solid var(--secondary)', background: 'rgba(255,255,255,0.05)' }}>
              <ArrowLeft size={18} /> <span style={{ fontWeight: 800 }}>Volver a Panel Admin</span>
            </button>
          )}
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }}
              className={`admin-nav-item ${activeNav === item.id ? 'active' : ''}`}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-logout-premium">
            <LogOut size={18} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main-container">
        {activeNav === 'horarios' && <HorariosSection students={students} />}
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
      </main>
    </div>
  );
};

export default AcademicDashboard;
