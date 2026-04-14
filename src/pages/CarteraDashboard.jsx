import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Plus, CheckCircle, XCircle, AlertTriangle, LogOut, Menu, Trash2, ArrowLeft, Users, DollarSign, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const STATUS_CONFIG = {
  paid:     { label: 'Pagado',    color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle size={14} /> },
  pending:  { label: 'Pendiente', color: '#ca8a04', bg: '#fef9c3', icon: <AlertTriangle size={14} /> },
  overdue:  { label: 'Vencido',   color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> },
  forgiven: { label: 'Condonado', color: '#7c3aed', bg: '#fdf4ff', icon: <CheckCircle size={14} /> },
};

const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

const CarteraDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [form, setForm] = useState({ concept: '', amount: '', due_date: '', period: '2026-1', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'CARTERA' && user.role !== 'ADMIN')) { navigate('/login'); return; }
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const { data } = await supabase.from('user').select('id, name, email, program, semester').eq('role', 'ESTUDIANTE').order('name');
    setStudents(data || []);
  };

  const loadObligations = async (student) => {
    setSelected(student);
    setShowForm(false);
    const { data } = await supabase
      .from('financial_obligations')
      .select('*')
      .eq('user_id', student.id)
      .order('created_at', { ascending: false });
    setObligations(data || []);
  };

  const addObligation = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('financial_obligations').insert({
      user_id: selected.id, concept: form.concept, amount: parseFloat(form.amount) || 0,
      due_date: form.due_date || null, period: form.period, notes: form.notes, status: 'pending'
    });
    setForm({ concept: '', amount: '', due_date: '', period: '2026-1', notes: '' });
    setShowForm(false);
    setSaving(false);
    loadObligations(selected);
  };

  const markPaid = async (id) => {
    await supabase.from('financial_obligations').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id);
    loadObligations(selected);
  };

  const deleteObligation = async (id) => {
    if (!confirm('¿Eliminar esta obligación?')) return;
    await supabase.from('financial_obligations').delete().eq('id', id);
    loadObligations(selected);
  };

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.program || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalDebt = obligations.filter(o => o.status === 'pending' || o.status === 'overdue').reduce((acc, o) => acc + (o.amount || 0), 0);
  const isPazYSalvo = totalDebt === 0;

  const navItems = [
    ...(user?.role === 'ADMIN' ? [{
      title: 'Administración',
      items: [
        { id: 'back_admin', icon: <ArrowLeft size={18} />, label: 'Volver a Panel Admin', onClick: () => navigate('/admin') }
      ]
    }] : []),
    {
      title: 'Servicios Financieros',
      items: [
        { id: 'inicio', icon: <CreditCard size={18} />, label: 'Estado de Cartera', onClick: () => setSelected(null) },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={selected ? selected.id : 'inicio'}
      setActiveNav={() => {}} 
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>
            {selected ? 'Gestión de Cuenta' : 'Cartera Institucional'}
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '1.1rem' }}>
            {selected ? `Administrando obligaciones de ${selected.name}` : 'Módulo de control financiero y paz y salvo'}
          </p>
        </div>

        {/* SEARCH (Only if no student selected) */}
        {!selected && (
          <div style={{ position: 'relative', maxWidth: '450px', marginBottom: '32px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="premium-input-search"
              style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '18px', border: '1px solid #e2e8f0', background: 'white', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
              placeholder="Buscar estudiante por nombre o programa..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}

        {!selected ? (
          /* TABLA DE TODOS LOS ESTUDIANTES */
          <div className="premium-table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>IDENTIDAD ESTUDIANTIL</th>
                  <th>PROGRAMA ACADÉMICO</th>
                  <th>SEMESTRE</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '14px',
                          background: `linear-gradient(135deg, hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 93%), #fff)`,
                          color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                          {(s.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>{s.name}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600 }}>{s.program || 'Sin Programa'}</td>
                    <td>
                      <span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 900 }}>
                        {s.semester}º Sem.
                      </span>
                    </td>
                    <td>
                      <button onClick={() => loadObligations(s)}
                        className="btn-action-view"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={16} /> Consultar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* DETALLE DE ESTUDIANTE */
          <div className="section-reveal">
            <button onClick={() => setSelected(null)}
              style={{ background: 'rgba(7, 137, 178, 0.05)', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginBottom: '32px', fontSize: '0.9rem', padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ← Volver al Listado General
            </button>

            {/* HEADER ESTUDIANTE + KPI CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginBottom: '40px' }}>
               <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.8rem' }}>
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>{selected.name}</h2>
                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '1.1rem', fontWeight: 600 }}>{selected.program} · Semestre {selected.semester}</p>
                  </div>
               </div>

               <div style={{
                  padding: '24px', borderRadius: '24px',
                  background: isPazYSalvo ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${isPazYSalvo ? '#22c55e' : '#ef4444'}`,
                  display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--card-shadow)'
                }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', 
                    background: isPazYSalvo ? '#dcfce7' : '#fee2e2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPazYSalvo ? '#16a34a' : '#ef4444'
                  }}>
                    {isPazYSalvo ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 900, color: isPazYSalvo ? '#16a34a' : '#ef4444', fontSize: '1.2rem', letterSpacing: '-0.3px' }}>
                      {isPazYSalvo ? 'Estado: Paz y Salvo' : 'Estado: Pendiente'}
                    </p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isPazYSalvo ? '#16a34a' : '#b91c1c' }}>
                      {isPazYSalvo ? 'Sin deudas activas' : `Saldo: ${formatCOP(totalDebt)}`}
                    </p>
                  </div>
                </div>
            </div>

            {/* ACTION BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.2rem' }}>
                 Historial de Obligaciones
               </h3>
               <button onClick={() => setShowForm(!showForm)} className="btn-primary-premium" style={{ padding: '12px 24px', borderRadius: '16px' }}>
                 <Plus size={20} style={{ marginRight: '8px' }} /> Generar Cobro
               </button>
            </div>

            {/* FORM NUEVA OBLIGACIÓN */}
            {showForm && (
              <form onSubmit={addObligation} className="section-reveal" style={{ background: 'white', borderRadius: '24px', padding: '32px', marginBottom: '32px', border: '1px solid var(--primary)', boxShadow: 'var(--premium-shadow-hover)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <h4 style={{ margin: 0, fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem' }}>Registrar Nueva Obligación</h4>
                   <button onClick={() => setShowForm(false)} type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>Descripción del Concepto *</label>
                    <input className="input-premium" style={{ width: '100%', padding: '14px', borderRadius: '12px' }} required
                      placeholder="Ej: Matrícula Ordinaria 2026-1, Derechos de Grado, Certificado..."
                      value={form.concept} onChange={e => setForm(f => ({ ...f, concept: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Valor (COP)</label>
                    <input className="input-premium" style={{ width: '100%', padding: '14px', borderRadius: '12px' }} type="number" min={0} step={1000}
                      placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Fecha Vencimiento</label>
                    <input className="input-premium" style={{ width: '100%', padding: '14px', borderRadius: '12px' }} type="date"
                      value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Ciclo/Período</label>
                    <input className="input-premium" style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
                      value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} />
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Notas Administrativas</label>
                    <textarea className="input-premium" style={{ width: '100%', padding: '14px', borderRadius: '12px', height: '80px', resize: 'none' }}
                      value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observaciones sobre el pago o saldo..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button type="submit" className="btn-primary-premium" style={{ padding: '14px 28px', flex: 1 }} disabled={saving}>
                    {saving ? 'Procesando...' : 'Generar Obligación Financiera'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-premium" style={{ padding: '14px 28px' }}>Descartar</button>
                </div>
              </form>
            )}

            {/* LISTA OBLIGACIONES */}
            {obligations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', color: '#94a3b8' }}>
                <CreditCard size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <h3 style={{ margin: 0, color: '#475569' }}>Historial Limpio</h3>
                <p style={{ margin: '8px 0 0', fontWeight: 500 }}>Este estudiante no posee registros financieros en el sistema.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {obligations.map(o => {
                  const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={o.id} className="kpi-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', border: '1px solid #f1f5f9' }}>
                      <div className="kpi-icon-box" style={{ background: cfg.bg, color: cfg.color, marginBottom: 0 }}>
                         {cfg.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.1rem' }}>{o.concept}</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>{o.period}</p>
                           {o.due_date && <p style={{ margin: 0, fontSize: '0.85rem', color: o.status === 'overdue' ? '#ef4444' : '#64748b', fontWeight: 700 }}>Vence: {o.due_date}</p>}
                           {o.paid_at && <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>Pagado el: {new Date(o.paid_at).toLocaleDateString()}</p>}
                        </div>
                        {o.notes && <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Nota: {o.notes}</p>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <p style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem', color: '#1e293b', letterSpacing: '-0.5px' }}>{formatCOP(o.amount)}</p>
                         <span style={{ padding: '5px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, background: cfg.bg, color: cfg.color, display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                           {cfg.label.toUpperCase()}
                         </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {(o.status === 'pending' || o.status === 'overdue') && (
                          <button onClick={() => markPaid(o.id)}
                            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', color: '#16a34a', fontWeight: 800, fontSize: '0.8rem' }}>
                            Saldar Deuda
                          </button>
                        )}
                        <button onClick={() => deleteObligation(o.id)}
                          style={{ background: '#fef2f2', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#ef4444', border: '1px solid #fee2e2' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CarteraDashboard;
