import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Search, LogOut, Menu, Download, Eye, BookOpen, ArrowLeft, Printer, Heart, GraduationCap, ShieldCheck } from 'lucide-react';
import CharacterizationReport from '../components/CharacterizationReport';

const RegistroDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [charData, setCharData] = useState(null);
  const [activeNav, setActiveNav] = useState('estudiantes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('institucional');

  useEffect(() => {
    if (!user || (user.role !== 'SECRETARIA_ACADEMICA' && user.role !== 'ADMIN')) { navigate('/login'); return; }
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('user')
      .select('*')
      .eq('role', 'ESTUDIANTE')
      .order('name');
    setStudents(data || []);
  };

  const viewStudent = async (s) => {
    setSelected(s);
    const { data } = await supabase.from('characterization').select('*').eq('user_id', s.id).single();
    setCharData(data);
  };

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.program || '').toLowerCase().includes(search.toLowerCase())
  );

  const labelStyle = { fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px', display: 'block' };
  const valueStyle = { fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="mobile-top-bar">
        <span style={{ fontWeight: 900, color: 'var(--primary)' }}>Secretaría Académica</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle"><Menu size={20} /></button>
      </div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
              {(user?.name || 'S').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0, color: 'white' }}>{user?.name?.split(' ')[0]}</p>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', background: '#0891b2', color: 'white', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' }}>
                Secretaría
              </span>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {user?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')} className="admin-nav-item" style={{ marginBottom: '12px', borderLeft: '3px solid var(--secondary)', background: 'rgba(255,255,255,0.05)' }}>
              <ArrowLeft size={18} /> <span style={{ fontWeight: 800 }}>Volver a Panel Admin</span>
            </button>
          )}
          {[
            { id: 'estudiantes', icon: <Users size={18} />, label: 'Estudiantes' },
            { id: 'documentos', icon: <FileText size={18} />, label: 'Fichas de Caracterización' },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveNav(item.id); setSelected(null); setIsSidebarOpen(false); }}
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

      <main className="admin-main-container">
        <div className="section-reveal">
          {/* SEARCH BAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>
                {activeNav === 'estudiantes' ? 'Registro de Estudiantes' : 'Fichas de Caracterización'}
              </h1>
              <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.85rem' }}>{filtered.length} estudiantes registrados</p>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                style={{ padding: '10px 16px 10px 38px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', width: '260px', outline: 'none' }}
                placeholder="Buscar estudiante..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: '24px' }}>
            {/* STUDENT LIST */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>ESTUDIANTE</th>
                      <th>PROGRAMA</th>
                      <th>SEMESTRE</th>
                      {!selected && <th>ESTADO</th>}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} style={{ background: selected?.id === s.id ? '#f0f9ff' : undefined }}>
                        <td>
                          <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '160px' }}>{s.program || 'N/A'}</td>
                        <td><span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>{s.semester}</span></td>
                        {!selected && <td><span className={`status-badge ${s.status === 'Active' ? 'status-active' : 'status-suspended'}`}>{s.status === 'Active' ? 'Activo' : 'Suspendido'}</span></td>}
                        <td>
                          <button onClick={() => { viewStudent(s); setActiveNav('documentos'); }}
                            style={{ background: '#f0f9ff', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#0891b2', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={13} /> Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FICHA DETAIL */}
            {selected && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'auto', maxHeight: '80vh' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{selected.name}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{selected.program} · {selected.semester}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => window.print()} 
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem', fontWeight: 800, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Printer size={15} /> Imprimir Ficha
                    </button>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>✕</button>
                  </div>
                </div>

                {/* TABS PREMIUM */}
                <div style={{ display: 'flex', gap: '2px', background: '#f8fafc', padding: '10px 24px 0', borderBottom: '1px solid #f1f5f9' }}>
                  {[
                    { id: 'institucional', label: 'Institucional', icon: <ShieldCheck size={14} /> },
                    { id: 'caracterizacion', label: 'Personal/Familia', icon: <Users size={14} /> },
                    { id: 'bienestar', label: 'Bienestar/Acad.', icon: <GraduationCap size={14} /> },
                  ].map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setActiveTab(t.id)}
                      style={{ 
                        padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                        fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                        color: activeTab === t.id ? 'var(--primary)' : '#64748b',
                        borderBottom: activeTab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '24px' }}>
                  {activeTab === 'institucional' && (
                    <div className="section-reveal">
                      <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Información Institucional</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[
                          { label: 'Nombre', value: selected.name },
                          { label: 'Identificación', value: selected.document_id || 'No reportada' },
                          { label: 'Correo', value: selected.email },
                          { label: 'Estado', value: selected.status === 'Active' ? '✅ Activo' : '❌ Suspendido' },
                          { label: 'Modalidad', value: selected.study_modality || 'Presencial' },
                          { label: 'Ingreso', value: selected.entry_date || 'No registrado' },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <span style={labelStyle}>{label}</span>
                            <span style={valueStyle}>{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'caracterizacion' && (
                    <div className="section-reveal">
                      {charData ? (
                        <>
                          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Datos Personales y Familia</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                              { label: 'Fecha Nac.', value: charData.birth_date },
                              { label: 'Tipo Sangre', value: charData.blood_type },
                              { label: 'Teléfono', value: charData.phone },
                              { label: 'Estrato', value: charData.estrato },
                              { label: 'Vive con', value: charData.lives_with },
                              { label: 'Educación Padres', value: charData.parent_education },
                              { label: 'Contacto Emergencia', value: charData.emergency_contact },
                              { label: 'Tel. Emergencia', value: charData.emergency_phone },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <span style={labelStyle}>{label}</span>
                                <span style={valueStyle}>{value || '—'}</span>
                              </div>
                            ))}
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Dirección de Residencia</span>
                              <span style={valueStyle}>{charData.address || '—'}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8' }}>
                          <BookOpen size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                          <p style={{ margin: 0, fontWeight: 600 }}>Sin ficha de caracterización</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'bienestar' && (
                    <div className="section-reveal">
                      {charData ? (
                        <>
                          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Bienestar y Perfil Académico</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                              { label: 'Colegio Anterior', value: charData.previous_school },
                              { label: 'Fuente Ingresos', value: charData.income_source },
                              { label: '¿Trabaja?', value: charData.is_working },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <span style={labelStyle}>{label}</span>
                                <span style={valueStyle}>{value || '—'}</span>
                              </div>
                            ))}
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Habilidades Digitales</span>
                              <span style={valueStyle}>{charData.digital_skills || '—'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Intereses / Otros</span>
                              <span style={valueStyle}>{charData.interests || '—'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Notas de Salud / Alergias</span>
                              <span style={{ ...valueStyle, color: '#ef4444' }}>{charData.health_notes || 'Ninguna'}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8' }}>
                          <BookOpen size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                          <p style={{ margin: 0, fontWeight: 600 }}>Sin ficha de caracterización</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COMPONENTE OCULTO DE IMPRESIÓN */}
        <CharacterizationReport student={selected} charData={charData} />
      </main>
    </div>
  );
};

export default RegistroDashboard;
