import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Plus, CheckCircle, XCircle, AlertTriangle, LogOut, Menu, Trash2 } from 'lucide-react';

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
    if (!user || user.role !== 'CARTERA') { navigate('/login'); return; }
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="mobile-top-bar">
        <span style={{ fontWeight: 900, color: 'var(--primary)' }}>Cartera</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-circle"><Menu size={20} /></button>
      </div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
              {(user?.name || 'C').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.9rem', margin: 0, color: 'white' }}>{user?.name?.split(' ')[0]}</p>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', background: '#16a34a', color: 'white', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' }}>Cartera</span>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', padding: '0 8px', marginBottom: '10px' }}>
            {filtered.length} Estudiantes
          </p>
          {filtered.slice(0, 12).map(s => (
            <button key={s.id} onClick={() => { loadObligations(s); setIsSidebarOpen(false); }}
              className={`admin-nav-item ${selected?.id === s.id ? 'active' : ''}`} style={{ fontSize: '0.8rem' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name.split(' ').slice(0, 2).join(' ')}</span>
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
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Gestión de Cartera</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>Obligaciones financieras y paz y salvo estudiantil</p>
          </div>

          {/* SEARCH */}
          <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '24px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              style={{ width: '100%', padding: '12px 16px 12px 38px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', outline: 'none' }}
              placeholder="Buscar estudiante..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {!selected ? (
            /* TABLA DE TODOS LOS ESTUDIANTES */
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="premium-table">
                  <thead><tr><th>ESTUDIANTE</th><th>PROGRAMA</th><th>SEMESTRE</th><th>ACCIÓN</th></tr></thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#475569' }}>{s.program || 'N/A'}</td>
                        <td><span style={{ background: '#eef2ff', color: 'var(--primary)', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>{s.semester}</span></td>
                        <td>
                          <button onClick={() => loadObligations(s)}
                            style={{ background: '#f0fdf4', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }}>
                            Ver Cuenta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* DETALLE DE ESTUDIANTE */
            <div>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginBottom: '20px', fontSize: '0.85rem' }}>
                ← Volver al listado
              </button>

              {/* HEADER ESTUDIANTE + PAZ Y SALVO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{selected.name}</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>{selected.program} · {selected.semester}</p>
                </div>
                <div style={{
                  padding: '14px 24px', borderRadius: '16px',
                  background: isPazYSalvo ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${isPazYSalvo ? '#16a34a' : '#ef4444'}`,
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  {isPazYSalvo ? <CheckCircle size={24} color="#16a34a" /> : <XCircle size={24} color="#ef4444" />}
                  <div>
                    <p style={{ margin: 0, fontWeight: 900, color: isPazYSalvo ? '#16a34a' : '#ef4444', fontSize: '0.95rem' }}>
                      {isPazYSalvo ? '✅ Paz y Salvo' : '❌ Tiene Deudas'}
                    </p>
                    {!isPazYSalvo && <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>Pendiente: {formatCOP(totalDebt)}</p>}
                  </div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary-premium">
                  <Plus size={16} /> Nueva Obligación
                </button>
              </div>

              {/* FORM NUEVA OBLIGACIÓN */}
              {showForm && (
                <form onSubmit={addObligation} style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 20px', fontWeight: 800, color: '#1e293b' }}>Registrar Obligación</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Concepto *</label>
                      <input className="input-premium" style={{ width: '100%' }} required
                        placeholder="Ej: Matrícula 2026-1, Pensión Junio..."
                        value={form.concept} onChange={e => setForm(f => ({ ...f, concept: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Monto (COP)</label>
                      <input className="input-premium" style={{ width: '100%' }} type="number" min={0} step={1000}
                        placeholder="1200000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Fecha Límite</label>
                      <input className="input-premium" style={{ width: '100%' }} type="date"
                        value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Período</label>
                      <input className="input-premium" style={{ width: '100%' }}
                        value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notas</label>
                      <input className="input-premium" style={{ width: '100%' }}
                        value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary-premium">Cancelar</button>
                    <button type="submit" className="btn-primary-premium" disabled={saving}>{saving ? 'Guardando...' : 'Registrar Obligación'}</button>
                  </div>
                </form>
              )}

              {/* LISTA OBLIGACIONES */}
              {obligations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', color: '#94a3b8' }}>
                  <CreditCard size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>Sin obligaciones registradas</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {obligations.map(o => {
                    const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={o.id} style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{o.concept}</p>
                          <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                            Período {o.period}{o.due_date ? ` · Vence: ${o.due_date}` : ''}
                            {o.paid_at ? ` · Pagado: ${new Date(o.paid_at).toLocaleDateString('es-CO')}` : ''}
                          </p>
                          {o.notes && <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>{o.notes}</p>}
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: '#1e293b' }}>{formatCOP(o.amount)}</span>
                        <span style={{ padding: '4px 12px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {cfg.icon} {cfg.label}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(o.status === 'pending' || o.status === 'overdue') && (
                            <button onClick={() => markPaid(o.id)}
                              style={{ background: '#f0fdf4', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#16a34a', fontWeight: 700, fontSize: '0.72rem' }}>
                              ✓ Marcar Pagado
                            </button>
                          )}
                          <button onClick={() => deleteObligation(o.id)}
                            style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={14} />
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
      </main>
    </div>
  );
};

export default CarteraDashboard;
