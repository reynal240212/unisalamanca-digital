import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, Search, LogOut, Menu, Download, Eye, 
  BookOpen, ArrowLeft, Printer, Heart, GraduationCap, 
  ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import CharacterizationReport from '../components/CharacterizationReport';
import PhotoValidationModule from '../components/PhotoValidationModule';
import DashboardLayout from '../components/layout/DashboardLayout';

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
  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      title: 'Administración',
      items: [
        { id: 'back_admin', icon: <ArrowLeft size={18} />, label: 'Volver a Panel Admin', onClick: () => navigate('/admin') }
      ]
    }] : []),
    {
      title: 'Registro y Control',
      items: [
        { id: 'estudiantes', icon: <Users size={18} />, label: 'Estudiantes' },
        { id: 'documentos', icon: <FileText size={18} />, label: 'Fichas de Caracterización' },
        { id: 'validacion', icon: <ImageIcon size={18} />, label: 'Validación de Fotos' },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={activeNav}
      setActiveNav={(id) => { setActiveNav(id); setSelected(null); }}
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        {/* SEARCH BAR (Only if not in validation) */}
        {activeNav !== 'validacion' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>
                {activeNav === 'estudiantes' ? 'Registro Estudiantil' : 'Fichas Académicas'}
              </h1>
              <p style={{ color: '#64748b', marginTop: '6px', fontSize: '1rem' }}>{filtered.length} alumnos registrados en el sistema</p>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                className="premium-input-search"
                style={{ padding: '12px 16px 12px 48px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem', width: '300px', outline: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                placeholder="Buscar por nombre, correo o programa..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        )}

        {activeNav === 'validacion' ? (
          <PhotoValidationModule />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: '32px' }}>
            {/* STUDENT LIST */}
            <div className="premium-table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>IDENTIDAD</th>
                    <th>PROGRAMA</th>
                    <th>SEMESTRE</th>
                    {!selected && <th>ESTADO</th>}
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} style={{ background: selected?.id === s.id ? 'rgba(7, 137, 178, 0.05)' : undefined }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: `linear-gradient(135deg, hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 93%), #fff)`,
                            color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            {(s.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '200px' }}>{s.program || 'No Asignado'}</td>
                      <td>
                        <span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '5px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900 }}>
                          {s.semester}º
                        </span>
                      </td>
                      {!selected && <td><span className={`status-badge ${s.status === 'Active' ? 'status-active' : 'status-suspended'}`}>{s.status === 'Active' ? 'Activo' : 'Inactivo'}</span></td>}
                      <td>
                        <button onClick={() => { viewStudent(s); setActiveNav('documentos'); }}
                          className="btn-action-view"
                          style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: '#0369a1', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={15} /> Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FICHA DETAIL */}
            {selected && (
              <div className="section-reveal" style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
                <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(to right, #fff, #f8fafc)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                     <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>
                        {selected.name.charAt(0)}
                     </div>
                     <div>
                        <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.4rem' }}>{selected.name}</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{selected.program} · Semestre {selected.semester}</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => window.print()} 
                      className="btn-premium-action"
                      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                    >
                      <Printer size={18} /> Imprimir Ficha
                    </button>
                    <button onClick={() => setSelected(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#94a3b8', padding: '10px' }}>✕</button>
                  </div>
                </div>

                {/* TABS PREMIUM */}
                <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '12px 32px 0', borderBottom: '1px solid #f1f5f9' }}>
                  {[
                    { id: 'institucional', label: 'Institucional', icon: <ShieldCheck size={16} /> },
                    { id: 'caracterizacion', label: 'Personal/Familia', icon: <Users size={16} /> },
                    { id: 'bienestar', label: 'Bienestar y Salud', icon: <Heart size={16} /> },
                  ].map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setActiveTab(t.id)}
                      style={{ 
                        padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px',
                        color: activeTab === t.id ? 'var(--primary)' : '#94a3b8',
                        borderBottom: activeTab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        borderTopLeftRadius: '12px', borderTopRightRadius: '12px'
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '32px' }}>
                  {activeTab === 'institucional' && (
                    <div className="section-reveal">
                      <div className="grid-info-premium" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        {[
                          { label: 'Nombre Completo', value: selected.name },
                          { label: 'Documento de Identidad', value: selected.document_id || 'Pendiente' },
                          { label: 'Correo Institucional', value: selected.email },
                          { label: 'Estado Académico', value: selected.status === 'Active' ? 'Activo' : 'Inactivo' },
                          { label: 'Modalidad de Estudio', value: selected.study_modality || 'Presencial' },
                          { label: 'Fecha de Ingreso', value: selected.entry_date || 'No registrada' },
                        ].map(({ label, value }) => (
                          <div key={label} className="info-box-premium">
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {[
                              { label: 'Fecha Nacimiento', value: charData.birth_date },
                              { label: 'Tipo de Sangre/RH', value: charData.blood_type },
                              { label: 'Teléfono Contacto', value: charData.phone },
                              { label: 'Estrato Social', value: charData.estrato },
                              { label: 'Núcleo Familiar (Vive con)', value: charData.lives_with },
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
                              <span style={labelStyle}>Dirección Domiciliaria</span>
                              <span style={valueStyle}>{charData.address || '—'}</span>
                            </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '48px', background: '#f8fafc', borderRadius: '20px', color: '#94a3b8', border: '1px dashed #e2e8f0' }}>
                          <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Ficha No Diligenciada</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>El estudiante aún no ha completado su caracterización.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'bienestar' && (
                    <div className="section-reveal">
                      {charData ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {[
                              { label: 'Colegio de Procedencia', value: charData.previous_school },
                              { label: 'Origen de Fondos', value: charData.income_source },
                              { label: 'Situación Laboral', value: charData.is_working },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <span style={labelStyle}>{label}</span>
                                <span style={valueStyle}>{value || '—'}</span>
                              </div>
                            ))}
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Competencias Digitales</span>
                              <span style={valueStyle}>{charData.digital_skills || 'Nivel Básico'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={labelStyle}>Observaciones Médicas / Alergias</span>
                              <p style={{ ...valueStyle, color: charData.health_notes ? '#ef4444' : '#1e293b', background: charData.health_notes ? '#fef2f2' : 'transparent', padding: charData.health_notes ? '12px' : 0, borderRadius: '12px' }}>
                                {charData.health_notes || 'Sin novedades registradas'}
                              </p>
                            </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '48px', background: '#f8fafc', borderRadius: '24px', color: '#94a3b8', border: '1px dashed #e2e8f0' }}>
                          <Heart size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                          <p style={{ margin: 0, fontWeight: 700 }}>Módulo de Bienestar Vacío</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <CharacterizationReport student={selected} charData={charData} />
      </div>
    </DashboardLayout>
  );
};
  );
};

export default RegistroDashboard;
