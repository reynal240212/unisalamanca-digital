import React, { useState } from 'react';
import { 
  BookOpen, Calculator, Award, ArrowUpRight, 
  ChevronDown, Filter, Info, CheckCircle2, XCircle, Clock, Database
} from 'lucide-react';

const GradesView = () => {
  const [selectedSemester, setSelectedSemester] = useState('2024-1');

  // Datos vacíos esperando integración real con Q10
  const gradesData = {};

  const currentGrades = gradesData[selectedSemester] || [];
  
  const average = '0.0';
  const totalCredits = 0;

  return (
    <div className="section-reveal grades-container">
      {/* HEADER DE NOTAS */}
      <div className="grades-header-premium glass-card">
        <div className="grades-header-main">
          <div className="header-icon-box">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Mis Notas Académicas</h1>
            <p className="welcome-subtitle">Consulta tu rendimiento detallado sincronizado con Q10.</p>
          </div>
        </div>

        <div className="semester-selector-wrapper">
          <label className="input-label-premium">Periodo Académico</label>
          <div className="custom-select-container">
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="select-premium"
            >
              <option value="2024-1">2024 - Primer Semestre (Actual)</option>
              {/* Estos se llenarán dinámicamente desde Q10 */}
            </select>
            <ChevronDown className="select-icon" size={18} />
          </div>
        </div>
      </div>

      {/* KPI CARDS RESUMEN */}
      <div className="grades-stats-grid">
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <Calculator className="text-primary" size={20} />
            <span>Promedio Periodo</span>
          </div>
          <div className="kpi-value">{average}</div>
        </div>
        
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <Award className="text-secondary" size={20} />
            <span>Créditos Inscritos</span>
          </div>
          <div className="kpi-value">{totalCredits}</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <ArrowUpRight className="text-accent" size={20} />
            <span>Materias</span>
          </div>
          <div className="kpi-value">0</div>
        </div>
      </div>

      {/* ESTADO VACÍO / TABLA PENDIENTE */}
      <div className="glass-card table-container-premium">
        <div className="empty-state-grades" style={{ 
          padding: '60px 20px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(42, 34, 102, 0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
          }}>
            <Database size={40} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-dark)' }}>Sincronización Pendiente</h3>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '8px auto' }}>
              Estamos listos para conectar con **Q10 Académico**. Para visualizar tus notas reales, el administrador debe activar la API Key institucional.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <span className="status-tag en-curso">
              <Clock size={14} /> Esperando Conexión
            </span>
          </div>
        </div>

        <div className="table-footer-info">
          <Info size={16} /> 
          <p>Tus datos estarán disponibles apenas se complete la integración técnica con el sistema de Gestión Académica.</p>
        </div>
      </div>
    </div>
  );
};

export default GradesView;
