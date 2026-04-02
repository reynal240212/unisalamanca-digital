import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, MapPin, LogOut, Menu, Calendar } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'PROFESOR') {
      navigate('/login');
      return;
    }
    fetchMySubjects();
  }, [user]);

  const fetchMySubjects = async () => {
    setLoading(true);
    // Un profesor ve todas las materias donde es el docente asignado
    const { data } = await supabase
      .from('schedules')
      .select('*, schedule_blocks(*)')
      .ilike('teacher', `%${user.name.split(' ')[0]}%`)
      .order('subject');
    setSubjects(data || []);
    setLoading(false);
  };

  const fetchStudentsForSubject = async (subject) => {
    setSelectedSubject(subject);
    // Obtener todos los estudiantes que tienen esta materia asignada
    const { data: allSchedules } = await supabase
      .from('schedules')
      .select('user_id')
      .eq('subject', subject.subject)
      .eq('period', subject.period);

    const userIds = (allSchedules || []).map(s => s.user_id);
    if (userIds.length === 0) { setStudents([]); return; }

    const { data: studentsData } = await supabase
      .from('user')
      .select('id, name, email, program, semester')
      .in('id', userIds);
    setStudents(studentsData || []);
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayColors = { Lunes: '#4f46e5', Martes: '#16a34a', Miércoles: '#ea580c', Jueves: '#a21caf', Viernes: '#0891b2', Sábado: '#ca8a04' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* SIDEBAR */}
      <div className="mobile-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/escudo.png" alt="US" style={{ height: '32px' }} />
          <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>Portal Docente</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle">
          <Menu size={20} />
        </button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>
              {(user?.name || 'P').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0, color: 'white' }}>{user?.name?.split(' ').slice(0,2).join(' ')}</p>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', background: '#7c3aed', color: 'white', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' }}>
                Docente
              </span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', padding: '0 8px', marginBottom: '10px' }}>
            Mis Materias ({subjects.length})
          </p>
          {subjects.map(s => (
            <button key={s.id} onClick={() => { fetchStudentsForSubject(s); setIsSidebarOpen(false); }}
              className={`admin-nav-item ${selectedSubject?.id === s.id ? 'active' : ''}`}
              style={{ fontSize: '0.82rem' }}>
              <BookOpen size={16} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subject}</span>
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
        <div className="section-reveal">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <p style={{ color: '#94a3b8', fontWeight: 600 }}>Cargando materias...</p>
            </div>
          ) : !selectedSubject ? (
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
                Bienvenido, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>
                {subjects.length} materia{subjects.length !== 1 ? 's' : ''} asignada{subjects.length !== 1 ? 's' : ''} este período
              </p>

              {subjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                  <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#475569', margin: 0 }}>Sin materias asignadas</h3>
                  <p style={{ color: '#94a3b8', marginTop: '8px' }}>El coordinador aún no ha asignado materias a tu nombre</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {subjects.map(s => (
                    <button key={s.id} onClick={() => fetchStudentsForSubject(s)}
                      style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={22} color="var(--primary)" />
                        </div>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                          {s.credits} cr
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 6px', fontWeight: 900, color: '#1e293b', fontSize: '1rem' }}>{s.subject}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>Período {s.period}</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(s.schedule_blocks || []).map((b, i) => (
                          <span key={i} style={{
                            background: `${dayColors[b.day_of_week]}15`,
                            color: dayColors[b.day_of_week],
                            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <Clock size={10} />
                            {b.day_of_week} {b.start_time?.slice(0,5)}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <button onClick={() => setSelectedSubject(null)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ← Volver a mis materias
              </button>

              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>{selectedSubject.subject}</h1>
              <p style={{ color: '#64748b', marginBottom: '28px' }}>Período {selectedSubject.period}</p>

              {/* Bloques horarios */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {(selectedSubject.schedule_blocks || []).map((b, i) => (
                  <div key={i} style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    <Clock size={18} color="var(--primary)" />
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>{b.day_of_week}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</p>
                    </div>
                    {b.classroom && (
                      <>
                        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Salón</p>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>{b.classroom}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Lista de estudiantes */}
              <h3 style={{ fontWeight: 800, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                <Users size={14} style={{ marginRight: '6px' }} />
                Estudiantes matriculados ({students.length})
              </h3>

              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', color: '#94a3b8' }}>
                  <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>Sin estudiantes registrados en esta materia</p>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  {students.map((s, i) => (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
                      borderBottom: i < students.length - 1 ? '1px solid #f8fafc' : 'none'
                    }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 93%)`,
                        color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0
                      }}>
                        {(s.name || '?').charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{s.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</p>
                      </div>
                      <span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {s.semester}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
