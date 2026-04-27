import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  GraduationCap, Clock, BookOpen, ChevronRight, 
  Search, Filter, Briefcase, Award, ArrowRight, X, FileText,
  Heart, Landmark, Star
} from 'lucide-react';

const AcademicProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_programs')
        .select('*')
        .order('name');

      if (!error) setPrograms(data || []);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  const fetchCurriculum = async (program) => {
    setSelectedProgram(program);
    setLoadingCurriculum(true);
    setCurriculum([]);
    
    const { data, error } = await supabase
      .from('subjects')
      .select('semester, name')
      .eq('program_id', program.id)
      .order('semester');
    
    if (!error && data) {
      const grouped = data.reduce((acc, curr) => {
        const sem = curr.semester;
        if (!acc[sem]) acc[sem] = { semester: sem, subjects: [] };
        acc[sem].subjects.push(curr.name);
        return acc;
      }, {});
      setCurriculum(Object.values(grouped).sort((a,b) => a.semester - b.semester));
    }
    setLoadingCurriculum(false);
  };

  const getProgramImage = (programName) => {
    const name = programName.toLowerCase();
    if (name.includes('recreación') || name.includes('deportes')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69becfc256f7b4.06727103.webp';
    if (name.includes('estadísticos') || name.includes('auxiliar de servicios financieros')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69becfe76f9fa0.30811083.webp';
    if (name.includes('inglés')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69c2ef4cddc885.83327522.webp';
    if (name.includes('desarrollo de software')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ac503ba8c3.85481169.webp';
    if (name.includes('sistemas')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69139a888bf412.50230413.webp';
    if (name.includes('finanzas')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_692620cf3cd168.30504333.webp';
    if (name.includes('administración')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ab897b9432.47090568.webp';
    if (name.includes('contaduría')) return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913abab438da4.08247330.webp';
    return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ab897b9432.47090568.webp';
  };

  const types = ['Todos', ...new Set(programs.map(p => p.program_type))];

  const filteredPrograms = programs.filter(p => {
    const matchesFilter = filter === 'Todos' || p.program_type === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="programas" className="academic-explorer-section" style={{ padding: '80px 20px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="id-badge-small" style={{ background: 'rgba(7, 137, 178, 0.1)', color: 'var(--primary)', marginBottom: '16px' }}>
            NUESTRA OFERTA
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Programas Académicos</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 40px' }}>
            Encuentra el camino hacia tu éxito profesional con nuestros programas de alta calidad.
          </p>

          <div style={{ 
            background: 'white', padding: '10px', borderRadius: '24px', display: 'flex', gap: '10px', 
            maxWidth: '600px', margin: '0 auto 40px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px' }}>
              <Search size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Busca tu programa ideal..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', overflowX: 'auto', paddingBottom: '10px' }}>
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none',
                  background: filter === t ? 'var(--primary)' : 'white',
                  color: filter === t ? 'white' : '#64748b',
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.3s',
                  whiteSpace: 'nowrap', border: '1px solid #f1f5f9'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="pulse-dot" style={{ margin: '0 auto 20px', width: '20px', height: '20px' }}></div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' 
          }}>
            {filteredPrograms.map(p => (
              <div key={p.id} className="program-card-home" style={{
                background: 'white', borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
              }}>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={getProgramImage(p.name)} 
                    alt={p.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute', top: '15px', left: '15px',
                    background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)',
                    color: 'white', padding: '4px 12px', borderRadius: '50px',
                    fontSize: '0.7rem', fontWeight: 800
                  }}>
                    {p.program_type}
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>{p.name}</h3>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{p.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Presencial</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => fetchCurriculum(p)}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      background: '#f8fafc', border: '1px solid #e2e8f0',
                      color: 'var(--primary)', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.3s'
                    }}
                    className="btn-program-detail"
                  >
                    VER MALLA <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL (Same as AcademicPrograms but adjusted for Home) */}
      {selectedProgram && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white', width: '100%', maxWidth: '800px', maxHeight: '85vh',
            borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '24px', background: 'var(--primary)', color: 'white', position: 'relative' }}>
              <button onClick={() => setSelectedProgram(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{selectedProgram.name}</h2>
              <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Plan de Estudios Institucional</p>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
              {loadingCurriculum ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                  {curriculum.map((sem) => (
                    <div key={sem.semester} style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 10px', color: 'var(--primary)', fontWeight: 800 }}>Semestre {sem.semester}</h4>
                      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                        {sem.subjects.map((subj, idx) => (
                          <li key={idx} style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '5px', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>{subj}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .program-card-home:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(30, 58, 138, 0.1); }
        .btn-program-detail:hover { background: var(--primary) !important; color: white !important; }
      `}</style>
    </section>
  );
};

export default AcademicProgramsSection;
