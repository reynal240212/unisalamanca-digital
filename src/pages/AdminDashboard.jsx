import React, { useState, useEffect } from 'react';
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

/* ─── MODAL EDITAR USUARIO ─────────────────────────────────────── */
const EditModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: student.name || '',
    email: student.email || '',
    program: student.program || '',
    role: student.role || 'ESTUDIANTE',
    status: student.status || 'Active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student.id, form);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '36px', width: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1e293b' }}>Editar Usuario</h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>ID: {student.id?.substring(0, 8)}...</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Nombre Completo', key: 'name', type: 'text', placeholder: 'Ej: Juan Pérez' },
            { label: 'Correo Institucional', key: 'email', type: 'email', placeholder: 'ejemplo@unisalamanca.edu.co' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>{f.label}</label>
              <input
                type={f.type} value={form[f.key]} placeholder={f.placeholder}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>Programa Académico</label>
            <select value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', background: 'white', color: '#374151' }}>
              <option value="">— Seleccionar programa —</option>
              <optgroup label="📚 Ciencias Económicas y Administrativas">
                <option>Administración de Empresas</option>
                <option>Contaduría Pública</option>
                <option>Negocios Internacionales</option>
                <option>Mercadeo y Publicidad</option>
              </optgroup>
              <optgroup label="💻 Ingeniería y Tecnología">
                <option>Ingeniería de Sistemas</option>
                <option>Ingeniería Industrial</option>
                <option>Tecnología en Gestión Empresarial</option>
                <option>Tecnología en Desarrollo de Software</option>
              </optgroup>
              <optgroup label="⚖️ Ciencias Jurídicas y Sociales">
                <option>Derecho</option>
                <option>Trabajo Social</option>
                <option>Comunicación Social y Periodismo</option>
              </optgroup>
              <optgroup label="🧠 Ciencias de la Salud">
                <option>Psicología</option>
                <option>Administración en Salud Ocupacional</option>
              </optgroup>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>Rol</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="EGRESADO">Egresado</option>
                <option value="VALIDADOR">Validador</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>Estado</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                <option value="Active">Activo</option>
                <option value="Suspended">Suspendido</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, color: '#64748b' }}>
              Cancelar
            </button>
            <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#2A2266', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={16} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── SECCIÓN REPORTES ──────────────────────────────────────────── */
const ReportesSection = ({ students, logs = [] }) => {
  // Distribución por Programa
  const programs = {};
  students.forEach(s => { if (s.program) programs[s.program] = (programs[s.program] || 0) + 1; });
  const topPrograms = Object.entries(programs).sort((a,b) => b[1] - a[1]).slice(0, 6);
  const maxProg = topPrograms[0]?.[1] || 1;

  // Actividad Horaria (Picos de acceso)
  const hourlyData = new Array(24).fill(0);
  logs.forEach(l => {
    const hour = new Date(l.created_at).getHours();
    hourlyData[hour]++;
  });
  const maxHour = Math.max(...hourlyData) || 1;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>Análisis Institucional</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Estadísticas detalladas de usuarios y actividad de acceso</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Distribución por Programa */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '20px', color: '#1e293b', fontSize: '1rem' }}>Población por Programa</h3>
          {topPrograms.map(([prog, count]) => (
            <div key={prog} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{prog}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{count}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', height: '10px' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', height: '100%', borderRadius: '10px', width: `${(count/maxProg)*100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Picos de Acceso (Actividad Horaria) */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Picos de Acceso (Hoy/Reciente)</h3>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#16a34a' }}>MUESTRA: {logs.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', gap: '4px', paddingBottom: '20px', borderBottom: '1.5px solid #f1f5f9' }}>
            {hourlyData.slice(6, 22).map((count, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: `${(count/maxHour)*100}%`, minHeight: '2px', background: count === maxHour ? 'var(--secondary)' : 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: count > 0 ? 1 : 0.1 }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#94a3b8', fontSize: '0.6rem', fontWeight: 700 }}>
            <span>06:00</span><span>12:00</span><span>18:00</span><span>22:00</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { label: 'TASA ACTIVOS', val: `${Math.round((students.filter(s=>s.status==='Active').length/students.length)*100)}%`, col: '#16a34a' },
            { label: 'CRECIMIENTO MES', val: '+12%', col: '#2A2266' },
            { label: 'FALLOS ACCESO', val: logs.filter(l=>l.status==='DENIED').length, col: '#ef4444' }
          ].map(k => (
            <div key={k.label} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>{k.label}</p>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 900, color: k.col }}>{k.val}</h4>
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
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>Seguridad del Campus</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Actividad de acceso y gestión de validadores</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: <Shield size={22} />, label: 'Validadores Activos', value: validators.length, color: '#2A2266', bg: '#eef2ff' },
          { icon: <Activity size={22} />, label: 'Escaneos Hoy', value: todayLogs.length, color: '#16A34A', bg: '#f0fdf4' },
          { icon: <AlertTriangle size={22} />, label: 'Alertas Pendientes', value: logs.filter(l => l.status === 'DENIED').length, color: '#f59e0b', bg: '#fef9c3' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '44px', height: '44px', background: c.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: '14px' }}>{c.icon}</div>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>{c.label}</p>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: c.color }}>{c.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* RECENT ACTIVITY LOGS */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Actividad Reciente</h3>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16B6D6', background: '#ecfeff', padding: '4px 8px', borderRadius: '6px' }}>EN VIVO</span>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafafa', position: 'sticky', top: 0 }}>
                {['HORA', 'USUARIO', 'ESTADO'].map(h => <th key={h} style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textAlign: 'left' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No hay registros de acceso aún.</td></tr>
                ) : logs.map(l => (
                  <tr key={l.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 24px', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 24px' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{l.user?.name || 'Usuario desconocido'}</p>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{l.user?.program || 'Invitado'}</p>
                    </td>
                    <td style={{ padding: '12px 24px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800,
                        background: l.status === 'GRANTED' ? '#f0fdf4' : '#fef2f2',
                        color: l.status === 'GRANTED' ? '#16A34A' : '#ef4444'
                      }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VALIDATORS LIST */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Agentes Validadores</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {validators.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Sin validadores.</p>
            ) : validators.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--secondary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                  {v.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{v.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{v.email}</p>
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
        { icon: <Lock size={22} />, title: 'Autenticación', desc: 'Nivel de seguridad del portal de acceso.', field: 'Captcha matemático', value: 'Habilitado ✓', color: '#f59e0b', bg: '#fef9c3' },
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

  const handleSaveEdit = async (id, form) => {
    await supabase.from('user').update(form).eq('id', id);
    setEditingStudent(null);
    fetchStudents();
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
      {/* MODAL EDITAR */}
      {editingStudent && (
        <EditModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={handleSaveEdit} />
      )}

      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: '#2A2266', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/images/escudo.png" alt="Logo" style={{ width: '36px', filter: 'brightness(0) invert(1)' }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>
                <span style={{ color: '#16B6D6' }}>Uni</span>Salamanca
              </div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Panel Administrativo</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              marginBottom: '4px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
              background: activeNav === item.id ? 'rgba(22,182,214,0.15)' : 'transparent',
              color: activeNav === item.id ? '#16B6D6' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s', borderLeft: activeNav === item.id ? '3px solid #16B6D6' : '3px solid transparent',
            }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: '#16B6D6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              {(user?.name || 'A').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Administrador</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(248,113,113,0.1)', border: 'none', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        {activeNav === 'reportes' && <ReportesSection students={students} logs={logs} />}
        {activeNav === 'seguridad' && <SeguridadSection students={students} logs={logs} />}
        {activeNav === 'config' && <ConfigSection />}

        {activeNav === 'estudiantes' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>Gestión de Identidad</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>Panel central de identidad digital — UniSalamanca</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleExport} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileUp size={16} /> Exportar Excel
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2A2266', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                  {isUploading ? '⏳ Cargando...' : <><Upload size={16} /> Carga Excel</>}
                  <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" disabled={isUploading} />
                </label>
                <button onClick={fetchStudents} style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>
                  🔄 Actualizar
                </button>
              </div>
            </div>

            {/* FILTROS AVANZADOS */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #f1f5f9' }}>
               <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                  <input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }} />
               </div>
               
               <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem', background: 'white', color: '#475569' }}>
                  <option value="ALL">Todos los Roles</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                  <option value="EGRESADO">Egresados</option>
                  <option value="VALIDADOR">Validadores</option>
               </select>

               <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem', background: 'white', color: '#475569' }}>
                  <option value="ALL">Todos los Estados</option>
                  <option value="Active">Activos</option>
                  <option value="Suspended">Suspendidos</option>
               </select>

               <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem', background: 'white', color: '#475569', maxWidth: '200px' }}>
                  <option value="ALL">Todos los Programas</option>
                  {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
               </select>

               <button onClick={() => { setSearchTerm(''); setFilterRole('ALL'); setFilterStatus('ALL'); setFilterProgram('ALL'); }} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Limpiar</button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'ESTUDIANTES', value: stats.total, color: '#2A2266', bg: '#eef2ff', icon: <Users size={20} />, sub: 'Total inscritos' },
                { label: 'ACTIVOS', value: stats.active, color: '#16A34A', bg: '#f0fdf4', icon: <CheckCircle2 size={20} />, sub: 'Acceso habilitado' },
                { label: 'EGRESADOS', value: stats.egresados, color: '#f59e0b', bg: '#fef9c3', icon: <TrendingUp size={20} />, sub: 'Alumni registrados' },
                { label: 'VALIDADORES', value: stats.validators, color: '#16B6D6', bg: '#ecfeff', icon: <ShieldCheck size={20} />, sub: 'Agentes activos' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>{s.label}</p>
                    <div style={{ width: '36px', height: '36px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* TABLE */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Directorio de Usuarios</h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{filtered.length} registros encontrados</p>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                    {['ESTUDIANTE', 'PROGRAMA', 'ROL', 'ESTADO', 'ACCIONES'].map(h => (
                      <th key={h} style={{ padding: '14px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Sin registros. Carga un archivo Excel.</td></tr>
                  ) : filtered.map(s => (
                    <tr key={s.id} style={{ borderTop: '1px solid #f8fafc' }}>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: `hsl(${(s.name || 'A').charCodeAt(0) * 15}, 60%, 90%)`, color: `hsl(${(s.name || 'A').charCodeAt(0) * 15}, 60%, 35%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {(s.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{s.name}</p>
                            <p style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px', fontSize: '0.83rem', color: '#475569' }}>{s.program || '—'}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                          background: s.role === 'VALIDADOR' ? '#ecfeff' : s.role === 'EGRESADO' ? '#fef9c3' : '#eef2ff',
                          color: s.role === 'VALIDADOR' ? '#0891b2' : s.role === 'EGRESADO' ? '#92400e' : '#4338ca' }}>
                          {s.role || 'ESTUDIANTE'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 700, background: s.status === 'Active' ? '#f0fdf4' : '#fef2f2', color: s.status === 'Active' ? '#16a34a' : '#ef4444' }}>
                          {s.status === 'Active' ? '● Activo' : '● Suspendido'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingStudent(s)} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 700, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Edit2 size={13} /> Editar
                          </button>
                          <button onClick={() => toggleStatus(s)} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 700, border: '1.5px solid', cursor: 'pointer', background: 'transparent', borderColor: s.status === 'Active' ? '#fca5a5' : '#86efac', color: s.status === 'Active' ? '#ef4444' : '#16a34a' }}>
                            {s.status === 'Active' ? 'Suspender' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
