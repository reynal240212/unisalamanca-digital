import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, LogOut, Menu, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, Plus, X, ArrowLeft, Users, Briefcase, GraduationCap } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

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
    if (!user || (user.role !== 'ADMISIONES' && user.role !== 'ADMIN')) { navigate('/login'); return; }
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

  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      title: 'Administración',
      items: [
        { id: 'back_admin', icon: <ArrowLeft size={18} />, label: 'Volver a Panel Admin', onClick: () => navigate('/admin') }
      ]
    }] : []),
    {
      title: 'Módulo de Ingreso',
      items: [
        { id: 'all', icon: <Users size={18} />, label: 'Gestión General', onClick: () => setFilterStatus('all') },
      ]
    },
    {
      title: 'Filtros de Proceso',
      items: Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
        id: key,
        icon: React.cloneElement(cfg.icon, { size: 18 }),
        label: cfg.label,
        onClick: () => setFilterStatus(key)
      }))
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={filterStatus}
      setActiveNav={setFilterStatus}
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>
              Admisiones y Registro
            </h1>
            <p style={{ color: '#64748b', marginTop: '6px', fontSize: '1.1rem', fontWeight: 500 }}>
              {filterStatus === 'all' ? 'Control de aspirantes y nuevos ingresos' : `Filtrando por: ${STATUS_CONFIG[filterStatus]?.label}`}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary-premium" style={{ padding: '14px 28px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(7, 137, 178, 0.3)' }}>
            <UserPlus size={20} style={{ marginRight: '8px' }} /> Registrar Aspirante
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div 
              key={key} 
              className={`kpi-card ${filterStatus === key ? 'active' : ''}`}
              style={{ padding: '24px', cursor: 'pointer', border: filterStatus === key ? '2px solid var(--primary)' : '1px solid #f1f5f9' }}
              onClick={() => setFilterStatus(key)}
            >
              <div className="kpi-icon-box" style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              <p style={{ margin: '12px 0 4px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</p>
              <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, color: '#1e293b' }}>{counts[key] || 0}</p>
            </div>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div style={{ position: 'relative', maxWidth: '420px', marginBottom: '32px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            className="premium-input-search"
            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '18px', border: '1px solid #e2e8f0', background: 'white', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
            placeholder="Buscar por nombre, correo o programa..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* DATA TABLE */}
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ESTADO | IDENTIDAD DEL ASPIRANTE</th>
                <th>PROGRAMA DE INTERÉS</th>
                <th>PERÍODO</th>
                <th>SIGUIENTE PASO</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                       <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                       <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No se encontraron aspirantes bajo estos criterios</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(a => {
                const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '16px',
                          background: cfg.bg, color: cfg.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                        }}>
                          {React.cloneElement(cfg.icon, { size: 24 })}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.05rem' }}>{a.full_name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{a.email || a.phone || 'Sin contacto'}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, fontSize: '0.95rem' }}>
                         <GraduationCap size={16} color="var(--primary)" />
                         {a.program_interest || 'Sin Definir'}
                       </div>
                    </td>
                    <td style={{ fontWeight: 800, color: '#1e293b' }}>
                       <span style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                         {a.entry_period}
                       </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {a.status === 'pending' && (
                          <button onClick={() => updateStatus(a.id, 'reviewing')} className="btn-action-primary" style={{ background: '#ecfeff', color: '#0891b2', border: '1px solid #cffafe' }}>
                            Evaluar Perfil
                          </button>
                        )}
                        {a.status === 'reviewing' && (
                          <>
                            <button onClick={() => updateStatus(a.id, 'approved')} className="btn-action-primary" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7' }}>
                              <CheckCircle size={14} style={{ marginRight: '6px' }} /> Admitir
                            </button>
                            <button onClick={() => updateStatus(a.id, 'rejected')} className="btn-action-primary" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }}>
                              <XCircle size={14} style={{ marginRight: '6px' }} /> Rechazar
                            </button>
                          </>
                        )}
                        {a.status === 'approved' && (
                          <button onClick={() => enrollApplicant(a)} className="btn-primary-premium" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '12px' }}>
                            Finalizar Matrícula
                          </button>
                        )}
                        {a.status === 'enrolled' && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Briefcase size={16} /> Estudiante Activo
                          </span>
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

      {showModal && <NewApplicantModal onClose={() => setShowModal(false)} onSaved={fetchApplicants} />}
    </DashboardLayout>
  );
};

export default AdmisionesDashboard;
