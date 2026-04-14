import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, MapPin, LogOut, Menu, Calendar } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

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
    try {
      // Lógica Real U: Consultar asignaciones oficiales por ID
      const { data: assignments, error: asgError } = await supabase
        .from('teacher_assignments')
        .select('*')
        .eq('teacher_id', user.id);

      if (asgError) throw asgError;

      if (!assignments || assignments.length === 0) {
        setSubjects([]);
        return;
      }

      // Obtener detalles de horarios para esas materias
      const subjectNames = assignments.map(a => a.subject);
      const { data: scheduleData, error: schError } = await supabase
        .from('schedules')
        .select('*, schedule_blocks(*)')
        .in('subject', subjectNames)
        .eq('period', '2026-1');

      if (schError) throw schError;
      
      setSubjects(scheduleData || []);
    } catch (err) {
      console.error("Error fetching academic load:", err);
    } finally {
      setLoading(false);
    }
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

  const navItems = [
    {
      title: 'Gestión de Aula',
      items: [
        { id: 'inicio', icon: <Calendar size={16} />, label: 'Inicio / Mi Carga', onClick: () => setSelectedSubject(null) }
      ]
    },
    {
      title: 'Mis Materias',
      items: subjects.map(s => ({
        id: s.id,
        icon: <BookOpen size={16} />,
        label: s.subject,
        onClick: () => fetchStudentsForSubject(s)
      }))
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={selectedSubject ? selectedSubject.id : 'inicio'}
      setActiveNav={() => {}} // Not used as we use onClick
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Cargando materias...</p>
          </div>
        ) : !selectedSubject ? (
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px', letterSpacing: '-1px' }}>
              Bienvenido, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.1rem' }}>
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
                    style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: 'var(--card-shadow)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--premium-shadow-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="kpi-icon-box" style={{ background: '#eef2ff', color: 'var(--primary)', marginBottom: 0 }}>
                        <BookOpen size={22} />
                      </div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {s.credits} cr
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontWeight: 900, color: '#1e293b', fontSize: '1.1rem' }}>{s.subject}</h3>
                    <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>Período {s.period}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(s.schedule_blocks || []).map((b, i) => (
                        <span key={i} style={{
                          background: `${dayColors[b.day_of_week]}10`,
                          color: dayColors[b.day_of_week],
                          fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid currentColor', opacity: 0.8
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
              style={{ background: 'rgba(79, 70, 229, 0.05)', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginBottom: '24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px' }}>
              ← Volver a mis materias
            </button>

            <div style={{ marginBottom: '32px' }}>
               <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px', letterSpacing: '-1px' }}>{selectedSubject.subject}</h1>
               <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Período de Gestión Académica {selectedSubject.period}</p>
            </div>

            {/* Bloques horarios */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {(selectedSubject.schedule_blocks || []).map((b, i) => (
                <div key={i} className="kpi-card" style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: '20px'
                }}>
                  <div className="kpi-icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', marginBottom: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#1e293b' }}>{b.day_of_week}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</p>
                  </div>
                  {b.classroom && (
                    <>
                      <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</p>
                        <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#1e293b' }}>{b.classroom}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Lista de estudiantes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 style={{ fontWeight: 900, color: '#1e293b', fontSize: '1.2rem', margin: 0 }}>
                 <Users size={20} style={{ marginRight: '10px', verticalAlign: 'middle', color: 'var(--primary)' }} />
                 Estudiantes Matriculados
               </h3>
               <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
                 {students.length} alumnos
               </span>
            </div>

            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', color: '#94a3b8', border: '1px solid #f1f5f9' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>Cargando lista de estudiantes o no hay matriculados...</p>
              </div>
            ) : (
              <div className="premium-table-container">
                <table className="premium-table">
                  <thead>
                     <tr>
                        <th>Identidad Estudiantil</th>
                        <th>Programa</th>
                        <th>Semestre</th>
                     </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '12px',
                              background: `linear-gradient(135deg, hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 95%), #fff)`,
                              color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0,
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {(s.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{s.name}</p>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{s.program}</td>
                        <td>
                          <span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900, border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                            Semestre {s.semester}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
