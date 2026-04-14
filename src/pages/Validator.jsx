import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { LogOut, ShieldAlert, CheckCircle, XCircle, Scan, AlertTriangle, UserCheck, Camera, RotateCcw, Activity, Clock, Users, Check, RefreshCw, History, Search, Ban, Unlock, FileText, Bell, MapPin, Filter, Download, Calendar, AlertCircle, Building } from 'lucide-react';

const Validator = () => {
  const [scanResult, setScanResult] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, denied: 0 });
  const [recentScans, setRecentScans] = useState([]);
  const [activeModule, setActiveModule] = useState('scanner');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedZone, setSelectedZone] = useState('ENTRADA PRINCIPAL');
  const [alerts, setAlerts] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [filterDate, setFilterDate] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const scannerRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const lastScanTime = useRef(0);

  const zones = ['ENTRADA PRINCIPAL', 'BIBLIOTECA', 'CAFETERÍA', 'LABORATORIO', 'GIMNASIO', 'ADMINISTRACIÓN'];

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    startScanner();
    fetchStats();
    loadCameras();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const loadCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setCurrentCamera(devices[0].id);
      }
    } catch (err) {
      console.log("Camera access error:", err);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStart = `${today}T00:00:00`;
    
    const { count: total } = await supabase
      .from('access_logs')
      .select('*', { count: 'exact', head: true });

    const { count: todayCount } = await supabase
      .from('access_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart);

    const { count: deniedCount } = await supabase
      .from('access_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'DENIED');

    setStats({ 
      total: total || 0, 
      today: todayCount || 0, 
      denied: deniedCount || 0 
    });
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    let query = supabase
      .from('access_logs')
      .select('*, user:user(name, program, photo_url)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('created_at', `${today}T00:00:00`);
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    }

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus === 'granted' ? 'GRANTED' : 'DENIED');
    }

    const { data, error } = await query;
    if (!error && data) {
      setHistory(data);
    }
    setHistoryLoading(false);
  };

  const searchStudent = async () => {
    if (!searchQuery.trim()) return;
    
    const { data: student, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', searchQuery.trim())
      .single();

    if (error || !student) {
      setSearchResult({ notFound: true });
    } else {
      setSearchResult(student);
    }
  };

  const manualAccess = async (grantAccess) => {
    if (!searchResult || searchResult.notFound) return;

    await supabase.from('access_logs').insert({
      user_id: searchResult.id,
      status: grantAccess ? 'GRANTED' : 'DENIED',
      location: selectedZone,
      reason: grantAccess ? 'MANUAL_APPROVAL' : 'MANUAL_DENIAL'
    });

    playSound(grantAccess ? 'success' : 'error');
    setScanResult({
      success: grantAccess,
      message: grantAccess ? "ACCESO PERMITIDO" : "ACCESO DENEGADO",
      sub: grantAccess ? "Acceso manual aprobado" : "Acceso manual denegado"
    });
    setStudentData(searchResult);
    setSearchResult(null);
    setSearchQuery('');
    fetchStats();
  };

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from('access_logs')
      .select('*')
      .eq('status', 'DENIED')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setAlerts(data);
  };

  const fetchBlockedUsers = async () => {
    const { data } = await supabase
      .from('user')
      .select('*')
      .eq('status', 'Blocked')
      .order('name', { ascending: true });
    
    if (data) setBlockedUsers(data);
  };

  const toggleUserBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
    await supabase
      .from('user')
      .update({ status: newStatus })
      .eq('id', userId);
    
    fetchBlockedUsers();
    fetchStats();
  };

  const exportReport = () => {
    const csv = [
      ['Fecha', 'Usuario', 'Programa', 'Estado', 'Ubicación', 'Razón'].join(','),
      ...history.map(h => [
        new Date(h.created_at).toLocaleString(),
        h.user?.name || 'N/A',
        h.user?.program || 'N/A',
        h.status,
        h.location,
        h.reason || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_accesos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    if (activeModule === 'history') fetchHistory();
    if (activeModule === 'alerts') fetchAlerts();
    if (activeModule === 'block') fetchBlockedUsers();
  }, [activeModule, filterDate, filterStatus]);

  const switchCamera = async (cameraId) => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    setCurrentCamera(cameraId);
    setShowCameraMenu(false);
    await startScanner(cameraId);
  };

  const startScanner = async (cameraId = null) => {
    try {
      const cameraToUse = cameraId || currentCamera || { facingMode: "environment" };
      await scannerRef.current.start(
        cameraToUse,
        { fps: 10, qrbox: { width: 280, height: 280 } },
        onScanSuccess
      );
    } catch (err) {
      console.error("Scanner error:", err);
    }
  };

  const playSound = (type) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const onScanSuccess = async (decodedText) => {
    const now = Date.now();
    if (now - lastScanTime.current < 3000) return;
    lastScanTime.current = now;

    try {
      const parts = decodedText.split('|');
      if (parts[0] !== 'UNIS' || parts.length !== 3) throw new Error("QR No institucional");

      const studentId = parts[1];
      const receivedBlock = parseInt(parts[2]);
      const currentBlock = Math.floor(Date.now() / 30000);

      await scannerRef.current.stop();
      setIsScanning(false);

      const diff = Math.abs(currentBlock - receivedBlock);
      if (diff > 1) {
        playSound('error');
        setScanResult({ success: false, message: "CÓDIGO EXPIRADO", sub: "Captura detectada. Pida al usuario que actualice su carnet." });
        
        await supabase.from('access_logs').insert({
          user_id: studentId,
          status: 'DENIED',
          location: selectedZone,
          reason: 'EXPIRED_QR'
        });
        return;
      }

      const { data: student, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', studentId)
        .single();
      
      if (error || !student) throw new Error("Estudiante no registrado");

      if (student.status !== 'Active') {
        playSound('error');
        setScanResult({ success: false, message: `ACCESO DENEGADO`, sub: `Estado de la cuenta: ${student.status}` });
        setStudentData(student);

        await supabase.from('access_logs').insert({
          user_id: studentId,
          status: 'DENIED',
          location: selectedZone,
          reason: 'INACTIVE_STATUS'
        });
        return;
      }

      playSound('success');
      setScanResult({ success: true, message: "ACCESO PERMITIDO", sub: "Verificación de identidad exitosa" });
      setStudentData(student);

await supabase.from('access_logs').insert({
          user_id: studentId,
          status: 'GRANTED',
          location: selectedZone
        });

      setRecentScans(prev => {
        const newScan = {
          id: Date.now(),
          name: student.name,
          program: student.program,
          time: new Date().toLocaleTimeString(),
          status: 'GRANTED'
        };
        return [newScan, ...prev].slice(0, 5);
      });

      fetchStats();

    } catch (err) {
      playSound('error');
      setScanResult({ success: false, message: "ACCESO DENEGADO", sub: err.message });
      
      await supabase.from('access_logs').insert({
        user_id: 'unknown',
        status: 'DENIED',
        location: selectedZone,
        reason: err.message
      });
    }
  };

  const resetScanner = async () => {
    setScanResult(null);
    setStudentData(null);
    setIsScanning(true);
    await startScanner();
  };

return (
    <div className="validator-layout">
      <div className="validator-bg">
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="grid-pattern"></div>
      </div>

      <header className="validator-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
             <ShieldAlert size={20} color="var(--primary)" />
          </div>
          <h2 className="brand-title">
            <span className="text-secondary">Uni</span>Salamanca
            <span className="module-badge">VALIDADOR</span>
          </h2>
        </div>
        
        <div className="header-actions">
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            <span>LIVE</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={16} /> <span>SALIR</span>
          </button>
        </div>
      </header>

      <div className="validator-main">
        <aside className="stats-sidebar">
          <div className="module-nav">
            <button className={`nav-btn ${activeModule === 'scanner' ? 'active' : ''}`} onClick={() => setActiveModule('scanner')}>
              <Scan size={20} /> <span>Escáner</span>
            </button>
            <button className={`nav-btn ${activeModule === 'search' ? 'active' : ''}`} onClick={() => setActiveModule('search')}>
              <Search size={20} /> <span>Búsqueda</span>
            </button>
            <button className={`nav-btn ${activeModule === 'history' ? 'active' : ''}`} onClick={() => setActiveModule('history')}>
              <History size={20} /> <span>Historial</span>
            </button>
            <button className={`nav-btn ${activeModule === 'alerts' ? 'active' : ''}`} onClick={() => setActiveModule('alerts')}>
              <Bell size={20} /> <span>Alertas</span>
              {alerts.length > 0 && <span className="nav-badge">{alerts.length}</span>}
            </button>
            <button className={`nav-btn ${activeModule === 'block' ? 'active' : ''}`} onClick={() => setActiveModule('block')}>
              <Ban size={20} /> <span>Bloqueos</span>
            </button>
          </div>

          <div className="zone-selector">
            <MapPin size={16} />
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div className="sidebar-header">
            <Activity size={20} />
            <span>Estadísticas</span>
          </div>
          
          <div className="stat-card highlight">
            <div className="stat-icon"><Users size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.today}</span>
              <span className="stat-label">Hoy</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon"><Clock size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="stat-card denied">
            <div className="stat-icon"><XCircle size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.denied}</span>
              <span className="stat-label">Denegados</span>
            </div>
          </div>

          <div className="recent-scans">
            <h4>Recientes</h4>
            {recentScans.length === 0 ? (
              <p className="no-scans">Sin escaneos recientes</p>
            ) : (
              <ul className="scan-list">
                {recentScans.map(scan => (
                  <li key={scan.id} className="scan-item">
                    <Check size={14} className="scan-check" />
                    <div className="scan-info">
                      <span className="scan-name">{scan.name.split(' ')[0]}</span>
                      <span className="scan-time">{scan.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="main-content">
          {activeModule === 'scanner' && (
            <div className="scanner-view">
              <div className="scanner-controls">
                <div className="scanner-instruction">
                  <div className="pulse-icon"><Scan size={28} /></div>
                  <h3>Escáner de Seguridad</h3>
                  <p>Apunta al código QR del carnet digital</p>
                </div>
                
                <div className="camera-controls">
                  {cameras.length > 1 && (
                    <div className="camera-selector">
                      <button className="camera-btn" onClick={() => setShowCameraMenu(!showCameraMenu)}>
                        <RefreshCw size={18} /><span>Cámara</span>
                      </button>
                      {showCameraMenu && (
                        <div className="camera-menu">
                          {cameras.map((cam, idx) => (
                            <button key={cam.id} className={`camera-option ${currentCamera === cam.id ? 'active' : ''}`} onClick={() => { setCurrentCamera(cam.id); setShowCameraMenu(false); startScanner(cam.id); }}>
                              <Camera size={16} /><span>Cámara {idx + 1}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button className="reset-btn" onClick={resetScanner}><RotateCcw size={18} /></button>
                </div>
              </div>

              <div className="scanner-frame-wrapper">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
                {isScanning && <div className="radar-line"></div>}
                {isScanning && <div className="radar-line radar-2"></div>}
                <div className="scanner-box"><div id="reader" style={{ width: '100%', height: '100%' }}></div></div>
                <div className="scanner-overlay-hint"><Camera size={16} /><span>Posicione el código QR dentro del marco</span></div>
              </div>
            </div>
          )}

          {activeModule === 'search' && (
            <div className="search-view">
              <div className="view-header">
                <h2><Search size={24} /> Búsqueda Manual</h2>
                <p>Busca un estudiante por su ID para otorgar o denegar acceso manualmente</p>
              </div>
              
              <div className="search-box">
                <input type="text" placeholder="Ingrese ID del estudiante" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchStudent()} />
                <button className="search-btn" onClick={searchStudent}><Search size={20} /></button>
              </div>

              {searchResult && (
                <div className="search-result-card">
                  {searchResult.notFound ? (
                    <div className="not-found"><AlertCircle size={48} /><h3>Estudiante no encontrado</h3><p>No existe un estudiante con ese ID</p></div>
                  ) : (
                    <>
                      <div className="student-info-card">
                        <div className="avatar-wrapper">
                          <img src={searchResult.photo_url || '/images/default-avatar.png'} alt="Foto" onError={(e) => { e.target.src = '/images/default-avatar.png'; }} />
                        </div>
                        <div className="student-details">
                          <h3 className="student-name">{searchResult.name}</h3>
                          <p className="student-program">{searchResult.program}</p>
                          <p className="student-doc">ID: {searchResult.id}</p>
                          <span className={`status-badge ${searchResult.status?.toLowerCase()}`}>{searchResult.status}</span>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button className="action-btn grant" onClick={() => manualAccess(true)}><CheckCircle size={20} /> PERMITIR</button>
                        <button className="action-btn deny" onClick={() => manualAccess(false)}><XCircle size={20} /> DENEGAR</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeModule === 'history' && (
            <div className="history-view">
              <div className="view-header">
                <h2><History size={24} /> Historial de Accesos</h2>
                <p>Consulta todos los registros de acceso</p>
              </div>
              
              <div className="history-filters">
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="all">Todo</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="granted">Permitidos</option>
                  <option value="denied">Denegados</option>
                </select>
                <button className="export-btn" onClick={exportReport}><Download size={18} /> Exportar</button>
              </div>

              <div className="history-list">
                {historyLoading ? (
                  <div className="loading">Cargando...</div>
                ) : history.length === 0 ? (
                  <div className="empty">No hay registros</div>
                ) : (
                  history.map(log => (
                    <div key={log.id} className={`history-item ${log.status.toLowerCase()}`}>
                      <div className="history-avatar">
                        <img src={log.user?.photo_url || '/images/default-avatar.png'} alt="" onError={(e) => { e.target.src = '/images/default-avatar.png'; }} />
                      </div>
                      <div className="history-info">
                        <span className="history-name">{log.user?.name || 'Desconocido'}</span>
                        <span className="history-program">{log.user?.program || ''}</span>
                      </div>
                      <div className="history-meta">
                        <span className={`history-status ${log.status.toLowerCase()}`}>{log.status === 'GRANTED' ? 'Permitido' : 'Denegado'}</span>
                        <span className="history-location"><MapPin size={12} /> {log.location}</span>
                        <span className="history-time">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeModule === 'alerts' && (
            <div className="alerts-view">
              <div className="view-header">
                <h2><Bell size={24} /> Alertas de Seguridad</h2>
                <p>Accesos denegados y alertas recientes</p>
              </div>
              
              <div className="alerts-list">
                {alerts.length === 0 ? (
                  <div className="empty">No hay alertas</div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="alert-item">
                      <AlertCircle size={20} className="alert-icon" />
                      <div className="alert-info">
                        <span className="alert-id">ID: {alert.user_id}</span>
                        <span className="alert-location"><MapPin size={12} /> {alert.location}</span>
                        <span className="alert-reason">{alert.reason || 'Sin motivo especificado'}</span>
                      </div>
                      <span className="alert-time">{new Date(alert.created_at).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeModule === 'block' && (
            <div className="block-view">
              <div className="view-header">
                <h2><Ban size={24} /> Gestión de Bloqueos</h2>
                <p>Administra usuarios bloqueados</p>
              </div>
              
              <div className="blocked-list">
                {blockedUsers.length === 0 ? (
                  <div className="empty">No hay usuarios bloqueados</div>
                ) : (
                  blockedUsers.map(user => (
                    <div key={user.id} className="blocked-item">
                      <div className="blocked-avatar">
                        <img src={user.photo_url || '/images/default-avatar.png'} alt="" onError={(e) => { e.target.src = '/images/default-avatar.png'; }} />
                      </div>
                      <div className="blocked-info">
                        <span className="blocked-name">{user.name}</span>
                        <span className="blocked-program">{user.program}</span>
                        <span className="blocked-id">ID: {user.id}</span>
                      </div>
                      <button className="unblock-btn" onClick={() => toggleUserBlock(user.id, user.status)}>
                        <Unlock size={18} /> Desbloquear
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {scanResult && (
        <div className="result-overlay slide-in">
           <div className={`result-card ${scanResult.success ? 'success' : 'error'}`}>
              <div className="result-decoration"></div>
              <div className="result-icon-container">
                 {scanResult.success ? (
                   <div className="success-ring"><CheckCircle size={60} strokeWidth={2.5} /></div>
                 ) : (
                   <AlertTriangle size={60} strokeWidth={2.5} />
                 )}
                 <div className="icon-glow"></div>
              </div>
              <div className="result-content">
                <h2 className="result-title">{scanResult.message}</h2>
                <p className="result-subtitle">{scanResult.sub}</p>
                {studentData && (
                  <div className="student-info-card">
                    <div className="avatar-wrapper">
                      <img src={studentData.photo_url || '/images/default-avatar.png'} alt="Foto Estudiante" onError={(e) => { e.target.src = '/images/default-avatar.png'; }} />
                      {scanResult.success && <div className="avatar-status-badge"><UserCheck size={14} /></div>}
                    </div>
                    <div className="student-details">
                      <h3 className="student-name">{studentData.name}</h3>
                      <p className="student-program">{studentData.program}</p>
                      <p className="student-doc">ID: {studentData.id}</p>
                    </div>
                  </div>
                )}
              </div>
              <button className="continue-btn" onClick={resetScanner}>CONTINUAR ESCANEO <Scan size={18} /></button>
           </div>
        </div>
      )}

      {scanResult && (
        <div className="result-overlay slide-in">
           <div className={`result-card ${scanResult.success ? 'success' : 'error'}`}>
              <div className="result-decoration"></div>
              
              <div className="result-icon-container">
                 {scanResult.success ? (
                   <div className="success-ring">
                     <CheckCircle size={60} strokeWidth={2.5} />
                   </div>
                 ) : (
                   <AlertTriangle size={60} strokeWidth={2.5} />
                 )}
                 <div className="icon-glow"></div>
              </div>
              
              <div className="result-content">
                <h2 className="result-title">{scanResult.message}</h2>
                <p className="result-subtitle">{scanResult.sub}</p>

                {studentData && (
                  <div className="student-info-card">
                    <div className="avatar-wrapper">
                      <img 
                        src={studentData.photo_url || '/images/default-avatar.png'} 
                        alt="Foto Estudiante" 
                        onError={(e) => { e.target.src = '/images/default-avatar.png'; }}
                      />
                      {scanResult.success && <div className="avatar-status-badge"><UserCheck size={14} /></div>}
                    </div>
                    <div className="student-details">
                      <h3 className="student-name">{studentData.name}</h3>
                      <p className="student-program">{studentData.program}</p>
                      <p className="student-doc">ID: {studentData.id}</p>
                    </div>
                  </div>
                )}
              </div>

              <button className="continue-btn" onClick={resetScanner}>
                CONTINUAR ESCANEO <Scan size={18} />
              </button>
           </div>
        </div>
      )}

      <style>{`
        .validator-layout {
          min-height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        .validator-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(22, 182, 214, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22, 182, 214, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.5;
        }

        .orbit {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: floatOrb 15s infinite alternate ease-in-out;
        }

        .orbit-1 {
          width: 400px;
          height: 400px;
          background: rgba(22, 182, 214, 0.4);
          top: -100px;
          left: -100px;
        }

        .orbit-2 {
          width: 500px;
          height: 500px;
          background: rgba(42, 34, 102, 0.6);
          bottom: -200px;
          right: -100px;
          animation-delay: -5s;
        }

        @keyframes floatOrb {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(50px, 50px) scale(1.2); }
        }

        .validator-header {
          position: relative;
          z-index: 10;
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-icon-wrapper {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(22, 182, 214, 0.3);
        }

        .brand-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .text-secondary {
          color: var(--secondary);
        }

        .module-badge {
          background: rgba(22, 182, 214, 0.15);
          color: var(--secondary);
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          border: 1px solid rgba(22, 182, 214, 0.3);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 50px;
          color: #10b981;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .validator-main {
          flex: 1;
          display: flex;
          position: relative;
          z-index: 10;
        }

        .stats-sidebar {
          width: 280px;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          padding: 25px 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.9rem;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .stat-card.highlight {
          background: rgba(22, 182, 214, 0.1);
          border-color: rgba(22, 182, 214, 0.2);
        }

        .stat-card.denied {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .stat-card.denied .stat-icon {
          color: #ef4444;
        }

        .stat-icon {
          color: var(--secondary);
          background: rgba(22, 182, 214, 0.15);
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .recent-scans {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .recent-scans h4 {
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .no-scans {
          color: #64748b;
          font-size: 0.85rem;
          text-align: center;
          padding: 20px;
        }

        .scan-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .scan-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .scan-check {
          color: #10b981;
        }

        .scan-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .scan-name {
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .scan-time {
          color: #64748b;
          font-size: 0.7rem;
        }

        .scanner-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .scanner-controls {
          width: 100%;
          max-width: 450px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .scanner-instruction {
          text-align: left;
          animation: slideDownFade 0.6s ease-out forwards;
        }

        .pulse-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(22, 182, 214, 0.1);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          position: relative;
        }

        .pulse-icon::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid var(--secondary);
          opacity: 0;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
          0% { transform: scale(0.9); opacity: 1; }
        }

        .scanner-instruction h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .scanner-instruction p {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .camera-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }

        .camera-selector {
          position: relative;
        }

        .camera-btn, .reset-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .camera-btn:hover, .reset-btn:hover {
          background: rgba(22, 182, 214, 0.1);
          border-color: rgba(22, 182, 214, 0.3);
          color: var(--secondary);
        }

        .reset-btn {
          padding: 10px;
        }

        .camera-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 150px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .camera-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .camera-option:hover, .camera-option.active {
          background: rgba(22, 182, 214, 0.1);
          color: var(--secondary);
        }

        .scanner-frame-wrapper {
          position: relative;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 40px;
          backdrop-filter: blur(10px);
          animation: scaleUp 0.6s ease-out forwards;
          width: 100%;
          max-width: 380px;
          aspect-ratio: 1;
        }

        .corner {
          position: absolute;
          width: 50px;
          height: 50px;
          border-color: var(--secondary);
          border-style: solid;
          border-width: 0;
          z-index: 20;
          transition: all 0.3s;
        }

        .corner::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(22, 182, 214, 0.3);
          filter: blur(8px);
        }

        .corner.top-left { top: 0; left: 0; border-top-width: 4px; border-left-width: 4px; border-top-left-radius: 40px; }
        .corner.top-right { top: 0; right: 0; border-top-width: 4px; border-right-width: 4px; border-top-right-radius: 40px; }
        .corner.bottom-left { bottom: 0; left: 0; border-bottom-width: 4px; border-left-width: 4px; border-bottom-left-radius: 40px; }
        .corner.bottom-right { bottom: 0; right: 0; border-bottom-width: 4px; border-right-width: 4px; border-bottom-right-radius: 40px; }

        .radar-line {
          position: absolute;
          left: 12%;
          right: 12%;
          height: 2px;
          background: var(--secondary);
          box-shadow: 0 0 15 3px rgba(22, 182, 214, 0.4);
          z-index: 15;
          animation: scanRadar 2s linear infinite alternate;
        }

        .radar-2 {
          animation-delay: 1s;
        }

        @keyframes scanRadar {
          0% { top: 12%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }

        .scanner-box {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          background: black;
          box-shadow: inset 0 0 60px rgba(0,0,0,0.9);
        }

        .scanner-box video {
          object-fit: cover !important;
        }

        .scanner-overlay-hint {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          color: #94a3b8;
          font-size: 0.75rem;
          z-index: 25;
          animation: fadeInUp 1s ease-out 0.5s forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Result Modal */
        .result-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .slide-in .result-card {
           animation: slideUpBump 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes slideUpBump {
          from { opacity: 0; transform: translateY(60px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .result-card {
          background: white;
          width: 100%;
          max-width: 440px;
          border-radius: 30px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .result-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
        }

        .result-card.success .result-decoration {
          background: linear-gradient(90deg, #10b981, #34d399, #10b981);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
        }

        .result-card.error .result-decoration {
          background: linear-gradient(90deg, #ef4444, #f87171, #ef4444);
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
        }

        .result-icon-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        .result-card.success .result-icon-container {
          background: #ecfdf5;
        }
        
        .result-card.error .result-icon-container {
          background: #fef2f2;
          color: #ef4444;
        }

        .success-ring {
          animation: successPop 0.5s ease-out;
        }

        @keyframes successPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .icon-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          z-index: -1;
          animation: pulseGlow 2s infinite alternate;
        }

        .result-card.success .icon-glow {
          box-shadow: 0 0 50px rgba(16, 185, 129, 0.4);
        }

        .result-card.error .icon-glow {
          box-shadow: 0 0 50px rgba(239, 68, 68, 0.6);
        }

        @keyframes pulseGlow {
          from { transform: scale(1); opacity: 0.5; }
          to { transform: scale(1.3); opacity: 0; }
        }

        .result-content {
          margin-bottom: 30px;
        }

        .result-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .result-card.success .result-title { color: #065f46; }
        .result-card.error .result-title { color: #7f1d1d; }

        .result-subtitle {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 25px;
        }

        .student-info-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }

        .avatar-wrapper {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .avatar-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-status-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #10b981;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
        }

        .student-details {
          flex: 1;
        }

        .student-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .student-program {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin: 0 0 6px;
        }

        .student-doc {
          font-size: 0.75rem;
          color: #94a3b8;
          font-family: monospace;
          background: white;
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-block;
          border: 1px solid #e2e8f0;
        }

        .continue-btn {
          width: 100%;
          padding: 16px;
          border-radius: 15px;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .result-card.success .continue-btn {
          background: #10b981;
          color: white;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        
        .result-card.success .continue-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(16, 185, 129, 0.3);
        }

        .result-card.error .continue-btn {
          background: #ef4444;
          color: white;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
        }
        
        .result-card.error .continue-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 768px) {
          .stats-sidebar {
            display: none;
          }
        }

        /* Navigation */
        .module-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 15px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-btn:hover {
          background: rgba(22, 182, 214, 0.1);
          color: var(--secondary);
        }

        .nav-btn.active {
          background: rgba(22, 182, 214, 0.15);
          color: var(--secondary);
          border: 1px solid rgba(22, 182, 214, 0.3);
        }

        .nav-badge {
          margin-left: auto;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .zone-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 10px;
        }

        .zone-selector select {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        }

        .zone-selector select option {
          background: #1e293b;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .view-header {
          margin-bottom: 30px;
        }

        .view-header h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .view-header p {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        /* Search View */
        .search-box {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin-bottom: 30px;
        }

        .search-box input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
        }

        .search-box input::placeholder {
          color: #64748b;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(22, 182, 214, 0.1);
        }

        .search-btn {
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          background: var(--secondary);
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-btn:hover {
          background: #0e7490;
          transform: translateY(-2px);
        }

        .search-result-card {
          max-width: 500px;
          background: white;
          border-radius: 20px;
          padding: 30px;
          animation: slideUpBump 0.4s ease-out;
        }

        .not-found {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }

        .not-found svg {
          color: #ef4444;
          margin-bottom: 15px;
        }

        .not-found h3 {
          color: #1e293b;
          margin-bottom: 5px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-top: 8px;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.blocked {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.grant {
          background: #10b981;
          color: white;
        }

        .action-btn.grant:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .action-btn.deny {
          background: #ef4444;
          color: white;
        }

        .action-btn.deny:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        /* History View */
        .history-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
        }

        .history-filters select {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .history-filters select option {
          background: #1e293b;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid rgba(22, 182, 214, 0.3);
          background: rgba(22, 182, 214, 0.1);
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: rgba(22, 182, 214, 0.2);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .history-avatar {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          overflow: hidden;
        }

        .history-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .history-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .history-name {
          color: white;
          font-weight: 600;
        }

        .history-program {
          color: #64748b;
          font-size: 0.85rem;
        }

        .history-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .history-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .history-status.granted {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .history-status.denied {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .history-location, .history-time {
          color: #64748b;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .loading, .empty {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        /* Alerts View */
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: rgba(239, 68, 68, 0.08);
          border-radius: 16px;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .alert-icon {
          color: #ef4444;
        }

        .alert-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alert-id {
          color: white;
          font-weight: 600;
          font-family: monospace;
        }

        .alert-location, .alert-reason {
          color: #94a3b8;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .alert-time {
          color: #64748b;
          font-size: 0.8rem;
        }

        /* Block View */
        .blocked-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .blocked-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .blocked-avatar {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          overflow: hidden;
        }

        .blocked-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blocked-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blocked-name {
          color: white;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .blocked-program {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .blocked-id {
          color: #64748b;
          font-size: 0.8rem;
          font-family: monospace;
          margin-top: 4px;
        }

        .unblock-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .unblock-btn:hover {
          background: #10b981;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Validator;
