import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  GraduationCap, Clock, BookOpen, ChevronRight, 
  Search, Filter, Briefcase, Award, ArrowRight, X, FileText
} from 'lucide-react';

const AcademicPrograms = () => {
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
    
    // Cambiamos a la tabla 'subjects' que es la fuente completa usada en Admin
    const { data, error } = await supabase
      .from('subjects')
      .select('semester, name')
      .eq('program_id', program.id)
      .order('semester');
    
    if (!error && data) {
      // Agrupar por semestre
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
    
    // Mapeo exacto basado en la web institucional
    if (name.includes('recreación') || name.includes('deportes')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69becfc256f7b4.06727103.webp';
    
    if (name.includes('estadísticos') || name.includes('auxiliar de servicios financieros')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69becfe76f9fa0.30811083.webp';
    
    if (name.includes('inglés')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69c2ef4cddc885.83327522.webp';

    if (name.includes('desarrollo de software')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ac503ba8c3.85481169.webp';
    
    if (name.includes('sistemas')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_69139a888bf412.50230413.webp';
    
    if (name.includes('finanzas') && name.includes('comercio internacional')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_692620cf3cd168.30504333.webp';
    
    if (name.includes('administración de empresas')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ab897b9432.47090568.webp';
    
    if (name.includes('contaduría')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913abab438da4.08247330.webp';
    
    if (name.includes('comercio exterior') && !name.includes('finanzas')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ac16a7a964.71854289.webp';
    
    if (name.includes('bancaria') || name.includes('financiera')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ac32174d90.09656176.webp';

    // Imágenes para los técnicos (mapeo lógico por campo)
    if (name.includes('mecánica') || name.includes('automotriz')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ab897b9432.47090568.webp'; // Admin/Industrial fallback
    
    if (name.includes('bodega') || name.includes('distribución')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913abab438da4.08247330.webp'; // Contabilidad/Logística fallback
    
    if (name.includes('seguridad') || name.includes('salud')) 
      return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ac16a7a964.71854289.webp'; // Comercio/Admin fallback

    return 'https://newsite.unisalamanca.edu.co/uploads/imgs/programs/program_6913ab897b9432.47090568.webp';
  };

  const types = ['Todos', ...new Set(programs.map(p => p.program_type))];

  const filteredPrograms = programs.filter(p => {
    const matchesFilter = filter === 'Todos' || p.program_type === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="programs-explorer" style={{ background: '#fcfdfe', minHeight: '100vh' }}>
      <Header />

      {/* HERO SECTION */}
      <section className="programs-hero" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '140px 20px 100px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <span className="id-badge-small" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--secondary)', marginBottom: '24px' }}>
            OFERTA ACADÉMICA {new Date().getFullYear()}
          </span>
          <h1 style={{ fontSize: '3.8rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2px', lineHeight: 1 }}>
            Tu Futuro Empieza <span style={{ color: 'var(--secondary)' }}>Aquí</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 50px' }}>
            Programas diseñados para los líderes de la era digital. Formación de alta calidad con enfoque en innovación y resultados empresariales.
          </p>

          <div style={{ 
            background: 'white', padding: '10px', borderRadius: '24px', display: 'flex', gap: '10px', 
            maxWidth: '700px', margin: '0 auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' 
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px' }}>
              <Search size={20} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="¿Qué te gustaría estudiar?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}
              />
            </div>
            <button style={{ 
              background: 'var(--primary)', color: 'white', border: 'none', padding: '14px 35px', 
              borderRadius: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
            }}>
              BUSCAR
            </button>
          </div>
        </div>
      </section>

      {/* FILTERS & CONTENT */}
      <section style={{ padding: '60px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '12px 24px', borderRadius: '14px', border: 'none',
                  background: filter === t ? 'var(--primary)' : 'white',
                  color: filter === t ? 'white' : '#64748b',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="pulse-dot" style={{ margin: '0 auto 20px', width: '24px', height: '24px' }}></div>
              <p style={{ fontWeight: 800, color: '#94a3b8' }}>CARGANDO PROGRAMAS...</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' 
            }}>
              {filteredPrograms.map(p => (
                <div key={p.id} className="program-card-premium" style={{
                  background: 'white', borderRadius: '32px', overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                  display: 'flex', flexDirection: 'column', transition: 'all 0.4s'
                }}>
                  <div style={{ position: 'relative', height: '200px', background: '#f8fafc', overflow: 'hidden' }}>
                    <img 
                      src={getProgramImage(p.name)} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="card-img-zoom"
                    />
                    <div style={{
                      position: 'absolute', top: '20px', left: '20px',
                      background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)',
                      color: 'white', padding: '6px 16px', borderRadius: '50px',
                      fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px'
                    }}>
                      {p.program_type}
                    </div>
                  </div>

                  <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '16px', lineHeight: 1.2 }}>{p.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                      {p.description || "Formación integral con altos estándares de calidad académica y empresarial."}
                    </p>

                    <div style={{
                      display: 'flex', gap: '20px', padding: '20px 0',
                      borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
                      marginBottom: '24px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{p.duration}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Presencial</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => fetchCurriculum(p)}
                        className="btn-explore-program" style={{
                        flex: 1, padding: '16px', borderRadius: '16px',
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        color: 'var(--primary)', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        transition: 'all 0.3s'
                      }}>
                        VER ESTRUCTURA <ArrowRight size={18} />
                      </button>
                      {p.pdf_url && (
                        <a 
                          href={p.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Descargar Pénsum"
                          style={{
                            padding: '16px', borderRadius: '16px', background: 'rgba(7, 137, 178, 0.1)',
                            color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(7, 137, 178, 0.2)', transition: 'all 0.3s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(7, 137, 178, 0.1)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                          <FileText size={22} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* CURRICULUM MODAL */}
      {selectedProgram && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'white', width: '100%', maxWidth: '900px', maxHeight: '90vh',
            borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '32px', background: 'linear-gradient(to right, #1e1b4b, #312e81)',
              color: 'white', position: 'relative'
            }}>
              <button 
                onClick={() => setSelectedProgram(null)}
                style={{
                  position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)',
                  border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Plan de Estudios
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '8px 0 0' }}>{selectedProgram.name}</h2>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
              {loadingCurriculum ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div className="loader-premium" style={{ margin: '0 auto' }}></div>
                  <p style={{ marginTop: '20px', color: '#64748b' }}>Cargando estructura curricular...</p>
                </div>
              ) : curriculum.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                  <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#475569' }}>Estructura en Proceso</h3>
                  <p style={{ color: '#94a3b8' }}>Estamos digitalizando la malla curricular de este programa. ¡Vuelve pronto!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {curriculum.map((sem) => (
                    <div key={sem.semester} style={{
                      background: 'white', padding: '24px', borderRadius: '20px',
                      border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
                        paddingBottom: '12px', borderBottom: '1px solid #f1f5f9'
                      }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                          fontWeight: 900, fontSize: '0.9rem'
                        }}>
                          {sem.semester}
                        </div>
                        <h4 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Semestre</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {sem.subjects.map((subj, idx) => (
                          <div key={idx} style={{ 
                            fontSize: '0.8rem', color: '#475569', padding: '8px 12px', 
                            background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9',
                            display: 'flex', alignItems: 'center', gap: '8px'
                          }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                            {subj}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div style={{ 
              padding: '24px 32px', background: 'white', borderTop: '1px solid #f1f5f9', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              {selectedProgram.pdf_url ? (
                <a 
                  href={selectedProgram.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)',
                    textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', padding: '10px 20px',
                    borderRadius: '12px', background: 'rgba(7, 137, 178, 0.05)', border: '1px solid rgba(7, 137, 178, 0.1)'
                  }}
                >
                  <FileText size={18} /> DESCARGAR PÉNSUM PDF
                </a>
              ) : <div></div>}
              <button 
                onClick={() => setSelectedProgram(null)}
                style={{
                  padding: '12px 24px', borderRadius: '12px', border: 'none',
                  background: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer'
                }}
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .program-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(30, 58, 138, 0.15);
        }
        .program-card-premium:hover .card-img-zoom {
          transform: scale(1.1);
        }
        .btn-explore-program:hover {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
        }
        .hero-glow-1 {
          position: absolute; top: -100px; left: -100px; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(22, 182, 214, 0.15) 0%, transparent 70%);
        }
        .hero-glow-2 {
          position: absolute; bottom: -100px; right: -100px; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(42, 34, 102, 0.2) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
};

export default AcademicPrograms;
