import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Users, 
  UserPlus, 
  FileUp, 
  Search, 
  LogOut, 
  TrendingUp, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/');
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .neq('role', 'ADMIN')
      .order('created_at', { ascending: false });

    if (!error) {
      setStudents(data);
      const active = data.filter(s => s.status === 'Active').length;
      const suspended = data.filter(s => s.status === 'Suspended').length;
      setStats({ total: data.length, active, suspended });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsUploading(true);

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      for (let row of data) {
        // En un caso real, haríamos un upsert masivo
        await supabase.from('user').insert({
          email: row.Email,
          name: row.Nombre,
          program: row.Programa,
          status: 'Active',
          role: 'ESTUDIANTE'
        });
      }
      
      setIsUploading(false);
      fetchStudents();
    };
    reader.readAsBinaryString(file);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>UniSalamanca</h2>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ADMIN PORTAL</p>
        </div>
        <nav style={{ flex: 1, padding: '20px' }}>
          <ul style={{ list-style: 'none' }}>
            <li style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px' }}>
              <Users size={18} style={{ marginRight: '10px' }} /> Estudiantes
            </li>
            <li style={{ padding: '12px', color: '#94a3b8' }}>
              <TrendingUp size={18} style={{ marginRight: '10px' }} /> Reportes
            </li>
          </ul>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center' }}>
            <LogOut size={18} style={{ marginRight: '10px' }} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="content">
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Gestión de Estudiantes</h1>
            <p style={{ color: '#64748b' }}>Panel central de identidad digital</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
             <label className="btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FileUp size={18} style={{ marginRight: '10px' }} /> Carga Masiva
                <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx,.csv" />
             </label>
             <button className="btn-primary" onClick={() => alert('Próximamente')}>
                <UserPlus size={18} style={{ marginRight: '10px' }} /> Nuevo Usuario
             </button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
           <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>TOTAL ESTUDIANTES</p>
              <h3 style={{ fontSize: '2rem', margin: '5px 0' }}>{stats.total}</h3>
              <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '0.8rem' }}>
                 <TrendingUp size={14} style={{ marginRight: '5px' }} /> +12% este mes
              </div>
           </div>
           <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>CUENTAS ACTIVAS</p>
              <h3 style={{ fontSize: '2rem', margin: '5px 0', color: '#10b981' }}>{stats.active}</h3>
              <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', width: 'fit-content' }}>OPERATIVO</div>
           </div>
           <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>SUSPENDIDAS</p>
              <h3 style={{ fontSize: '2rem', margin: '5px 0', color: '#ef4444' }}>{stats.suspended}</h3>
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', width: 'fit-content' }}>REQUERIDAS DE ACCIÓN</div>
           </div>
        </section>

        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden' }}>
           <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '400px' }}>
                 <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
                 <input 
                    type="text" 
                    placeholder="Buscar por nombre o email..." 
                    style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: '#64748b' }}>ESTUDIANTE</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: '#64748b' }}>PROGRAMA</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: '#64748b' }}>ESTADO</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: '#64748b' }}>ACCIONES</th>
                 </tr>
              </thead>
              <tbody>
                 {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                       <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={{ width: '32px', height: '32px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 700 }}>
                                {s.name.charAt(0)}
                             </div>
                             <div>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.email}</p>
                             </div>
                          </div>
                       </td>
                       <td style={{ padding: '16px 24px', fontSize: '0.85rem' }}>{s.program}</td>
                       <td style={{ padding: '16px 24px' }}>
                          <span style={{ 
                             padding: '4px 10px', 
                             borderRadius: '8px', 
                             fontSize: '0.75rem', 
                             fontWeight: 600,
                             background: s.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                             color: s.status === 'Active' ? '#10b981' : '#ef4444'
                          }}>
                             {s.status}
                          </span>
                       </td>
                       <td style={{ padding: '16px 24px' }}>
                          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}><MoreVertical size={18} /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
