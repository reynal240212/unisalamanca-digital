import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, LogOut, Menu, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, Plus, X } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Inscrito',  color: '#ca8a04', bg: '#fef9c3', icon: <Clock size={12} /> },
  reviewing: { label: 'En Revisión', color: '#0891b2', bg: '#ecfeff', icon: <AlertCircle size={12} /> },
  approved:  { label: 'Aprobado',  color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle size={12} /> },
  rejected:  { label: 'Rechazado', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={12} /> },
  enrolled:  { label: 'Matriculado', color: '#7c3aed', bg: '#fdf4ff', icon: <CheckCircle size={12} /> },
};

const PROGRAMS = {
  'Programas Profesionales': ['Ingeniería de Sistemas de Información', 'Finanzas y Comercio Internacional', 'Administración de Empresas', 'Contaduría Pública'],
  'Programas Tecnólogos': ['Gestión de Comercio Exterior', 'Gestión Bancaria y Financiera', 'Desarrollo de Software'],
  'Técnicos Laborales': ['Auxiliar Administrativo', 'Auxiliar de Seguridad en el Trabajo', 'Bodega y Distribución', 'Mecánica Automotriz'],
};

const NewApplicantModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', document_id: '', program_interest: '', modality: 'Presencial', entry_period: '2026-2', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('applicants').insert(form);
    onSaved();
    onClose();
    setSaving(false);
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', margin: 0 }}>Nuevo Aspirante</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#94a3b8" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Nombre Completo *</label>
              <input className="input-premium" style={{ width: '100%' }} required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Correo</label>
              <input className="input-premium" style={{ width: '100%' }} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Teléfono</label>
              <input className="input-premium" style={{ width: '100%' }} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>No. Documento</label>
              <input className="input-premium" style={{ width: '100%' }} value={form.document_id} onChange={e => setForm(f => ({ ...f, document_id: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Período Ingreso</label>
              <input className="input-premium" style={{ width: '100%' }} value={form.entry_period} onChange={e => setForm(f => ({ ...f, entry_period: e.target.value }))} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Programa de Interés</label>
              <select className="input-premium" style={{ width: '100%', background: 'white' }} value={form.program_interest} onChange={e => setForm(f => ({ ...f, program_interest: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {Object.entries(PROGRAMS).map(([cat, items]) => (
                  <optgroup key={cat} label={cat}>
                    {items.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notas / Observaciones</label>
              <textarea className="input-premium" style={{ width: '100%', resize: 'vertical', minHeight: '60px' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary-premium" style={{ flex: 2 }} disabled={saving}>{saving ? 'Guardando...' : 'Registrar Aspirante'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdmisionesDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMISIONES') { navigate('/login'); return; }
    fetchApplicants();
  }, [user]);

  const fetchApplicants = async () => {
    const { data } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
    setApplicants(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('applicants').update({ status }).eq('id', id);
    fetchApplicants();
  };

  const enrollApplicant = async (applicant) => {
    if (!confirm(`¿Matricular a ${applicant.full_name} como estudiante activo?`)) return;

    // Crear usuario en la tabla user
    const { error } = await supabase.from('user').insert({
      name: applicant.full_name,
      email: applicant.email,
      program: applicant.program_interest,
      role: 'ESTUDIANTE',
      status: 'Active',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Unisalamanca2026*
      entry_date: new Date().toISOString().split('T')[0],
      semester: '1er Semestre',
    });

    if (error) {
      alert('Error al matricular: ' + error.message);
      return;
    }

    // Actualizar aspirante como matriculado
    await supabase.from('applicants').update({ status: 'enrolled' }).eq('id', applicant.id);
    fetchApplicants();
    alert(`✅ ${applicant.full_name} fue matriculado exitosamente. Contraseña inicial: Unisalamanca2026*`);
  };

  const filtered = applicants.filter(a => {
    const matchSearch = (a.full_name || '').toLowerCase().includes(search.toLowerCase()) || (a.program_interest || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, k) => ({ ...acc, [k]: applicants.filter(a => a.status === k).length }), {});

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="mobile-top-bar">
        <span style={{ fontWeight: 900, color: 'var(--primary)' }}>Admisiones</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle"><Menu size={20} /></button>
      </div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
              {(user?.name || 'A').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0, color: 'white' }}>{user?.name?.split(' ')[0]}</p>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', background: '#7c3aed', color: 'white', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' }}>Admisiones</span>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {[{ status: 'all', label: `Todos (${applicants.length})` }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ status: k, label: `${v.label} (${counts[k] || 0})` }))].map(item => (
            <button key={item.status} onClick={() => { setFilterStatus(item.status); setIsSidebarOpen(false); }}
              className={`admin-nav-item ${filterStatus === item.status ? 'active' : ''}`} style={{ fontSize: '0.82rem' }}>
              <span>{item.label}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Gestión de Admisiones</h1>
              <p style={{ color: '#64748b', marginTop: '4px' }}>{applicants.length} aspirantes registrados</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary-premium">
              <Plus size={16} /> Nuevo Aspirante
            </button>
          </div>

          {/* KPI CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: `1px solid ${cfg.bg}`, cursor: 'pointer' }}
                onClick={() => setFilterStatus(key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: cfg.color }}>
                  {cfg.icon}
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>{cfg.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{counts[key] || 0}</p>
              </div>
            ))}
          </div>

          {/* SEARCH */}
          <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '20px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', outline: 'none' }}
              placeholder="Buscar aspirante o programa..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* TABLA ASPIRANTES */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>ASPIRANTE</th>
                    <th>PROGRAMA</th>
                    <th>PERÍODO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Sin aspirantes con este filtro</td></tr>
                  ) : filtered.map(a => {
                    const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={a.id}>
                        <td>
                          <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{a.full_name}</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{a.email || a.phone || '—'}</p>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '180px' }}>{a.program_interest || 'Por definir'}</td>
                        <td style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{a.entry_period}</td>
                        <td>
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {a.status === 'pending' && (
                              <button onClick={() => updateStatus(a.id, 'reviewing')} style={{ background: '#ecfeff', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', color: '#0891b2', fontWeight: 700, fontSize: '0.72rem' }}>
                                Revisar
                              </button>
                            )}
                            {a.status === 'reviewing' && (
                              <>
                                <button onClick={() => updateStatus(a.id, 'approved')} style={{ background: '#f0fdf4', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', color: '#16a34a', fontWeight: 700, fontSize: '0.72rem' }}>
                                  ✓ Aprobar
                                </button>
                                <button onClick={() => updateStatus(a.id, 'rejected')} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', color: '#ef4444', fontWeight: 700, fontSize: '0.72rem' }}>
                                  ✗ Rechazar
                                </button>
                              </>
                            )}
                            {a.status === 'approved' && (
                              <button onClick={() => enrollApplicant(a)} style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '0.72rem' }}>
                                🎓 Matricular
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showModal && <NewApplicantModal onClose={() => setShowModal(false)} onSaved={fetchApplicants} />}
    </div>
  );
};

export default AdmisionesDashboard;
