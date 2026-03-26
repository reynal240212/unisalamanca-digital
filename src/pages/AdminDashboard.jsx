import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Users, UserPlus, FileUp, Search, LogOut, TrendingUp,
  MoreVertical, CheckCircle2, XCircle, ShieldCheck,
  BarChart2, Bell, Settings, ChevronDown, Upload
} from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, validators: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeNav, setActiveNav] = useState('estudiantes');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/login');
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('user').select('*').neq('role', 'ADMIN')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStudents(data);
      const active = data.filter(s => s.status === 'Active').length;
      const suspended = data.filter(s => s.status === 'Suspended').length;
      const validators = data.filter(s => s.role === 'VALIDADOR').length;
      setStats({ total: data.length, active, suspended, validators });
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
        await supabase.from('user').insert({
          email: row.Email, name: row.Nombre, program: row.Programa,
          status: 'Active', role: 'ESTUDIANTE'
        });
      }
      setIsUploading(false);
      fetchStudents();
    };
    reader.readAsBinaryString(file);
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
      
      {/* SIDEBAR */}
      <aside style={{
        width: '260px', background: 'var(--primary, #2A2266)', color: 'white',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
      }}>
        {/* Brand */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/images/escudo.png" alt="Logo" style={{ width: '36px', filter: 'brightness(0) invert(1)' }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>
                <span style={{ color: '#16B6D6' }}>Uni</span>Salamanca
              </div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
                Panel Administrativo
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              marginBottom: '4px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
              background: activeNav === item.id ? 'rgba(22,182,214,0.15)' : 'transparent',
              color: activeNav === item.id ? '#16B6D6' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s'
            }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: '#16B6D6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>
              {(user?.name || 'A').charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Administrador</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', background: 'rgba(248,113,113,0.1)', border: 'none',
            borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: 600, fontSize: '0.85rem'
          }}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>Gestión de Identidad</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>Panel central de identidad digital — UniSalamanca</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--primary, #2A2266)', color: 'white',
              padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
            }}>
              {isUploading ? '⏳ Cargando...' : <><Upload size={16} /> Carga Excel</>}
              <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" disabled={isUploading} />
            </label>
            <button onClick={fetchStudents} style={{
              background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 18px',
              borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#374151'
            }}>
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'ESTUDIANTES', value: stats.total, color: '#2A2266', bg: '#eef2ff', icon: <Users size={20} />, sub: 'Total inscritos' },
            { label: 'ACTIVOS', value: stats.active, color: '#16A34A', bg: '#f0fdf4', icon: <CheckCircle2 size={20} />, sub: 'Acceso habilitado' },
            { label: 'SUSPENDIDOS', value: stats.suspended, color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={20} />, sub: 'Requieren acción' },
            { label: 'VALIDADORES', value: stats.validators, color: '#16B6D6', bg: '#ecfeff', icon: <ShieldCheck size={20} />, sub: 'Agentes activos' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>{s.label}</p>
                <div style={{ width: '36px', height: '36px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Directorio de Usuarios</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{filtered.length} registros encontrados</p>
            </div>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 14px 10px 38px', borderRadius: '10px',
                  border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.85rem',
                  width: '300px', fontFamily: 'inherit', color: '#374151'
                }}
              />
            </div>
          </div>

          {/* Table */}
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
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  No hay registros. Carga un archivo Excel para comenzar.
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background='#fafafa'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        background: `hsl(${(s.name || 'A').charCodeAt(0) * 15}, 60%, 90%)`,
                        color: `hsl(${(s.name || 'A').charCodeAt(0) * 15}, 60%, 35%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem'
                      }}>
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
                    <span style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                      background: s.role === 'VALIDADOR' ? '#ecfeff' : '#eef2ff',
                      color: s.role === 'VALIDADOR' ? '#0891b2' : '#4338ca'
                    }}>{s.role || 'ESTUDIANTE'}</span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 700,
                      background: s.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                      color: s.status === 'Active' ? '#16a34a' : '#ef4444'
                    }}>{s.status === 'Active' ? '● Activo' : '● Suspendido'}</span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <button onClick={() => toggleStatus(s)} style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 700,
                      border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit',
                      background: 'transparent',
                      borderColor: s.status === 'Active' ? '#fca5a5' : '#86efac',
                      color: s.status === 'Active' ? '#ef4444' : '#16a34a'
                    }}>
                      {s.status === 'Active' ? 'Suspender' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
