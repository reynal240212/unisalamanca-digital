import React, { useState } from 'react';
import { 
  BookOpen, Calculator, Award, ArrowUpRight, 
  ChevronDown, Filter, Info, CheckCircle2, XCircle, Clock, Database,
  TrendingUp, Star
} from 'lucide-react';

const GradesView = ({ user }) => {
  const [selectedSemester, setSelectedSemester] = useState('2025-2');

  // Generar lista de periodos dinámicamente
  const generatePeriods = () => {
    const periods = [];
    const currentYear = 2026;
    const currentSem = 1; 
    
    const entryDate = user?.entry_date ? new Date(user.entry_date) : new Date('2023-01-01');
    let startYear = entryDate.getFullYear();
    let startSem = entryDate.getMonth() < 6 ? 1 : 2;

    for (let y = currentYear; y >= startYear; y--) {
      const maxSem = (y === currentYear) ? currentSem : 2;
      const minSem = (y === startYear) ? startSem : 1;
      
      for (let s = maxSem; s >= minSem; s--) {
        periods.push({
          id: `${y}-${s}`,
          label: `${y}-${s}`
        });
      }
    }
    return periods;
  };

  const academicPeriods = generatePeriods();

  // Datos de ejemplo basados en el reporte proporcionado por el usuario
  const gradesData = {
    '2025-2': [
      { id: 1, code: '710004', subject: 'INGLES NIVEL IV', credits: 2, pp: 4.3, sp: 4.4, tp: 4.2, inter: 3.5, def: 4.1, status: 'Aprobado' },
      { id: 2, code: '710005', subject: 'LABORATORIO EMPRESARIAL IV', credits: 3, pp: 3.8, sp: 4.0, tp: 4.5, inter: 0.0, def: 4.1, status: 'Aprobado' },
      { id: 3, code: '710006', subject: 'ESTADISTICA INFERENCIAL', credits: 4, pp: 3.2, sp: 3.5, tp: 3.0, inter: 1.2, def: 3.2, status: 'Aprobado' },
      { id: 4, code: '710007', subject: 'DERECHO LABORAL', credits: 3, pp: 4.5, sp: 4.2, tp: 4.8, inter: 0.0, def: 4.5, status: 'Aprobado' },
    ],
    '2025-1': [
      { id: 5, code: '710001', subject: 'INGLES NIVEL III', credits: 2, pp: 4.0, sp: 4.1, tp: 4.0, inter: 0.0, def: 4.0, status: 'Aprobado' },
    ]
  };

  const currentGrades = gradesData[selectedSemester] || [];
  
  // Calcular promedio y créditos
  const totalCredits = currentGrades.reduce((acc, curr) => acc + curr.credits, 0);
  const weightedSum = currentGrades.reduce((acc, curr) => acc + (curr.def * curr.credits), 0);
  const average = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(1) : '0.0';

  const getStatusStyle = (def) => {
    if (def >= 3.0) return { bg: '#f0fdf4', color: '#16a34a', icon: <CheckCircle2 size={14} /> };
    return { bg: '#fef2f2', color: '#dc2626', icon: <XCircle size={14} /> };
  };

  return (
    <div className="section-reveal grades-container">
      {/* HEADER DE NOTAS */}
      <div className="grades-header-premium glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', marginBottom: '24px' }}>
        <div className="grades-header-main" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="header-icon-box" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(42, 34, 102, 0.2)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 900, color: 'var(--primary-dark)' }}>Mis Calificaciones</h1>
            <p className="welcome-subtitle" style={{ color: '#64748b', margin: '4px 0 0' }}>Seguimiento académico detallado por cortes.</p>
          </div>
        </div>

        <div className="semester-selector-wrapper">
          <label className="input-label-premium" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Periodo Académico</label>
          <div className="custom-select-container" style={{ position: 'relative' }}>
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="select-premium"
              style={{ width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', appearance: 'none', background: 'white', fontWeight: 600, color: '#1e293b', minWidth: '150px' }}
            >
              {academicPeriods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* KPI CARDS RESUMEN */}
      <div className="grades-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '24px 0' }}>
        <div className="kpi-card-premium glass-card" style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white' }}>
          <div className="kpi-icon-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Calculator className="text-primary" size={20} />
            <span>Promedio Periodo</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>{average}</div>
        </div>
        
        <div className="kpi-card-premium glass-card" style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white' }}>
          <div className="kpi-icon-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Award className="text-secondary" size={20} />
            <span>Créditos Inscritos</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary)' }}>{totalCredits}</div>
        </div>

        <div className="kpi-card-premium glass-card" style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white' }}>
          <div className="kpi-icon-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Star style={{ color: '#f59e0b' }} size={20} />
            <span>Materias</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b' }}>{currentGrades.length}</div>
        </div>
      </div>

      {/* TABLA DE CALIFICACIONES */}
      <div className="glass-card" style={{ padding: '10px', borderRadius: '24px', overflow: 'hidden', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.5)' }}>
        <div className="premium-table-container">
          <table className="table-responsive-stack" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead className="thead-desktop">
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Asignatura</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Créditos</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>PP</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>SP</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>TP</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Inter</th>
                <th style={{ textAlign: 'center', padding: '16px 10px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>DEF</th>
                <th style={{ textAlign: 'right', padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentGrades.length > 0 ? currentGrades.map((grade) => {
                const status = getStatusStyle(grade.def);
                return (
                  <tr key={grade.id} style={{ background: 'white', transition: 'all 0.2s' }}>
                    <td data-label="Asignatura" style={{ padding: '16px 20px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{grade.subject}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>CÓDIGO: {grade.code}</span>
                      </div>
                    </td>
                    <td data-label="Créditos" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>{grade.credits}</span>
                    </td>
                    <td data-label="Primer Parcial (PP)" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, display: 'inline-block', minWidth: '40px' }}>{grade.pp.toFixed(1)}</div>
                    </td>
                    <td data-label="Segundo Parcial (SP)" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, display: 'inline-block', minWidth: '40px' }}>{grade.sp.toFixed(1)}</div>
                    </td>
                    <td data-label="Tercer Parcial (TP)" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, display: 'inline-block', minWidth: '40px' }}>{grade.tp.toFixed(1)}</div>
                    </td>
                    <td data-label="Intersemestral" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <span style={{ color: grade.inter > 0 ? '#f59e0b' : '#cbd5e1', fontWeight: 700 }}>{grade.inter.toFixed(1)}</span>
                    </td>
                    <td data-label="Definitiva" style={{ textAlign: 'center', padding: '16px 10px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: status.color }}>{grade.def.toFixed(1)}</span>
                    </td>
                    <td data-label="Estado" style={{ textAlign: 'right', padding: '16px 20px', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', 
                        fontWeight: 800, background: status.bg, color: status.color 
                      }}>
                        {status.icon}
                        {grade.status}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                    <Database size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ fontWeight: 600 }}>No hay calificaciones registradas para este periodo.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Info size={18} style={{ color: 'var(--primary)' }} />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
          <b>Nota:</b> Las calificaciones mostradas son sincronizadas periódicamente desde Q10 Académico. Si notas alguna inconsistencia, por favor contacta a Registro y Control.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grades-header-premium {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
          .semester-selector-wrapper {
            width: 100%;
          }
          .welcome-title {
            font-size: 1.4rem !important;
          }
          .thead-desktop {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default GradesView;
