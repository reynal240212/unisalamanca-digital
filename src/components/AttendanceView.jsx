import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  CheckCircle, XCircle, Clock, Calendar, 
  MapPin, BookOpen, BarChart3, ChevronRight 
} from 'lucide-react';

const AttendanceView = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            id,
            date,
            status,
            scanned_at,
            is_in_perimeter,
            subject:subjects(name, credits)
          `)
          .eq('student_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setAttendance(data || []);

        // Calcular estadísticas por materia
        const subjectStats = {};
        (data || []).forEach(record => {
          const sName = record.subject?.name || 'Otro';
          if (!subjectStats[sName]) {
            subjectStats[sName] = { present: 0, total: 0, credits: record.subject?.credits || 0 };
          }
          subjectStats[sName].total += 1;
          if (record.status.includes('Presente')) {
            subjectStats[sName].present += 1;
          }
        });
        setStats(subjectStats);

      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div className="shimmer" style={{ width: '100%', height: '200px', borderRadius: '24px' }}></div>
      </div>
    );
  }

  return (
    <div className="section-reveal">
      <div className="grades-header-premium glass-card" style={{ marginBottom: '32px' }}>
        <div className="grades-header-main">
          <div className="header-icon-box" style={{ background: 'rgba(22, 182, 214, 0.1)', color: 'var(--secondary)' }}>
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Mi Control de Asistencia</h1>
            <p className="welcome-subtitle">Registro detallado de tu presencialidad en el campus.</p>
          </div>
        </div>
      </div>

      {/* RESUMEN POR MATERIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {Object.keys(stats).length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center' }}>
             <Clock size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
             <h3 style={{ color: '#475569' }}>Sin registros aún</h3>
             <p style={{ color: '#94a3b8' }}>Cuando tus profesores tomen asistencia, aparecerán aquí tus estadísticas.</p>
          </div>
        ) : (
          Object.entries(stats).map(([name, data]) => {
            const percent = Math.round((data.present / data.total) * 100);
            return (
              <div key={name} className="glass-card premium-hover" style={{ padding: '24px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div className="kpi-icon-box" style={{ background: 'rgba(30, 58, 138, 0.05)', color: 'var(--primary)', marginBottom: 0 }}>
                    <BookOpen size={20} />
                  </div>
                  <span style={{ 
                    background: percent < 80 ? '#fef2f2' : '#f0fdf4', 
                    color: percent < 80 ? '#ef4444' : '#16a34a',
                    padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800
                  }}>
                    {percent}% Asistencia
                  </span>
                </div>
                <h4 style={{ margin: '0 0 12px', fontWeight: 900, color: '#1e293b' }}>{name}</h4>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: percent < 80 ? '#ef4444' : 'var(--secondary)', borderRadius: '10px' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {data.present} de {data.total} sesiones registradas
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* HISTORIAL RECIENTE */}
      {attendance.length > 0 && (
        <div className="glass-card" style={{ padding: '32px', borderRadius: '28px' }}>
          <h3 style={{ margin: '0 0 24px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--primary)" /> Historial Reciente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {attendance.map((record) => (
              <div key={record.id} className="attendance-row" style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr', alignItems: 'center',
                padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{record.subject?.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{record.date}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {record.status.includes('Presente') ? (
                     <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <CheckCircle size={14} /> {record.status}
                     </span>
                   ) : (
                     <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <XCircle size={14} /> {record.status}
                     </span>
                   )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <MapPin size={12} /> {record.is_in_perimeter ? 'Sede Institucional' : 'Fuera de Sede'}
                </div>
                <div style={{ textAlign: 'right' }}>
                   <ChevronRight size={16} color="#cbd5e1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
