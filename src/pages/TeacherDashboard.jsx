import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, MapPin, LogOut, Menu, Calendar, Scan, CheckCircle, XCircle, AlertCircle, Camera, RefreshCw, RotateCcw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getCurrentPosition, isInCampusPerimeter } from '../utils/geoUtils';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeClass, setActiveClass] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' o 'reports'
  const [reportData, setReportData] = useState({ stats: [], totalSessions: 0 });

  useEffect(() => {
    if (!user || user.role !== 'PROFESOR') {
      navigate('/login');
      return;
    }
    fetchMySubjects();
    const interval = setInterval(detectLiveClass, 60000); // Revisar cada minuto
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (subjects.length > 0) {
      detectLiveClass();
    }
  }, [subjects]);

  const detectLiveClass = () => {
    const daysArr = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const now = new Date();
    const currentDay = daysArr[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const live = subjects.find(s => {
      return (s.schedule_blocks || []).some(b => {
        if (b.day_of_week !== currentDay) return false;
        
        const [hStart, mStart] = b.start_time.split(':').map(Number);
        const [hEnd, mEnd] = b.end_time.split(':').map(Number);
        
        const startTimeInMin = hStart * 60 + mStart;
        const endTimeInMin = hEnd * 60 + mEnd;
        
        // Ventana: 15 min antes de empezar hasta el final
        return currentTime >= (startTimeInMin - 15) && currentTime <= endTimeInMin;
      });
    });

    setActiveClass(live || null);
  };

  const fetchMySubjects = async () => {
    setLoading(true);
    try {
      // 3NF: Consultar secciones académicas asignadas a este profesor
      const { data: sections, error: secError } = await supabase
        .from('academic_sections')
        .select(`
          id,
          subject:subjects(id, name, credits),
          period:academic_periods(name),
          blocks:schedule_blocks(*)
        `)
        .eq('teacher_id', user.id);

      if (secError) throw secError;

      // Adaptar al formato anterior
      const formatted = (sections || []).map(sec => ({
        id: sec.id,
        subject: sec.subject.name,
        subject_id: sec.subject.id,
        period: sec.period.name,
        credits: sec.subject.credits,
        schedule_blocks: sec.blocks || []
      }));
      
      setSubjects(formatted);
    } catch (err) {
      console.error("Error fetching academic load:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForSubject = async (section) => {
    setSelectedSubject(section);
    // 3NF: Obtener estudiantes de academic_enrollments para esta sección
    const { data: enrollments, error: enrError } = await supabase
      .from('academic_enrollments')
      .select(`
        student:public.user(id, name, email, program:academic_programs(name), semester)
      `)
      .eq('section_id', section.id)
      .eq('status', 'ACTIVE');

    if (enrError) { console.error(enrError); setStudents([]); return; }

    const studentsData = (enrollments || []).map(e => ({
      ...e.student,
      program: e.student.program?.name || 'Otro' // Adaptar para el UI
    }));
    
    setStudents(studentsData);
    fetchAttendanceStatus(section, studentsData.map(s => s.id));
    fetchReportData(section, studentsData);
  };

  const fetchReportData = async (section, studentsData) => {
    // 3NF: Traer historial de asistencia para esta sección
    const { data: history } = await supabase
      .from('attendance')
      .select('student_id, status, date')
      .eq('section_id', section.id);
    
    // Contar sesiones únicas
    const dates = [...new Set((history || []).map(h => h.date))];
    const totalSessions = dates.length || 1; 

    const stats = studentsData.map(s => {
      const studentHistory = (history || []).filter(h => h.student_id === s.id);
      const attendedCount = studentHistory.filter(h => h.status.includes('Presente')).length;
      return {
        ...s,
        attendedCount,
        percent: Math.round((attendedCount / totalSessions) * 100)
      };
    });

    setReportData({ stats, totalSessions });
  };

  const fetchAttendanceStatus = async (subject, studentIds) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('section_id', subject.id)
      .eq('date', today)
      .in('student_id', studentIds);
    
    const mapping = {};
    (data || []).forEach(a => mapping[a.student_id] = a.status);
    setAttendanceData(mapping);
  };

  const startAttendance = async () => {
    try {
      setLoading(true);
      const pos = await getCurrentPosition();
      setLocation(pos);
      const isInside = isInCampusPerimeter(pos.lat, pos.lng);
      setIsInPerimeter(isInside);
      setIsScanning(true);
      
      // Esperar a que el DOM se actualice para que exista el div #reader
      setTimeout(() => {
        const html5QrCode = new Html5Qrcode("attendance-reader");
        window.attendanceScanner = html5QrCode;
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanFailure
        );
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Error al iniciar escáner o GPS: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const stopAttendance = async () => {
    if (window.attendanceScanner) {
      await window.attendanceScanner.stop();
      delete window.attendanceScanner;
    }
    setIsScanning(false);
    setScanResult(null);
  };

  const onScanSuccess = async (decodedText) => {
    // Formato: UNIS|ID|BLOCK
    const parts = decodedText.split('|');
    if (parts[0] !== 'UNIS' || parts.length < 3) {
      setScanResult({ success: false, message: "Código QR Inválido" });
      return;
    }

    const studentId = parts[1];

    if (selectedStudent && selectedStudent.id !== studentId) {
      setScanResult({ 
        success: false, 
        message: "Identidad Incorrecta", 
        sub: `Este QR pertenece a otro estudiante, no a ${selectedStudent.name}` 
      });
      return;
    }

    markAttendance(studentId);
  };

  const onScanFailure = (error) => {
    // No hacer nada, es ruidoso
  };

  const markAttendance = async (studentId) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si ya tiene asistencia hoy para esta sección
    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('section_id', activeClass.id)
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      setScanResult({ success: false, message: "Asistencia ya registrada hoy", sub: studentId });
      return;
    }

    const { error } = await supabase.from('attendance').insert({
      student_id: studentId,
      teacher_id: user.id,
      section_id: activeClass.id,
      subject_id: activeClass.subject_id,
      status: 'Presente',
      latitude: location?.lat,
      longitude: location?.lng,
      is_in_perimeter: isInPerimeter,
      scanned_at: new Date().toISOString(),
      date: today
    });

    if (error) {
      setScanResult({ success: false, message: "Error al registrar", sub: error.message });
    } else {
      setScanResult({ success: true, message: "Asistencia Exitosa", sub: studentId });
      setAttendanceData(prev => ({ ...prev, [studentId]: 'Presente' }));
      setTimeout(() => {
        setScanResult(null);
        if (selectedStudent) setSelectedStudent(null);
        if (isScanning) stopAttendance();
      }, 2500);
    }
  };

  const markManualAttendance = async (student) => {
    if (!activeClass) {
        alert("Debe haber una clase activa para validar asistencia");
        return;
    }
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('attendance').insert({
      student_id: student.id,
      teacher_id: user.id,
      section_id: activeClass.id,
      subject_id: activeClass.subject_id,
      status: 'Presente_Manual',
      date: today,
      is_in_perimeter: true, // Asumimos verificado por el docente presencialmente
      scanned_at: new Date().toISOString()
    });

    if (!error) {
      setAttendanceData(prev => ({ ...prev, [student.id]: 'Presente_Manual' }));
    } else {
      alert("Error: " + error.message);
    }
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayColors = { Lunes: '#4f46e5', Martes: '#16a34a', Miércoles: '#ea580c', Jueves: '#a21caf', Viernes: '#0891b2', Sábado: '#ca8a04' };

  const navItems = [
    {
      title: 'Gestión de Aula',
      items: [
        { id: 'inicio', icon: <Calendar size={16} />, label: 'Inicio / Mi Carga', onClick: () => setSelectedSubject(null) }
      ]
    },
    {
      title: 'Mis Materias',
      items: subjects.map(s => ({
        id: s.id,
        icon: <BookOpen size={16} />,
        label: s.subject,
        onClick: () => fetchStudentsForSubject(s)
      }))
    },
    {
      title: 'Análisis de Clase',
      items: selectedSubject ? [
        { id: 'grid', icon: <Users size={16} />, label: 'Asistencia Hoy', onClick: () => setActiveTab('grid') },
        { id: 'reports', icon: <BarChart2 size={16} />, label: 'Estadísticas de Asistencia', onClick: () => setActiveTab('reports') },
      ] : []
    }
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNav={selectedSubject ? selectedSubject.id : 'inicio'}
      setActiveNav={() => {}} // Not used as we use onClick
      logout={logout}
      navigate={navigate}
    >
      <div className="section-reveal">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Cargando materias...</p>
          </div>
        ) : !selectedSubject ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>
                Bienvenido, {user?.name?.split(' ')[0]} 👋
              </h1>
              {activeClass && (
                <div style={{ background: '#f0fdf4', border: '1px solid #16a34a', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="pulse-dot" style={{ background: '#16a34a' }}></span>
                  <span style={{ color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>CLASE EN CURSO: {activeClass.subject}</span>
                  {!isScanning ? (
                    <button onClick={startAttendance} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', marginLeft: '10px' }}>
                      <Scan size={14} style={{ marginRight: '6px' }} /> TOMAR ASISTENCIA
                    </button>
                  ) : (
                    <button onClick={stopAttendance} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', marginLeft: '10px' }}>
                      <XCircle size={14} style={{ marginRight: '6px' }} /> DETENER
                    </button>
                  )}
                </div>
              )}
            </div>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.1rem' }}>
              {subjects.length} materia{subjects.length !== 1 ? 's' : ''} asignada{subjects.length !== 1 ? 's' : ''} este período
            </p>

            {isScanning && (
              <div className="attendance-scanner-overlay" style={{ background: 'white', border: '2px solid var(--primary)', borderRadius: '24px', padding: '32px', marginBottom: '32px', position: 'relative', boxShadow: 'var(--premium-shadow)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontWeight: 900 }}>Escaneando para: {activeClass?.subject}</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                     {isInPerimeter ? (
                       <span style={{ color: '#16a34a' }}><MapPin size={12} /> Ubicado en Sede Barranquilla</span>
                     ) : (
                       <span style={{ color: '#ef4444' }}><AlertCircle size={12} /> Fuera del perímetro institucional</span>
                     )}
                  </p>
                </div>
                
                <div style={{ maxWidth: '400px', margin: '0 auto', overflow: 'hidden', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div id="attendance-reader"></div>
                </div>

                {scanResult && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: scanResult.success ? '#f0fdf4' : '#fef2f2',
                    border: `2px solid ${scanResult.success ? '#16a34a' : '#ef4444'}`,
                    padding: '24px', borderRadius: '20px', textAlign: 'center', zIndex: 10,
                    animation: 'scaleIn 0.3s ease-out'
                  }}>
                    {scanResult.success ? <CheckCircle size={48} color="#16a34a" /> : <XCircle size={48} color="#ef4444" />}
                    <h4 style={{ margin: '12px 0 4px', fontWeight: 900 }}>{scanResult.message}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>ID: {scanResult.sub}</p>
                  </div>
                )}
              </div>
            )}

            {subjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#475569', margin: 0 }}>Sin materias asignadas</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>El coordinador aún no ha asignado materias a tu nombre</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {subjects.map(s => (
                  <button key={s.id} onClick={() => fetchStudentsForSubject(s)}
                    style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: 'var(--card-shadow)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--premium-shadow-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="kpi-icon-box" style={{ background: '#eef2ff', color: 'var(--primary)', marginBottom: 0 }}>
                        <BookOpen size={22} />
                      </div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {s.credits} cr
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontWeight: 900, color: '#1e293b', fontSize: '1.1rem' }}>{s.subject}</h3>
                    <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>Período {s.period}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(s.schedule_blocks || []).map((b, i) => (
                        <span key={i} style={{
                          background: `${dayColors[b.day_of_week]}10`,
                          color: dayColors[b.day_of_week],
                          fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid currentColor', opacity: 0.8
                        }}>
                          <Clock size={10} />
                          {b.day_of_week} {b.start_time?.slice(0,5)}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelectedSubject(null)}
              style={{ background: 'rgba(79, 70, 229, 0.05)', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginBottom: '24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px' }}>
              ← Volver a mis materias
            </button>

            <div style={{ marginBottom: '32px' }}>
               <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px', letterSpacing: '-1px' }}>{selectedSubject.subject}</h1>
               <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Período de Gestión Académica {selectedSubject.period}</p>
            </div>

            {/* Bloques horarios */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {(selectedSubject.schedule_blocks || []).map((b, i) => (
                <div key={i} className="kpi-card" style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: '20px'
                }}>
                  <div className="kpi-icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', marginBottom: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#1e293b' }}>{b.day_of_week}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</p>
                  </div>
                  {b.classroom && (
                    <>
                      <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</p>
                        <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#1e293b' }}>{b.classroom}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Lista de estudiantes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 style={{ fontWeight: 900, color: '#1e293b', fontSize: '1.2rem', margin: 0 }}>
                 <Users size={20} style={{ marginRight: '10px', verticalAlign: 'middle', color: 'var(--primary)' }} />
                 Estudiantes Matriculados
               </h3>
               <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
                 {students.length} alumnos
               </span>
            </div>

            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', color: '#94a3b8', border: '1px solid #f1f5f9' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>Cargando lista de estudiantes o no hay matriculados...</p>
              </div>
            ) : (
              activeTab === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {students.map((s) => (
                  <div key={s.id} 
                    style={{ 
                      background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', position: 'relative',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.2s', textAlign: 'center'
                    }}>
                    
                    {/* Status Badge */}
                    {attendanceData[s.id] && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900 }}>
                           <CheckCircle size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {attendanceData[s.id]}
                        </div>
                    )}

                    <div style={{ 
                        width: '70px', height: '70px', borderRadius: '24px', margin: '0 auto 16px',
                        background: s.photo_url ? `url(${s.photo_url})` : `linear-gradient(135deg, hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 95%), #fff)`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900,
                        color: `hsl(${(s.name || 'A').charCodeAt(0) * 12}, 70%, 30%)`, border: '3px solid white', boxShadow: '0 8px 20px -8px var(--primary)'
                    }}>
                        {!s.photo_url && (s.name || '?').charAt(0).toUpperCase()}
                    </div>

                    <h4 style={{ margin: '0 0 4px', fontWeight: 900, color: '#1e293b' }}>{s.name}</h4>
                    <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#64748b' }}>
                      Semestre {s.semester} - {typeof s.program === 'object' ? s.program?.name : s.program}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!attendanceData[s.id] ? (
                        <>
                          <button onClick={() => { setSelectedStudent(s); startAttendance(); }}
                            style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Scan size={14} /> ESCANEAR
                          </button>
                          <button onClick={() => markManualAttendance(s)}
                            style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                            VALIDAR MANUAL
                          </button>
                        </>
                      ) : (
                        <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#16a34a', fontWeight: 800, fontSize: '0.75rem' }}>
                           Diligenciado ✅
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ fontWeight: 900, color: '#1e293b', marginBottom: '24px' }}>Consolidado de Asistencia - {reportData.totalSessions} Sesiones Totales</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reportData.stats.sort((a,b) => a.percent - b.percent).map(s => (
                    <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', gap: '20px', padding: '12px', borderBottom: '1px solid #f8fafc' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, color: s.percent < 80 ? '#ef4444' : '#1e293b' }}>{s.name}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>{typeof s.program === 'object' ? s.program?.name : s.program}</p>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                         <div style={{ width: `${s.percent}%`, height: '100%', background: s.percent < 80 ? '#ef4444' : '#16a34a', borderRadius: '10px' }}></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <span style={{ fontWeight: 900, fontSize: '1.1rem', color: s.percent < 80 ? '#ef4444' : '#1e293b' }}>{s.percent}%</span>
                         <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>{s.attendedCount} / {reportData.totalSessions} asistencias</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
