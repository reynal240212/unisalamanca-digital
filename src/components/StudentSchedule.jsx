import React from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, FileText, User } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import OfficialScheduleExport from './OfficialScheduleExport';

const StudentSchedule = ({ student }) => {
  const { schedule, loading, error } = useSchedule(student?.id);

  const getPdfPath = (programName) => {
    const maps = {
      'Ingeniería de Sistemas de Información': '/curriculums/ingenieria_sistemas.pdf',
      'Desarrollo de Software': '/curriculums/desarrollo_software.pdf',
      'Administración de Empresas': '/curriculums/administracion_empresas.pdf',
      'Contaduría Pública': '/curriculums/contaduria_publica.pdf',
      'Finanzas y Comercio Internacional': '/curriculums/finanzas_comercio.pdf',
    };
    return maps[programName] || null;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '250px', gap: '16px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid var(--primary)', borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Cargando horario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px',
        padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444'
      }}>
        <AlertCircle size={20} />
        <p style={{ fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const period = schedule[0]?.period || '2026-1';
  const pdfPath = getPdfPath(student?.program);

  const dayColors = {
    'Lunes':      { bg: '#f8fafc', accent: 'var(--primary)', light: '#e2e8f0' },
    'Martes':     { bg: '#f0f9ff', accent: 'var(--secondary)', light: '#bae6fd' },
    'Miércoles':  { bg: '#f8fafc', accent: 'var(--primary)', light: '#e2e8f0' },
    'Jueves':     { bg: '#f0f9ff', accent: 'var(--secondary)', light: '#bae6fd' },
    'Viernes':    { bg: '#f8fafc', accent: 'var(--primary)', light: '#e2e8f0' },
    'Sábado':     { bg: '#f0f9ff', accent: 'var(--secondary)', light: '#bae6fd' },
  };

  return (
    <div style={{ animation: 'slideUp 0.5s ease-out' }}>
      {/* COMPONENTE OCULTO PARA IMPRESIÓN */}
      <OfficialScheduleExport student={student} schedule={schedule} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="schedule-header-icon" style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(42, 34, 102, 0.2)',
              flexShrink: 0
            }}>
              <Calendar color="white" size={26} />
            </div>
            <div>
              <h2 className="schedule-title" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-dark)' }}>Mi Horario</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Período: {period} · {student?.program || 'Programa'}
              </p>
            </div>
          </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {pdfPath && (
            <a href={pdfPath} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', background: 'white', borderRadius: '12px',
                border: '1px solid #e2e8f0', color: '#374151', fontWeight: 700,
                fontSize: '0.85rem', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={16} color="#ef4444" />
              Descargar Pénsum
            </a>
          )}

          <button onClick={handlePrint}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'var(--primary)', borderRadius: '12px',
              border: 'none', color: 'white', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(42, 34, 102, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <FileText size={16} />
            Descargar Horario Oficial
          </button>
        </div>
      </div>

      {/* Sin materias */}
      {schedule.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '300px', background: 'white', borderRadius: '24px',
          border: '2px dashed #e2e8f0', gap: '16px', textAlign: 'center', padding: '40px'
        }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={36} color="#94a3b8" />
          </div>
          <h3 style={{ margin: 0, color: '#475569', fontWeight: 800 }}>Sin horario asignado</h3>
          <p style={{ color: '#94a3b8', maxWidth: '320px', fontSize: '0.9rem' }}>
            Tu administrador aún no ha cargado tu horario. Consulta con secretaría para más información.
          </p>
        </div>
      ) : (
        /* Grid por días */
        <div className="schedule-days-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {days.map((day) => {
            const daySubjects = schedule.filter(s =>
              s.blocks?.some(b => b.day_of_week === day)
            );
            const colors = dayColors[day];

            return (
              <div key={day} style={{
                background: 'white', borderRadius: '20px', border: `1px solid ${colors.light}`,
                overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                {/* Day header */}
                <div style={{
                  background: colors.bg, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: `2px solid ${colors.light}`
                }}>
                  <h3 style={{ margin: 0, fontWeight: 900, color: colors.accent, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '3px', height: '18px', background: colors.accent, borderRadius: '4px', display: 'inline-block' }} />
                    {day}
                  </h3>
                  <span style={{
                    background: colors.accent, color: 'white',
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800
                  }}>
                    {daySubjects.length} clases
                  </span>
                </div>

                {/* Subjects */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100px' }}>
                  {daySubjects.length > 0 ? daySubjects.map((item, idx) => (
                    <div key={idx} style={{
                      background: 'white', borderRadius: '14px',
                      padding: '14px', border: `1px solid ${colors.light}`,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BookOpen size={14} color={colors.accent} />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                            {item.subject}
                          </span>
                        </div>
                        <span style={{
                          background: 'white', border: `1px solid ${colors.light}`,
                          padding: '2px 8px', borderRadius: '8px', fontSize: '0.65rem',
                          fontWeight: 800, color: colors.accent, whiteSpace: 'nowrap'
                        }}>
                          {item.credits} cr
                        </span>
                      </div>

                      {item.teacher && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <User size={11} color="#94a3b8" />
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.teacher}</span>
                        </div>
                      )}

                      {item.blocks.filter(b => b.day_of_week === day).map((block, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={11} color="#94a3b8" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                              {block.start_time?.slice(0, 5)} – {block.end_time?.slice(0, 5)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={11} color="#94a3b8" />
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Salón: {block.classroom || 'Por definir'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.35, paddingBottom: '8px' }}>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Sin clases</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          .schedule-title {
            font-size: 1.3rem !important;
          }
          .schedule-header-icon {
            width: 42px !important;
            height: 42px !important;
          }
          .schedule-header-icon svg {
            width: 20px !important;
            height: 20px !important;
          }
          .schedule-days-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentSchedule;
