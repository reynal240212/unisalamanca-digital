import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Users, UserPlus, FileUp, Search, LogOut, TrendingUp,
  CheckCircle2, XCircle, ShieldCheck, BarChart2, Settings,
  Upload, Edit2, X, Save, AlertTriangle, Lock, Bell, Shield,
  Activity, Database, Key
} from 'lucide-react';

/* ─── MODAL USUARIO (CREAR/EDITAR) ─────────────────────────────────── */
const UserFormModal = ({ student, onClose, onSave }) => {
  const isEdit = !!student?.id;
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    program: student?.program || '',
    role: student?.role || 'ESTUDIANTE',
    status: student?.status || 'Active',
    password: isEdit ? '' : 'Unisalamanca2026*',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student?.id, form);
  };

  const programs = {
    "Programas Profesionales": [
      "Ingeniería de Sistemas de Información", "Finanzas y Comercio Internacional",
      "Administración de Empresas", "Contaduría Pública"
    ],
    "Programas Tecnólogos": [
      "Gestión de Comercio Exterior", "Gestión Bancaria y Financiera", "Desarrollo de Software"
    ],
    "Técnicos Laborales": [
      "Auxiliar Administrativo", "Auxiliar de Seguridad en el Trabajo", "Bodega y Distribución",
      "Auxiliar de Servicios Estadísticos y Financieros", "Auxiliar de Primera Infancia",
      "Auxiliar de Servicio Social y Apoyo Comunitario", "Mecánica Automotriz", "Inglés"
    ]
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1e293b' }}>{isEdit ? 'Editar Perfil' : 'Alta de Usuario'}</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{isEdit ? `ID: ${student.id?.substring(0, 8)}` : 'Nueva identidad digital'}</p>
          </div>
          <button onClick={onClose} className="admin-nav-item" style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Nombre Completo</label>
              <input className="input-premium" type="text" value={form.name} required onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Correo Institucional</label>
              <input className="input-premium" type="email" value={form.email} required onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Programa Académico</label>
              <select className="input-premium" value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} style={{ width: '100%', background: 'white' }}>
                <option value="">Seleccionar programa</option>
                {Object.entries(programs).map(([cat, items]) => (
                  <optgroup key={cat} label={cat}>
                    {items.map(it => <option key={it} value={it}>{it}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Rol</label>
                <select className="input-premium" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ width: '100%', background: 'white' }}>
                  {['ESTUDIANTE', 'EGRESADO', 'VALIDADOR', 'ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Estado</label>
                <select className="input-premium" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ width: '100%', background: 'white' }}>
                  <option value="Active">Activo</option>
                  <option value="Suspended">Suspendido</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={onClose} className="btn-secondary-premium" style={{ flex: 1 }}>Cancelar</button>
              <button type="submit" className="btn-primary-premium" style={{ flex: 2 }}>{isEdit ? 'Actualizar' : 'Crear Usuario'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── SECCIÓN REPORTES ──────────────────────────────────────────── */
const ReportesSection = ({ students, logs = [] }) => {
  const programs = {};
  students.forEach(s => { if (s.program) programs[s.program] = (programs[s.program] || 0) + 1; });
  const topPrograms = Object.entries(programs).sort((a,b) => b[1] - a[1]).slice(0, 6);
  const maxProg = topPrograms[0]?.[1] || 1;

  const hourlyData = new Array(24).fill(0);
  logs.forEach(l => {
    const hour = new Date(l.created_at).getHours();
    hourlyData[hour]++;
  });
  const maxHour = Math.max(...hourlyData) || 1;

  return (
    <div className="section-reveal">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>Análisis Institucional</h1>
        <p style={{ color: '#64748b' }}>Métricas avanzadas de identidad y acceso digital</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '28px' }}>
        <div className="kpi-card">
          <h3 style={{ fontWeight: 800, marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={18} color="var(--primary)" /> Población por Facultad
          </h3>
          {topPrograms.map(([prog, count]) => (
            <div key={prog} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{prog}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)' }}>{count}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', height: '100%', borderRadius: '10px', width: `${(count/maxProg)*100}%`, transition: 'width 1.5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={18} color="var(--secondary)" /> Picos de Acceso
            </h3>
            <span className="status-badge" style={{ background: '#ecfeff', color: '#0891b2' }}>HOY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '6px' }}>
            {hourlyData.slice(6, 22).map((count, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', height: `${(count/maxHour)*100}%`, minHeight: '4px',
                  background: count === maxHour ? 'var(--secondary)' : 'var(--primary)',
                  borderRadius: '6px 6px 0 0', opacity: count > 0 ? 1 : 0.1,
                  transition: 'height 1s ease'
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700 }}>
            <span>06am</span><span>12pm</span><span>06pm</span><span>10pm</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { label: 'RETENCIÓN', val: '98.2%', col: '#16a34a', sub: 'Usuarios activos' },
          { label: 'CONSULTAS / DÍA', val: '1.2k', col: 'var(--primary)', sub: 'Promedio semanal' },
          { label: 'INCIDENCIAS', val: logs.filter(l=>l.status==='DENIED').length, col: '#ef4444', sub: 'Accesos denegados' }
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>{k.label}</p>
            <h4 style={{ fontSize: '2rem', fontWeight: 900, color: k.col }}>{k.val}</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{k.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── SECCIÓN SEGURIDAD ─────────────────────────────────────────── */
const SeguridadSection = ({ students, logs = [] }) => {
  const validators = students.filter(s => s.role === 'VALIDADOR');
  const todayLogs = logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString());
  
  return (
    <div className="section-reveal">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>Seguridad del Campus</h1>
        <p style={{ color: '#64748b' }}>Monitoreo en tiempo real de accesos y validaciones</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { icon: <Shield size={22} />, label: 'Agentes Activos', value: validators.length, color: 'var(--primary)', bg: '#eef2ff' },
          { icon: <Activity size={22} />, label: 'Validaciones / Hoy', value: todayLogs.length, color: '#16A34A', bg: '#f0fdf4' },
          { icon: <AlertTriangle size={22} />, label: 'Denegados / Reciente', value: logs.filter(l => l.status === 'DENIED').length, color: '#f59e0b', bg: '#fef9c3' },
        ].map((c, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon-box" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{c.label}</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: c.color, margin: '8px 0' }}>{c.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '28px' }}>
        <div className="premium-table-container">
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Registro de Actividad</h3>
            <span className="status-badge" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7' }}>
              <span className="pulse-dot"></span> EN VIVO
            </span>
          </div>
          <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  {['HORA', 'USUARIO / PROGRAMA', 'RESULTADO'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>No hay actividad registrada.</td></tr>
                ) : logs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{l.user?.name || 'Sistema'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{l.user?.program || 'Validación de Credenciales'}</p>
                    </td>
                    <td>
                      <span className={`status-badge ${l.status === 'GRANTED' ? 'status-active' : 'status-suspended'}`}>
                        {l.status === 'GRANTED' ? <ShieldCheck size={14} /> : <XCircle size={14} />}
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Agentes en Turno</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {validators.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Sin agentes.</p>
            ) : validators.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '12px', borderRadius: '16px', background: '#f8fafc' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                  {v.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{v.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{v.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SECCIÓN CONFIGURACIÓN ─────────────────────────────────────── */
const ConfigSection = () => (
  <div>
    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>Configuración del Sistema</h1>
    <p style={{ color: '#64748b', marginBottom: '32px' }}>Parámetros globales de la plataforma de identidad digital</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {[
        { icon: <Key size={22} />, title: 'Seguridad QR', desc: 'Ventana de tiempo para tokens QR dinámicos.', field: 'Expiración del QR', value: '30 segundos', color: '#2A2266', bg: '#eef2ff' },
        { icon: <Bell size={22} />, title: 'Notificaciones', desc: 'Configurar alertas automáticas del sistema.', field: 'Email de alertas', value: 'admin@unisalamanca.edu.co', color: '#16B6D6', bg: '#ecfeff' },
        { icon: <Database size={22} />, title: 'Base de Datos', desc: 'Estado de la conexión con Supabase.', field: 'Proyecto Supabase', value: 'znwpyikzhsldykwaqaoh', color: '#16A34A', bg: '#f0fdf4' },
        { icon: <Lock size={22} />, title: 'Autenticación', desc: 'Nivel de seguridad del portal de acceso.', field: 'Google reCAPTCHA v2', value: 'Verificación Activa ✓', color: '#f59e0b', bg: '#fef9c3' },
      ].map((c, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', background: c.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{c.title}</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.desc}</p>
            </div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 16px' }}>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>{c.field}</p>
            <p style={{ fontWeight: 700, color: '#374151', marginTop: '3px' }}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── ADMIN DASHBOARD PRINCIPAL ─────────────────────────────────── */
const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, validators: 0, egresados: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterProgram, setFilterProgram] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [activeNav, setActiveNav] = useState('estudiantes');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/login');
    fetchStudents();
    fetchLogs();

    const channel = supabase
      .channel('access_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'access_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('user').select('*')
      .neq('role', 'ADMIN').order('created_at', { ascending: false });
    if (!error && data) {
      setStudents(data);
      setStats({
        total: data.length,
        active: data.filter(s => s.status === 'Active').length,
        suspended: data.filter(s => s.status === 'Suspended').length,
        validators: data.filter(s => s.role === 'VALIDADOR').length,
        egresados: data.filter(s => s.role === 'EGRESADO').length,
      });
    }
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('access_logs')
      .select('*, user:user_id(name, program)')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error && data) setLogs(data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    setIsUploading(true);
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      for (let row of data) {
        await supabase.from('user').insert({ email: row.Email, name: row.Nombre, program: row.Programa, status: 'Active', role: 'ESTUDIANTE' });
      }
      setIsUploading(false);
      fetchStudents();
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const exportData = filtered.map(s => ({
      Nombre: s.name,
      Email: s.email,
      Programa: s.program,
      Rol: s.role,
      Estado: s.status,
      Fecha_Creacion: new Date(s.created_at).toLocaleDateString()
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios_Filtrados");
    XLSX.writeFile(wb, `UniSalamanca_Directorio_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSaveUser = async (id, form) => {
    try {
      const userData = { ...form };
      delete userData.password;

      if (form.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password_hash = await bcrypt.hash(form.password, salt);
      }

      if (id) {
         // UPDATE
         const { error } = await supabase.from('user').update(userData).eq('id', id);
         if (!error) {
           setEditingStudent(null);
           fetchStudents();
         } else {
           alert("Error al actualizar: " + error.message);
         }
      } else {
         // CREATE
         const { error } = await supabase.from('user').insert([userData]);
         if (!error) {
           setShowCreateModal(false);
           fetchStudents();
         } else {
           alert("Error al crear: " + error.message);
         }
      }
    } catch (err) {
      alert("Error en el proceso de seguridad: " + err.message);
    }
  };

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Suspended' : 'Active';
    await supabase.from('user').update({ status: newStatus }).eq('id', student.id);
    fetchStudents();
  };

  const filtered = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || s.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesProgram = filterProgram === 'ALL' || s.program === filterProgram;
    return matchesSearch && matchesRole && matchesStatus && matchesProgram;
  });

  const uniquePrograms = [...new Set(students.map(s => s.program).filter(Boolean))].sort();

  const navItems = [
    { id: 'estudiantes', icon: <Users size={18} />, label: 'Estudiantes' },
    { id: 'reportes', icon: <BarChart2 size={18} />, label: 'Reportes' },
    { id: 'seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
    { id: 'config', icon: <Settings size={18} />, label: 'Configuración' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* MODALES */}
      {editingStudent && (
        <UserFormModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={handleSaveUser} />
      )}
      {showCreateModal && (
        <UserFormModal onClose={() => setShowCreateModal(false)} onSave={handleSaveUser} />
      )}

      {/* SIDEBAR PREMIUM */}
      <aside className="admin-sidebar-premium">
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <img src="/images/escudo.png" alt="Logo" style={{ width: '24px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                <span style={{ color: 'var(--secondary)' }}>Uni</span>Salamanca
              </div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Portal de Identidad</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '24px 0' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} 
              className={`admin-nav-item ${activeNav === item.id ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
            background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px' 
          }}>
            <div style={{ 
              width: '38px', height: '38px', background: 'var(--secondary)', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 900, color: 'var(--primary-dark)'
            }}>
              {(user?.name || 'A').charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Director General</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-logout-premium">
            <LogOut size={18} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="admin-main-container">
        {activeNav === 'reportes' && <ReportesSection students={students} logs={logs} />}
        {activeNav === 'seguridad' && <SeguridadSection students={students} logs={logs} />}
        {activeNav === 'config' && <ConfigSection />}

        {activeNav === 'estudiantes' && (
          <div className="section-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>Gestión de Identidad</h1>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Administración central de credenciales digitales</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary-premium">
                  <UserPlus size={18} /> Nuevo Registro
                </button>
                <div style={{ position: 'relative' }}>
                   <button className="btn-secondary-premium btn-export" onClick={handleExport}>
                     <FileUp size={18} /> Exportar
                   </button>
                </div>
                <label className="btn-primary-premium btn-import" style={{ cursor: 'pointer' }}>
                  {isUploading ? '⏳ Procesando' : <><Upload size={18} /> Importar</>}
                  <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" disabled={isUploading} />
                </label>
              </div>
            </div>

            {/* FILTROS AVANZADOS */}
            <div className="kpi-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', padding: '16px' }}>
               <div style={{ flex: 1, position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input type="text" placeholder="Buscar por nombre, email o ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', width: '100%', background: '#f8fafc' }} />
               </div>
               
               <select className="input-premium" value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
                  <option value="ALL">Todos los Roles</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                  <option value="EGRESADO">Egresados</option>
                  <option value="VALIDADOR">Validadores</option>
               </select>

               <select className="input-premium" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
                  <option value="ALL">Estado: Todos</option>
                  <option value="Active">🟢 Activo</option>
                  <option value="Suspended">🔴 Suspendido</option>
               </select>

               <button className="btn-secondary-premium" onClick={() => { setSearchTerm(''); setFilterRole('ALL'); setFilterStatus('ALL'); setFilterProgram('ALL'); }}>Reestablecer</button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
              {[
                { label: 'Total Identidades', value: stats.total, color: 'var(--primary)', bg: '#eef2ff', icon: <Users size={22} /> },
                { label: 'Accesos Habilitados', value: stats.active, color: '#16A34A', bg: '#f0fdf4', icon: <Shield size={22} /> },
                { label: 'Egresados / Alumni', value: stats.egresados, color: '#f59e0b', bg: '#fef9c3', icon: <TrendingUp size={22} /> },
                { label: 'Agentes Seguridad', value: stats.validators, color: 'var(--secondary)', bg: '#ecfeff', icon: <ShieldCheck size={22} /> },
              ].map((s, i) => (
                <div key={i} className="kpi-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div className="kpi-icon-box" style={{ background: s.bg, color: s.color, marginBottom: 0 }}>{s.icon}</div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                  </div>
                  <h3 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{s.value}</h3>
                </div>
              ))}
            </div>

            {/* DIRECTORY TABLE */}
            <div className="premium-table-container">
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>Directorio de Usuarios</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{filtered.length} coincidencias</span>
              </div>
              <table className="premium-table">
                <thead>
                  <tr>
                    {['IDENTIDAD INTEGRAL', 'PROGRAMA ACADÉMICO', 'ROL', 'ESTADO', 'ACCIONES'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>No se encontraron registros en la base de datos.</td></tr>
                  ) : filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ 
                            width: '42px', height: '42px', borderRadius: '14px', 
                            background: `linear-gradient(135deg, hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 95%), #fff)`,
                            color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            {(s.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{s.name}</p>
                            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{s.program || 'N/A'}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                          background: s.role === 'VALIDADOR' ? '#ecfeff' : s.role === 'EGRESADO' ? '#fffbeb' : '#f5f3ff',
                          color: s.role === 'VALIDADOR' ? '#0891b2' : s.role === 'EGRESADO' ? '#b45309' : '#5b21b6',
                          border: '1px solid currentColor', opacity: 0.9
                        }}>
                          {s.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${s.status === 'Active' ? 'status-active' : 'status-suspended'}`}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                          {s.status === 'Active' ? 'Verificado' : 'Suspendido'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingStudent(s)} className="btn-secondary-premium" style={{ padding: '6px 10px' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => toggleStatus(s)} className="btn-secondary-premium" 
                            style={{ 
                              padding: '6px 10px', 
                              color: s.status === 'Active' ? '#ef4444' : '#16a34a',
                              borderColor: 'currentColor'
                            }}>
                            {s.status === 'Active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                          </button>
                        </div>
                      </td>
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

export default AdminDashboard;
