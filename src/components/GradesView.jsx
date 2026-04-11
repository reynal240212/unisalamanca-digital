import React, { useState } from 'react';
import { 
  BookOpen, Calculator, Award, ArrowUpRight, 
  ChevronDown, Filter, Info, CheckCircle2, XCircle, Clock
} from 'lucide-react';

const GradesView = () => {
  const [selectedSemester, setSelectedSemester] = useState('2024-1');

  // Datos mock simulando respuesta de Q10
  const gradesData = {
    '2024-1': [
      { id: 1, name: 'Desarrollo de Software I', credits: 4, c1: 4.5, c2: 4.2, c3: 4.8, final: 4.5, status: 'Aprobado' },
      { id: 2, name: 'Bases de Datos Avanzadas', credits: 3, c1: 3.8, c2: 4.0, c3: 4.2, final: 4.0, status: 'Aprobado' },
      { id: 3, name: 'Arquitectura de Computadores', credits: 3, c1: 4.0, c2: 3.5, c3: 3.8, final: 3.7, status: 'Aprobado' },
      { id: 4, name: 'Ingeniería de Requisitos', credits: 3, c1: 4.8, c2: 4.7, c3: 4.9, final: 4.8, status: 'Aprobado' },
      { id: 5, name: 'Cálculo Diferencial', credits: 4, c1: 3.0, c2: 2.8, c3: null, final: null, status: 'En Curso' },
    ],
    '2023-2': [
      { id: 6, name: 'Lógica de Programación', credits: 4, final: 4.8, status: 'Aprobado' },
      { id: 7, name: 'Matemáticas Básicas', credits: 4, final: 3.9, status: 'Aprobado' },
      { id: 8, name: 'Introducción a la Ingeniería', credits: 2, final: 4.5, status: 'Aprobado' },
    ]
  };

  const currentGrades = gradesData[selectedSemester] || [];
  
  const average = currentGrades.length > 0 
    ? (currentGrades.reduce((acc, curr) => acc + (curr.final || 0), 0) / currentGrades.filter(g => g.final).length).toFixed(1)
    : '0.0';

  const totalCredits = currentGrades.reduce((acc, curr) => acc + curr.credits, 0);

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
              <option value="2023-2">2023 - Segundo Semestre</option>
              <option value="2023-1">2023 - Primer Semestre</option>
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
          <div className="kpi-value">{currentGrades.length}</div>
        </div>
      </div>

      {/* TABLA DE NOTAS */}
      <div className="glass-card table-container-premium">
        <div className="table-header-row">
          <h3 className="table-title">Detalle de Asignaturas</h3>
          <button className="btn-icon-soft"><Filter size={18} /> Filtrar</button>
        </div>

        <div className="grades-table-wrapper">
          <table className="grades-table-premium">
            <thead>
              <tr>
                <th align="left">Asignatura</th>
                <th>Créditos</th>
                <th>Corte 1 (30%)</th>
                <th>Corte 2 (30%)</th>
                <th>Corte 3 (40%)</th>
                <th>Definitiva</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentGrades.map((grade) => (
                <tr key={grade.id} className="table-row-hover">
                  <td>
                    <div className="subject-name-cell">
                      <span className="subject-dot" style={{ background: grade.final >= 3 ? 'var(--secondary)' : 'var(--primary)' }}></span>
                      {grade.name}
                    </div>
                  </td>
                  <td align="center"><span className="credits-badge">{grade.credits}</span></td>
                  <td align="center" className="grade-value">{grade.c1 || '-'}</td>
                  <td align="center" className="grade-value">{grade.c2 || '-'}</td>
                  <td align="center" className="grade-value">{grade.c3 || '-'}</td>
                  <td align="center">
                    <span className={`final-grade-badge ${grade.final < 3 && grade.final !== null ? 'danger' : 'success'}`}>
                      {grade.final || 'Pnd'}
                    </span>
                  </td>
                  <td align="center">
                    <div className={`status-tag ${grade.status.toLowerCase().replace(' ', '-')}`}>
                      {grade.status === 'Aprobado' ? <CheckCircle2 size={14} /> : grade.status === 'En Curso' ? <Clock size={14} /> : <XCircle size={14} />}
                      {grade.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          <Info size={16} /> 
          <p>Las notas mostradas son informativas y están sujetas a validación por el departamento de Registro y Control.</p>
        </div>
      </div>
    </div>
  );
};

export default GradesView;
