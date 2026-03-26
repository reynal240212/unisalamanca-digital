import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Plus, 
  Upload, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImg, setZoomImg] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, modalityFilter, statusFilter]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('role', 'ESTUDIANTE')
        .order('name');
      
      if (error) throw error;
      
      setStudents(data || []);
      updateStats(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (data) => {
    setStats({
      total: data.length,
      active: data.filter(s => s.status === 'Active').length,
      suspended: data.filter(s => s.status === 'Suspended').length
    });
  };

  const filterStudents = () => {
    let result = [...students];
    
    if (searchTerm) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (modalityFilter !== 'all') {
      result = result.filter(s => s.modality === modalityFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }
    
    setFilteredStudents(result);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showPhotoModal = (url) => {
    setZoomImg(url);
    setIsZoomOpen(true);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon">US</div>
          <span>UniSalamanca</span>
        </div>
        
        <nav>
          <ul>
            <li 
              className={activeTab === 'students' ? 'active' : ''} 
              onClick={() => setActiveTab('students')}
            >
              <Users size={20} className="icon" />
              <span>Estudiantes</span>
            </li>
            <li 
              className={activeTab === 'reports' ? 'active' : ''} 
              onClick={() => setActiveTab('reports')}
            >
              <BarChart2 size={20} className="icon" />
              <span>Reportes</span>
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''} 
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} className="icon" />
              <span>Ajustes</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'Administrador'}</p>
            <p className="user-role">Sede Central</p>
          </div>
          <button onClick={handleLogout} className="btn-icon-logout" title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        {activeTab === 'students' && (
          <section id="students-view">
            <header className="content-header">
              <div className="header-title">
                <h1>Gestión de Estudiantes</h1>
                <p className="subtitle">Administra los accesos y modalidades de estudio</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-secondary">
                  <Upload size={16} /> Subir Listado (Excel)
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="btn-primary"
                >
                  <Plus size={16} /> Nuevo Estudiante
                </button>
              </div>
            </header>

            <div className="toolbar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o correo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="action-select"
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
              >
                <option value="all">Todas las Modalidades</option>
                <option value="Presencial">Presencial</option>
                <option value="PAT">PAT</option>
              </select>
              <select 
                className="action-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los Estados</option>
                <option value="Active">Activos</option>
                <option value="Suspended">Suspendidos</option>
                <option value="Revoked">Revocados</option>
              </select>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setModalityFilter('all');
                  setStatusFilter('all');
                }}
              >
                Limpiar
              </button>
            </div>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Estudiantes</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-card success">
                <span className="stat-label">Identidades Activas</span>
                <span className="stat-value">{stats.active}</span>
              </div>
              <div className="stat-card danger">
                <span className="stat-label">Suspendidos</span>
                <span className="stat-value">{stats.suspended}</span>
              </div>
            </section>

            <section className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Estudiante</th>
                    <th>Programa</th>
                    <th>Modalidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Cargando estudiantes...</td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron estudiantes.</td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div 
                            className="student-thumb" 
                            onClick={() => showPhotoModal(student.photo_url || '/images/default-avatar.png')}
                          >
                            <img 
                              src={student.photo_url || '/images/default-avatar.png'} 
                              alt={student.name} 
                              onError={(e) => e.target.src = '/images/default-avatar.png'}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="student-row-info">
                            <span className="student-name">{student.name}</span>
                            <span className="student-sub">{student.email}</span>
                          </div>
                        </td>
                        <td>{student.program || 'N/A'}</td>
                        <td>
                          <span className={`badge ${student.modality === 'PAT' ? 'egresado' : 'active'}`}>
                            {student.modality}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${student.status.toLowerCase()}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-action" title="Editar"><Edit size={14} /></button>
                            <button className="btn-action" title="Eliminar"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </section>
        )}

        {/* Other tabs can be added here */}
      </main>

      {/* Photo Zoom Modal */}
      {isZoomOpen && (
        <div className="modal-overlay" onClick={() => setIsZoomOpen(false)}>
          <div className="photo-zoom-container" onClick={e => e.stopPropagation()}>
            <img src={zoomImg} alt="Zoom" />
            <button className="btn-close-zoom" onClick={() => setIsZoomOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
