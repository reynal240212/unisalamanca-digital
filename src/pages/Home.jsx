import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
   ShieldCheck,
   QrCode,
   UserCheck,
   ChevronRight,
   GraduationCap,
   Users,
   BookOpen,
   Briefcase,
   CreditCard
} from 'lucide-react';

import AcademicProgramsSection from '../components/AcademicProgramsSection';

const Home = () => {
   const navigate = useNavigate();
   const [currentBg, setCurrentBg] = useState(0);

   const heroImages = [
      'https://newsite.unisalamanca.edu.co/api/uploads/imgs/hero/71bf71e3a8d2b8cd_DIPLOMADOS_Mesa-de-trabajo-1-copia-3.webp',
      'https://newsite.unisalamanca.edu.co/api/uploads/imgs/hero/e05e6905a9ddf7b0_Preguntas-frecuentes---US.jpg',
      'https://newsite.unisalamanca.edu.co/api/uploads/imgs/hero/ab34c35de0acc7af_Banner-Emprendimientos---US.jpg'
   ];

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentBg((prev) => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="official-presentation">
         <Header />

         {/* Sub-Header Bar */}
         <div className="sub-header-bar">
            <div className="sub-header-content-premium">
               <div className="sub-header-text">
                  <span className="id-badge-small">NUEVO SIAU {new Date().getFullYear()}</span>
                  <h1 className="sub-header-title">Ecosistema Digital <span className="siau-acronym"><span className="si">SI</span><span className="au">AU</span></span></h1>
                  <p className="sub-header-desc">
                     <b>Sistema Integral de Administración Universitaria</b> — La plataforma líder de identidad y servicios para toda la comunidad UniSalamanca.
                  </p>
               </div>
               <div className="sub-header-actions">
                  <button onClick={() => navigate('/login')} className="btn-id-primary-small">
                     INGRESAR AL PORTAL <ChevronRight size={16} />
                  </button>
                  <button 
                     className="btn-id-secondary-small"
                     onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  >
                     EXPLORAR
                  </button>
               </div>
            </div>
         </div>

         {/* Presentation Hero */}
         <section className="id-hero" style={{ 
            backgroundImage: `url(${heroImages[currentBg]})`
         }}>
            <div className="hero-overlay"></div>
            
            <div className="hero-grid">
               {/* El contenido se movió al Sub-Header para evitar superposiciones */}
            </div>

            {/* Slider Dots */}
            <div className="hero-dots" style={{
               position: 'absolute',
               bottom: '40px',
               left: '50%',
               transform: 'translateX(-50%)',
               display: 'flex',
               gap: '12px',
               zIndex: 10
            }}>
               {heroImages.map((_, index) => (
                  <button
                     key={index}
                     onClick={() => setCurrentBg(index)}
                     style={{
                        width: currentBg === index ? '30px' : '10px',
                        height: '10px',
                        borderRadius: '50px',
                        border: 'none',
                        background: currentBg === index ? 'var(--secondary)' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                     }}
                     title={`Slide ${index + 1}`}
                  />
               ))}
            </div>
         </section>

         {/* Features Presentation */}
         <section id="features" className="id-features">
            <div className="features-intro">
               <h2>Tecnología al Servicio de tu Seguridad</h2>
               <p>Descubre los beneficios de portar tu identidad digital institucional.</p>
            </div>

            <div className="features-official-grid">
               <div className="off-feat-card">
                  <div className="off-icon cyan"><QrCode size={30} /></div>
                  <h3>QR Dinámico</h3>
                  <p>Código encriptado que se renueva cada 30 segundos para evitar duplicados.</p>
               </div>
               <div className="off-feat-card">
                  <div className="off-icon navy"><ShieldCheck size={30} /></div>
                  <h3>Validación Instantánea</h3>
                  <p>Verificación rápida en portería para un acceso fluido al campus.</p>
               </div>
               <div className="off-feat-card">
                  <div className="off-icon green"><UserCheck size={30} /></div>
                  <h3>Ley 1581 (Habeas Data)</h3>
                  <p>Tus datos protegidos bajo los más altos estándares legales de Colombia.</p>
               </div>
            </div>
         </section>

         {/* Roles Section */}
         <section className="id-roles">
            <div className="roles-intro">
               <span className="id-badge-small">NUESTRA COMUNIDAD</span>
               <h2>Un Espacio para Todos</h2>
               <p>Nuestra identidad digital se adapta a cada miembro de la familia UniSalamanca.</p>
            </div>
            <div className="roles-grid">
               <div className="role-card">
                  <div className="role-icon-box"><GraduationCap size={40} /></div>
                  <h4>Estudiantes</h4>
                  <p>Acceso rápido al campus, carnet digital siempre a mano y servicios de bienestar.</p>
               </div>
               <div className="role-card">
                  <div className="role-icon-box"><BookOpen size={40} /></div>
                  <h4>Docentes</h4>
                  <p>Gestión académica simplificada y validación de identidad en procesos institucionales.</p>
               </div>
               <div className="role-card">
                  <div className="role-icon-box"><Briefcase size={40} /></div>
                  <h4>Administrativos</h4>
                  <p>Herramientas de control eficientes y entorno digital seguro para la gestión diaria.</p>
               </div>
               <div className="role-card">
                  <div className="role-icon-box"><Users size={40} /></div>
                  <h4>Egresados</h4>
                  <p>Mantén tu vínculo con la universidad y accede a beneficios exclusivos post-grado.</p>
               </div>
            </div>
         </section>

         {/* NEW: Student Hub Section (Inspired by unisalamanca.edu.co) */}
         <section id="estudiantes" className="id-student-hub" style={{ 
           background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
           padding: '100px 20px',
           borderRadius: '60px 60px 0 0',
           marginTop: '-40px',
           position: 'relative',
           zIndex: 5
         }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
               <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                  <span className="id-badge-small" style={{ background: '#e0f2fe', color: '#0369a1' }}>PORTAL ESTUDIANTIL</span>
                  <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Tu Vida Universitaria en un Solo Lugar</h2>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                     Accesos rápidos a las herramientas y servicios que impulsan tu formación académica.
                  </p>
               </div>

               {/* Quick Access Bar */}
               <div style={{ 
                 display: 'flex', 
                 flexWrap: 'wrap', 
                 justifyContent: 'center', 
                 gap: '12px', 
                 marginBottom: '60px' 
               }}>
                  {[
                    { label: 'PQRSF', icon: <UserCheck size={18} />, onClick: () => navigate('/pqrsf') },
                    { label: 'Pagos', icon: <CreditCard size={18} />, onClick: () => navigate('/pagos') },
                    { label: 'FAQ', icon: <ShieldCheck size={18} />, onClick: () => navigate('/preguntas-frecuentes') },
                    { label: 'Reglamento', icon: <BookOpen size={18} />, onClick: () => window.open('https://unisalamanca.edu.co/documentos/NEW%20REGLAMENTO%20ESTUDIANTIL.pdf', '_blank') },
                    { label: 'Biblioteca', icon: <GraduationCap size={18} />, onClick: () => navigate('/biblioteca') },
                    { label: 'Programas', icon: <BookOpen size={18} />, onClick: () => document.getElementById('programas').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Manuales', icon: <Briefcase size={18} /> }
                  ].map(item => (
                    <button 
                      key={item.label} 
                      onClick={item.onClick}
                      className="btn-id-secondary-small" 
                      style={{ 
                        borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer' 
                      }}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
               </div>

               {/* Platforms Grid */}
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                 gap: '24px' 
               }}>
                  {[
                    { title: 'Q10 Académico', desc: 'Horarios, procesos académicos y estado financiero.', img: 'https://unisalamanca.edu.co/assets/Q10-CQvQK7aj.png' },
                    { title: 'Moodle Virtual', desc: 'Aulas virtuales, contenidos de clase y calificaciones.', img: 'https://unisalamanca.edu.co/assets/moodle-brNoss2L.png' },
                    { title: 'Teams & Comunidades', desc: 'Clases sincrónicas y colaboración en tiempo real.', img: 'https://unisalamanca.edu.co/assets/Teams-Bei1SR1r.png' },
                    { title: 'Office 365', desc: 'Correo institucional y herramientas de productividad.', img: 'https://unisalamanca.edu.co/assets/Microsotf%20365-DwOksrB0.png' },
                    { title: 'Azure & DevTools', desc: 'Servicios en la nube y software de desarrollo.', img: 'https://unisalamanca.edu.co/assets/Logo%20Azure-C6PMMPDU.png' },
                    { title: 'Autodesk Education', desc: 'Software profesional de diseño y arquitectura.', img: 'https://unisalamanca.edu.co/assets/autodesk-CLpro_QZ.png' }
                  ].map(plat => (
                    <div key={plat.title} className="off-feat-card" style={{ 
                      display: 'flex', flexDirection: 'column', height: '100%', 
                      border: '1px solid #f1f5f9', background: 'white',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ 
                        width: '100%', height: '120px', 
                        display: 'flex', alignItems: 'center', 
                        justifyContent: 'flex-start', marginBottom: '20px'
                      }}>
                        <img 
                          src={plat.img} 
                          alt={plat.title} 
                          style={{ 
                            maxHeight: '80px', 
                            objectFit: 'contain',
                            transform: plat.title === 'Office 365' ? 'scale(2.0)' : 'none',
                            transformOrigin: 'left center'
                          }} 
                        />
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{plat.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>{plat.desc}</p>
                      <button style={{ 
                        marginTop: '20px', border: 'none', background: 'transparent', 
                        color: 'var(--secondary)', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
                        padding: 0
                      }}>
                        ACCEDER AHORA <ChevronRight size={16} />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Academic Programs Section */}
         <AcademicProgramsSection />

         {/* Steps Section */}
         <section className="id-steps">
            <div className="steps-container">
               <div className="step-item">
                  <div className="step-num">01</div>
                  <h4>Inicia Sesión</h4>
                  <p>Usa tus credenciales de correo institucional.</p>
               </div>
               <div className="step-item">
                  <div className="step-num">02</div>
                  <h4>Completa tu Perfil</h4>
                  <p>Sube tu foto y verifica tus datos institucionales.</p>
               </div>
               <div className="step-item">
                  <div className="step-num">03</div>
                  <h4>¡Listo para Usar!</h4>
                  <p>Presenta tu QR en los puntos de acceso.</p>
               </div>
            </div>
         </section>

         <Footer />
      </div>
   );
};

export default Home;
