import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  GraduationCap, BookOpen, Clock, FileText, 
  ChevronRight, Search, LayoutGrid, List,
  Download, ExternalLink, AlertCircle
} from 'lucide-react';
import './CurriculumView.css';

const CurriculumView = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchSubjects(selectedProgram.id);
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('academic_programs')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setPrograms(data);
      if (data.length > 0 && !selectedProgram) {
        setSelectedProgram(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchSubjects = async (programId) => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('program_id', programId)
      .order('semester', { ascending: true })
      .order('name', { ascending: true });
    
    if (!error && data) {
      setSubjects(data);
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.program_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const semesters = Array.from(new Set(subjects.map(s => s.semester))).sort((a, b) => a - b);

  if (loading && programs.length === 0) {
    return (
      <div className="empty-curriculum">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '20px', fontWeight: 700 }}>Conectando con la base de datos académica...</p>
      </div>
    );
  }

  return (
    <div className="curriculum-wrapper">
      {/* SIDEBAR: PROGRAM LIST */}
      <aside className="curriculum-sidebar">
        <div className="sidebar-header">
           <h3 className="sidebar-title">Oferta Académica</h3>
           <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Buscar programa..." 
                className="input-premium"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '0.8rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="program-list">
          {filteredPrograms.map(program => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className={`program-item ${selectedProgram?.id === program.id ? 'active' : ''}`}
            >
              <div className="program-item-info">
                 <div className="program-icon-box">
                    <GraduationCap size={18} />
                 </div>
                 <div>
                   <p className="program-name">{program.name}</p>
                   <p className="program-type">{program.program_type}</p>
                 </div>
              </div>
              <ChevronRight size={14} style={{ opacity: selectedProgram?.id === program.id ? 1 : 0.3 }} />
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT: CHOSEN PROGRAM DETAILS */}
      <main className="curriculum-detail">
        {selectedProgram ? (
          <div className="section-reveal" style={{ animationDelay: '0.1s' }}>
            {/* HEADER DATA */}
            <header className="program-header-card">
              <span className="header-badge">
                <Clock size={12} /> {selectedProgram.duration || '9 Semestres'}
              </span>
              <h2 className="header-title">{selectedProgram.name}</h2>
              <p className="header-desc">
                {selectedProgram.description || 'Formación académica de alta calidad para los líderes del futuro.'}
              </p>

              <div className="header-actions">
                {selectedProgram.pdf_url && (
                  <a 
                    href={selectedProgram.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-download-pdf"
                  >
                    <FileText size={18} /> Descargar Pénsum PDF
                  </a>
                )}
              </div>
            </header>

            {/* SEMESTERS GRID */}
            <div className="semester-grid" style={{ marginTop: '32px' }}>
              {semesters.map((sem, semIdx) => (
                <article key={sem} className="semester-card" style={{ animationDelay: `${semIdx * 0.1}s` }}>
                  <div className="semester-banner">
                    <h4 className="semester-label">
                      <BookOpen size={16} color="var(--primary)" />
                      SEMESTRE {sem}
                    </h4>
                    <span className="semester-badge">
                      {subjects.filter(s => s.semester === sem).length} Materias
                    </span>
                  </div>
                  
                  <div className="subject-list">
                    {subjects.filter(s => s.semester === sem).map((subject, subIdx) => (
                      <div key={subject.id} className="subject-item" style={{ animationDelay: `${subIdx * 0.05}s` }}>
                        <div className="subject-main">
                           <div className="subject-letter">
                              {subject.name.charAt(0)}
                           </div>
                           <div className="subject-name-box">
                             <p className="subject-name">{subject.name}</p>
                             <span className="subject-code">ID: {subject.id.substring(0,8)}</span>
                           </div>
                        </div>
                        <div className="subject-credits">
                          {subject.credits} CR
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="empty-curriculum">
                 <AlertCircle size={48} color="#cbd5e1" />
                 <h3 style={{ margin: '20px 0 8px', fontWeight: 900, color: 'var(--primary)' }}>Malla curricular no encontrada</h3>
                 <p style={{ maxWidth: '300px', fontSize: '0.9rem' }}>Aún no se han cargado las materias oficiales para este programa en el sistema.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-curriculum">
             <GraduationCap size={64} color="var(--primary)" style={{ opacity: 0.1, marginBottom: '24px' }} />
             <h3 style={{ fontWeight: 900, color: 'var(--primary)' }}>Selecciona un programa académico</h3>
             <p style={{ maxWidth: '400px', fontSize: '0.95rem' }}>Explora la distribución de materias y carga de créditos por semestre de los programas de UniSalamanca.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CurriculumView;
