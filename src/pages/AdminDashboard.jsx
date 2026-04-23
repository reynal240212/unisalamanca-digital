import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import StudentSchedule from '../components/StudentSchedule';
import ProfileView from '../components/ProfileView';
import PhotoValidationModule from '../components/PhotoValidationModule';
import CurriculumView from '../components/CurriculumView';
import SalmiChatbot from '../components/SalmiChatbot';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import GlobalAnalytics from '../components/GlobalAnalytics';
import {
  Users, UserPlus, FileUp, Search, LogOut, TrendingUp,
  CheckCircle2, XCircle, ShieldCheck, BarChart2, Settings,
  Upload, Edit2, X, Save, AlertTriangle, Lock, Bell, Shield,
  Activity, Database, Key, Menu, GraduationCap, Wallet, ClipboardList,
  Image as ImageIcon, BookOpen, Layers, Clock, ArrowUpRight, Filter, Sparkles
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAdmin } from '../hooks/useAdmin';

/* ─── MODAL USUARIO (CREAR/EDITAR) ─────────────────────────────────── */
const UserFormModal = ({ student, onClose, onSave }) => {
  const isEdit = !!student?.id;
  const [dbPrograms, setDbPrograms] = useState([]);
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    program: student?.program || '',
    role: student?.role || 'ESTUDIANTE',
    status: student?.status || 'Active',
    entry_date: student?.entry_date || '',
    document_id: student?.document_id || '',
    password: isEdit ? '' : `Unisalamanca${new Date().getFullYear()}*`,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from('academic_programs')
        .select('name, program_type')
        .order('name');
      if (!error && data) {
        // Group by type
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.program_type]) acc[curr.program_type] = [];
          acc[curr.program_type].push(curr.name);
          return acc;
        }, {});
        setDbPrograms(grouped);
      }
    };
    fetchPrograms();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student?.id, form);
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
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Cédula / Documento de Identidad</label>
              <input className="input-premium" type="text" value={form.document_id} required onChange={e => setForm(p => ({ ...p, document_id: e.target.value }))} style={{ width: '100%' }} placeholder="Ej: 1143221..." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Correo Institucional</label>
              <input className="input-premium" type="email" value={form.email} required onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Programa Académico</label>
              <select className="input-premium" value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} style={{ width: '100%', background: 'white' }}>
                <option value="">Seleccionar programa</option>
                {Object.entries(dbPrograms).map(([cat, items]) => (
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
                  <optgroup label="Estudiantes">
                    <option value="ESTUDIANTE">Estudiante</option>
                    <option value="EGRESADO">Egresado / Alumni</option>
                  </optgroup>
                  <optgroup label="Docentes">
                    <option value="PROFESOR">Profesor</option>
                  </optgroup>
                  <optgroup label="Gestión Académica">
                    <option value="COORD_ACADEMICO">Coordinador Académico</option>
                    <option value="DIRECTOR_PROGRAMA">Director de Programa</option>
                    <option value="SECRETARIA_ACADEMICA">Secretaría Académica</option>
                    <option value="ADMISIONES">Admisiones</option>
                  </optgroup>
                  <optgroup label="Gestión Financiera">
                    <option value="CARTERA">Cartera / Cobros</option>
                  </optgroup>
                  <optgroup label="Gestión de Bienestar">
                    <option value="BIENESTAR">Bienestar Universitario</option>
                  </optgroup>
                  <optgroup label="Seguridad y Admin">
                    <option value="VALIDADOR">Validador / Guardia</option>
                    <option value="ADMIN">Administrador del Sistema</option>
                  </optgroup>
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

            {/* FECHA DE INGRESO → determina el semestre automáticamente SOLO para estudiantes */}
            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                {form.role === 'ESTUDIANTE' ? '📅 Fecha de Ingreso Institucional' : '📅 Fecha de Vinculación'}
              </label>
              <input
                className="input-premium"
                type="date"
                value={form.entry_date}
                onChange={e => setForm(p => ({ ...p, entry_date: e.target.value }))}
                style={{ width: '100%' }}
              />
              {form.role === 'ESTUDIANTE' && form.entry_date && (() => {
                const entry = new Date(form.entry_date);
                const now = new Date();
                const semActual = now.getMonth() >= 6 ? 2 : 1;
                const semIngreso = entry.getMonth() >= 6 ? 2 : 1;
                const num = Math.max(1, (now.getFullYear() - entry.getFullYear()) * 2 + semActual - semIngreso + 1);
                const label = `${num}${num === 1 || num === 3 ? 'er' : 'o'} Semestre`;
                return (
                  <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                    → Semestre calculado: <strong>{label}</strong>
                  </p>
                );
              })()}
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
/* ─── SECCIÓN REPORTES (ANALYTICS) ──────────────────────────────── */
const ReportesSection = () => {
  return <GlobalAnalytics />;
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

      <div className="responsive-grid-3" style={{ marginBottom: '32px' }}>
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

      <div className="responsive-grid-2">
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


/* ─── ADMIN DASHBOARD PRINCIPAL ─────────────────────────────────── */
const AdminDashboard = () => {
  const { 
    users, 
    logs, 
    loading, 
    stats, 
    fetchUsers, 
    fetchLogs, 
    updateUser 
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeNav, setActiveNav] = useState('estudiantes');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchUsers();
    fetchLogs();

    // Realtime logs
    const channel = supabase
      .channel('access_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'access_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUsers, fetchLogs, navigate]);

  // Eliminamos fetchStudents y fetchLogs locales ya que useAdmin los provee.

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
      ID: s.id,
      Nombre: s.name,
      Email: s.email,
      Documento: s.document_id || 'N/A',
      Rol: s.role,
      Programa: s.program || 'N/A',
      Estado: s.status,
      Semestre: s.semester || 'N/A',
      Ingreso: s.entry_date || 'N/A',
      Fecha_Creacion: new Date(s.created_at).toLocaleDateString()
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Identidades_Completas");
    XLSX.writeFile(wb, `UniSalamanca_Directorio_Premium_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          const { error } = await supabase.from('user').insert([{
            ...userData,
            must_change_password: true
          }]);
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
    await updateUser(student.id, { status: newStatus });
  };

  const filtered = users.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.document_id || '').includes(searchTerm);
    const matchesRole = filterRole === 'ALL' || s.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const navItems = [
    {
      title: 'Sistema Core',
      items: [
        { id: 'estudiantes', icon: <Users size={18} />, label: 'Inicio / Directorio' },
        { id: 'validacion_fotos', icon: <ImageIcon size={18} />, label: 'Validación de Fotos' },
        { id: 'curriculum', icon: <BookOpen size={18} />, label: 'Pénsum Institucional' },
        { id: 'reportes', icon: <BarChart2 size={18} />, label: 'Reportes' },
        { id: 'seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
      ]
    },
    {
      title: 'Ayuda y Soporte',
      items: [
        { id: 'salmi_chat', icon: <Sparkles size={18} />, label: 'Asistente Salmi AI', onClick: () => window.dispatchEvent(new CustomEvent('open-salmi-chat')) },
      ]
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      logout={logout}
      navigate={navigate}
    >
      {/* MODALES */}
      {editingStudent && (
        <UserFormModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={handleSaveUser} />
      )}
      {showCreateModal && (
        <UserFormModal onClose={() => setShowCreateModal(false)} onSave={handleSaveUser} />
      )}

      {activeNav === 'reportes' && <ReportesSection users={users} logs={logs} />}
      {activeNav === 'validacion_fotos' && <PhotoValidationModule />}
      {activeNav === 'seguridad' && <SeguridadSection students={users} logs={logs} />}
      {activeNav === 'curriculum' && <CurriculumView />}

      {activeNav === 'estudiantes' && (
        <div className="section-reveal">
          {/* HEADER SECTION - PREMIUM LOOK */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '48px', 
            padding: '0 8px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span style={{ 
                background: 'rgba(7, 137, 178, 0.1)', 
                color: 'var(--primary)', 
                padding: '6px 14px', 
                borderRadius: '100px', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                display: 'inline-block'
              }}>
                Panel de Control Central
              </span>
              <h1 style={{ 
                fontSize: '2.8rem', 
                fontWeight: 900, 
                color: '#0f172a', 
                margin: 0, 
                letterSpacing: '-1.5px',
                lineHeight: 1
              }}>
                Administración <span style={{ color: 'var(--primary)' }}>Digital</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '8px', fontWeight: 500 }}>
                Bienvenido, gestiona identidades y recursos académicos.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary-premium" style={{ 
                padding: '16px 28px', 
                borderRadius: '18px', 
                fontSize: '0.95rem',
                boxShadow: '0 10px 25px -5px rgba(7, 137, 178, 0.3)'
              }}>
                <UserPlus size={20} style={{ marginRight: '8px' }} /> Nuevo Registro
              </button>
              
              <div style={{ display: 'flex', background: 'white', padding: '6px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                 <button className="btn-secondary-premium" onClick={handleExport} style={{ border: 'none', background: 'transparent' }}>
                   <FileUp size={18} />
                 </button>
                 <div style={{ width: '1px', background: '#e2e8f0', margin: '8px 4px' }} />
                 <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <Upload size={18} color="#64748b" />
                    <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" disabled={isUploading} />
                 </label>
              </div>
            </div>
          </div>

          {/* QUICK STATS - GLASSMORPHISM CARDS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px', 
            marginBottom: '48px' 
          }}>
            {[
              { label: 'Total de Identidades', value: stats.total, sub: 'Usuarios en DB', icon: <Users size={24} />, color: '#0f172a', trend: '+12%' },
              { label: 'Cuerpo Académico', value: stats.academia, sub: 'Docentes y Coords', icon: <GraduationCap size={24} />, color: '#7c3aed', trend: 'Activos' },
              { label: 'Seguridad Campus', value: stats.validators, sub: 'Puntos de Acceso', icon: <Shield size={24} />, color: '#0891b2', trend: 'Online' },
            ].map((s, i) => (
              <div key={i} className="premium-card" style={{ 
                padding: '32px', 
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.02), 0 10px 10px -5px rgba(0,0,0,0.01)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-10px', 
                  right: '-10px', 
                  width: '100px', 
                  height: '100px', 
                  background: `radial-gradient(circle, ${s.color}10 0%, transparent 70%)`,
                  borderRadius: '50%'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: `${s.color}10`, 
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    color: s.color === '#0f172a' ? '#16a34a' : s.color,
                    background: `${s.color}08`,
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    {s.trend}
                  </span>
                </div>
                
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                <h2 style={{ margin: '4px 0', fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>{s.value}</h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* SEARCH & FILTERS SECTION */}
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '24px', 
            border: '1px solid #f1f5f9', 
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, correo o ID..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '16px 16px 16px 52px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  outline: 'none', 
                  fontSize: '1rem',
                  background: '#f8fafc',
                  transition: 'all 0.2s'
                }}
                className="search-input-focus"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Filter size={16} color="#64748b" style={{ marginRight: '10px' }} />
                <select 
                  value={filterRole} 
                  onChange={e => setFilterRole(e.target.value)}
                  style={{ background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.9rem', color: '#475569', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="ALL">Todos los Roles</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                  <option value="PROFESOR">Docentes</option>
                  <option value="ADMIN">Administradores</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Layers size={16} color="#64748b" style={{ marginRight: '10px' }} />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)}
                  style={{ background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.9rem', color: '#475569', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="ALL">Estado: Todos</option>
                  <option value="Active">🟢 Activos</option>
                  <option value="Suspended">🔴 Suspendidos</option>
                </select>
              </div>

              <button 
                className="btn-secondary-premium" 
                onClick={() => { setSearchTerm(''); setFilterRole('ALL'); setFilterStatus('ALL'); }}
                style={{ padding: '0 20px', borderRadius: '16px' }}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* DIRECTORY TABLE - PREMIUM STYLE */}
          <div className="premium-table-container" style={{ 
            background: 'white', 
            borderRadius: '24px', 
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              padding: '24px 32px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>Directorio Maestro</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>{filtered.length} usuarios encontrados</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button className="admin-nav-item" style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}>
                   <Settings size={18} />
                 </button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    {['USUARIO / IDENTIDAD', 'PROGRAMA / ÁREA', 'ROL', 'ESTADO', 'GESTIÓN'].map(h => <th key={h} style={{ padding: '16px 32px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} style={{ transition: 'background 0.2s' }}>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ 
                            width: '46px', 
                            height: '46px', 
                            borderRadius: '16px', 
                            background: `linear-gradient(135deg, ${s.role === 'PROFESOR' ? '#7c3aed' : '#0ea5e9'}20, #fff)`,
                            color: s.role === 'PROFESOR' ? '#7c3aed' : '#0ea5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            border: '1px solid rgba(0,0,0,0.03)'
                          }}>
                            {(s.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: 0 }}>{s.name}</p>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, fontWeight: 500 }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>{s.program || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '10px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          background: s.role === 'ADMIN' ? '#fef2f2' : s.role === 'PROFESOR' ? '#f5f3ff' : '#eff6ff',
                          color: s.role === 'ADMIN' ? '#ef4444' : s.role === 'PROFESOR' ? '#7c3aed' : '#3b82f6',
                        }}>
                          {s.role}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="pulse-dot" style={{ 
                            width: '8px', 
                            height: '8px', 
                            background: s.status === 'Active' ? '#16a34a' : '#ef4444',
                            borderRadius: '50%',
                            boxShadow: `0 0 0 4px ${s.status === 'Active' ? '#16a34a' : '#ef4444'}20`
                          }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{s.status === 'Active' ? 'Activo' : 'Suspendido'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingStudent(s)} className="admin-nav-item" style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => toggleStatus(s)} className="admin-nav-item" style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', color: s.status === 'Active' ? '#ef4444' : '#16a34a' }}>
                            {s.status === 'Active' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <SalmiChatbot />
    </DashboardLayout>
  );
};

export default AdminDashboard;
