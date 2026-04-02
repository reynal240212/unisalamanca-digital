import React from 'react';

const OfficialScheduleExport = ({ student, schedule }) => {
  // Solo Lunes a Sábado según solicitud del usuario
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const period = schedule[0]?.period || '2026-1';
  const today = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="printable-schedule" style={{ display: 'none' }}>
      {/* CABECERA INSTITUCIONAL REFINADA */}
      <div className="print-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src="/images/escudo.png" alt="UniSalamanca" style={{ height: '85px', objectFit: 'contain' }} />
            <div style={{ borderLeft: '2px solid #1e3a8a', paddingLeft: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.5px' }}>
                CORPORACIÓN UNIVERSITARIA EMPRESARIAL DE SALAMANCA
              </h1>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Control de Registro y Control Académico
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.4 }}>
            <p style={{ margin: 0 }}>CÓDIGO: REG-HOR-01</p>
            <p style={{ margin: 0 }}>VERSIÓN: 3.0</p>
            <p style={{ margin: 0 }}>FECHA: 18/06/2026</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0', borderBlock: '1px solid #e2e8f0', padding: '10px 0' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', letterSpacing: '2px' }}>
                HORARIOS DEL ESTUDIANTE
            </h2>
        </div>

        {/* METADATOS DEL ESTUDIANTE */}
        <div className="print-student-info">
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '5px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>ESTUDIANTE:</span>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{student?.name?.toUpperCase()}</span>
            
            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>IDENTIFICACIÓN:</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{student?.document_id || 'SIN REGISTRO'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '5px', textAlign: 'right' }}>
            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>PROGRAMA:</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{student?.program || 'N/A'}</span>
            
            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>PERIODO ACAD.:</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{period} (EMISIÓN: {today})</span>
          </div>
        </div>
      </div>

      {/* CUERPO - TABLA DE HORARIOS */}
      <table className="print-table">
        <thead>
          <tr>
            {days.map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map(day => {
              const daySubjects = (schedule || []).filter(s => 
                s.blocks?.some(b => b.day_of_week === day)
              );

              return (
                <td key={day} style={{ height: '400px', backgroundColor: daySubjects.length === 0 ? '#fafafa' : 'transparent' }}>
                  {daySubjects.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '2rem', fontWeight: 100 }}>/</span>
                    </div>
                  ) : (
                    daySubjects.map((item, idx) => {
                      const block = item.blocks.find(b => b.day_of_week === day);
                      return (
                        <div key={idx} style={{ 
                            marginBottom: '12px', 
                            padding: '10px', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '6px',
                            background: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          <p className="print-subject-name">{item.subject?.toUpperCase()}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <p className="print-detail-item"><strong>Bloque:</strong> {block?.start_time?.slice(0,5)} - {block?.end_time?.slice(0,5)}</p>
                            <p className="print-detail-item"><strong>Aula:</strong> {block?.classroom || 'TBD'}</p>
                            <p className="print-detail-item"><strong>Docente:</strong> {item.teacher || 'POR ASIGNAR'}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* PIE DE PÁGINA PROFESIONAL */}
      <div style={{ marginTop: '30px', borderTop: '2px solid #1e3a8a', paddingTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.6rem', color: '#64748b' }}>
          <div style={{ maxWidth: '400px' }}>
            <p style={{ fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>CERTIFICACIÓN DE HORARIO:</p>
            <p style={{ margin: 0, lineHeight: 1.4 }}>
              Este horario ha sido generado a través del Sistema Digital UniSalamanca. 
              La asistencia a las sesiones programadas es obligatoria según el reglamento estudiantil vigente. 
              Cualquier modificación debe ser autorizada por la Dirección de Programa.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>UNISALAMANCA DIGITAL · PORTAL DEL ESTUDIANTE</p>
            <p style={{ margin: 0 }}>https://digital.unisalamanca.edu.co</p>
            <p style={{ marginTop: '8px', fontWeight: 700 }}>Página 1 de 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialScheduleExport;
