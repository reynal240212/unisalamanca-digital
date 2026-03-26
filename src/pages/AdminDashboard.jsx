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
            { label: 'Programa', key: 'program', type: 'text', placeholder: 'Ej: Ingeniería de Sistemas' },
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
const ReportesSection = ({ students }) => {
  const programs = {};
  students.forEach(s => {
    if (s.program) programs[s.program] = (programs[s.program] || 0) + 1;
  });
  const topPrograms = Object.entries(programs).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxVal = topPrograms[0]?.[1] || 1;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>Reportes y Estadísticas</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Análisis de la población estudiantil registrada</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Bar chart by program */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '20px', color: '#1e293b' }}>Distribución por Programa</h3>
          {topPrograms.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Sin datos aún</p>}
          {topPrograms.map(([prog, count]) => (
            <div key={prog} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2A2266' }}>{count}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '8px' }}>
                <div style={{ background: 'linear-gradient(90deg, #2A2266, #16B6D6)', height: '8px', borderRadius: '999px', width: `${(count / maxVal) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Status donut-like */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '20px', color: '#1e293b' }}>Estado de Cuentas</h3>
          {[
            { label: 'Activos', value: students.filter(s => s.status === 'Active').length, color: '#16A34A', bg: '#f0fdf4' },
            { label: 'Suspendidos', value: students.filter(s => s.status === 'Suspended').length, color: '#ef4444', bg: '#fef2f2' },
            { label: 'Validadores', value: students.filter(s => s.role === 'VALIDADOR').length, color: '#16B6D6', bg: '#ecfeff' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: item.bg, borderRadius: '12px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>{item.label}</span>
              <span style={{ fontWeight: 900, fontSize: '1.5rem', color: item.color }}>{item.value}</span>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '14px 16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, color: '#2A2266' }}>TOTAL REGISTRADOS</span>
            <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#2A2266' }}>{students.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SECCIÓN SEGURIDAD ─────────────────────────────────────────── */
const SeguridadSection = ({ students }) => {
  const validators = students.filter(s => s.role === 'VALIDADOR');
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>Seguridad del Campus</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Gestión de agentes validadores y accesos al sistema</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: <Shield size={22} />, label: 'Validadores Activos', value: validators.length, color: '#2A2266', bg: '#eef2ff' },
          { icon: <Activity size={22} />, label: 'Escaneos Hoy', value: '—', color: '#16A34A', bg: '#f0fdf4' },
          { icon: <AlertTriangle size={22} />, label: 'Alertas Pendientes', value: '0', color: '#f59e0b', bg: '#fef9c3' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '44px', height: '44px', background: c.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: '14px' }}>{c.icon}</div>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>{c.label}</p>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: c.color }}>{c.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Agentes Validadores</h3>
        </div>
        {validators.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>No hay validadores registrados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#fafafa' }}>
              {['NOMBRE', 'EMAIL', 'ESTADO'].map(h => <th key={h} style={{ padding: '14px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textAlign: 'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {validators.map(v => (
                <tr key={v.id} style={{ borderTop: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>{v.name}</td>
                  <td style={{ padding: '14px 24px', color: '#64748b', fontSize: '0.85rem' }}>{v.email}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>● Activo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, validators: 0, egresados: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeNav, setActiveNav] = useState('estudiantes');
  const [editingStudent, setEditingStudent] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/login');
    fetchStudents();
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

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {activeNav === 'reportes' && <ReportesSection students={students} />}
        {activeNav === 'seguridad' && <SeguridadSection students={students} />}
        {activeNav === 'config' && <ConfigSection />}

        {activeNav === 'estudiantes' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>Gestión de Identidad</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>Panel central de identidad digital — UniSalamanca</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2A2266', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                  {isUploading ? '⏳ Cargando...' : <><Upload size={16} /> Carga Excel</>}
                  <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" disabled={isUploading} />
                </label>
                <button onClick={fetchStudents} style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>
                  🔄 Actualizar
                </button>
              </div>
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
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{filtered.length} registros</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                  <input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.85rem', width: '280px', fontFamily: 'inherit' }} />
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
