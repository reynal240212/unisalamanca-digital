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
      document.title = "UniSalamanca | Inicio - Identidad Digital Universitaria";
      
      // Scroll Reveal Logic
      const revealElements = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               entry.target.classList.add('visible');
            }
         });
      }, { threshold: 0.1 });

      revealElements.forEach(el => observer.observe(el));

      const interval = setInterval(() => {
         setCurrentBg((prev) => (prev + 1) % heroImages.length);
      }, 6000);

      return () => {
         clearInterval(interval);
         revealElements.forEach(el => observer.unobserve(el));
      };
   }, []);

   const jsonLd = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "UniSalamanca",
      "url": window.location.origin,
      "logo": `${window.location.origin}/images/escudo.png`,
      "description": "Institución de educación superior enfocada en la excelencia académica y transformación digital.",
      "address": {
         "@type": "PostalAddress",
         "addressCountry": "CO"
      }
   };

   return (
      <div className="official-presentation">
         <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
         </script>
         <Header />

         {/* Sub-Header Bar */}
         <div className="sub-header-bar">
            <div className="sub-header-content-premium">
               <div className="sub-header-text">
                  <span className="id-badge-small">NUEVO SIAU {new Date().getFullYear()}</span>
                  <h1 className="sub-header-title">Identidad Digital <span className="siau-acronym">UniSalamanca</span></h1>
                  <p className="sub-header-desc">
                     <b>SIAU (Sistema Integral de Administración Universitaria)</b> — La plataforma oficial de servicios digitales para estudiantes, egresados y docentes.
                  </p>
               </div>
               <div className="sub-header-actions">
                  <button onClick={() => navigate('/login')} className="btn-id-primary-small">
                     INGRESAR AL PORTAL <ChevronRight size={16} />
                  </button>
                  <button 
                     className="btn-id-secondary-small"
                     onClick={() => document.getElementById('programas').scrollIntoView({ behavior: 'smooth' })}
                  >
                     VER PROGRAMAS
                  </button>
               </div>
            </div>
         </div>

         {/* Presentation Hero */}
         <section className="id-hero" style={{ 
            backgroundImage: `url(${heroImages[currentBg]})`
         }} aria-label="Banner Institucional">
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
                     title={`Banner UniSalamanca ${index + 1}`}
                  />
               ))}
            </div>
         </section>

         {/* 1. ACADEMIC PROGRAMS (MOST RELEVANT FOR ASPIRANTS) */}
         <div className="reveal reveal-up">
            <AcademicProgramsSection />
         </div>

         {/* 2. STUDENT HUB (MOST RELEVANT FOR CURRENT STUDENTS) */}
         <section id="estudiantes" className="id-student-hub reveal reveal-up" style={{ 
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
            padding: '100px 20px',
            borderRadius: '60px 60px 0 0',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 5
         }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
               <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                  <span className="id-badge-small" style={{ background: '#e0f2fe', color: '#0369a1' }}>RECURSOS DIGITALES</span>
                  <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Tu Ecosistema de Aprendizaje</h2>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                     Enlaces directos a las plataformas académicas que impulsan tu formación en UniSalamanca.
                  </p>
               </div>

               {/* Quick Access Bar */}
               <nav style={{ 
                 display: 'flex', 
                 flexWrap: 'wrap', 
                 justifyContent: 'center', 
                 gap: '12px', 
                 marginBottom: '60px' 
               }} aria-label="Accesos rápidos">
                  {[
                    { label: 'PQRSF', icon: <UserCheck size={18} />, onClick: () => navigate('/pqrsf') },
                    { label: 'Pagos en Línea', icon: <CreditCard size={18} />, onClick: () => navigate('/pagos') },
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
               </nav>

               {/* Platforms Grid */}
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                 gap: '24px' 
               }}>
                  {[
                    { title: 'Q10 Académico', desc: 'Gestión de horarios, notas y estado financiero estudiantil.', img: 'https://unisalamanca.edu.co/assets/Q10-CQvQK7aj.png' },
                    { title: 'Moodle Virtual', desc: 'Acceso a aulas virtuales, foros y material de estudio.', img: 'https://unisalamanca.edu.co/assets/moodle-brNoss2L.png' },
                    { title: 'Microsoft Teams', desc: 'Plataforma para clases virtuales y trabajo colaborativo.', img: 'https://unisalamanca.edu.co/assets/Teams-Bei1SR1r.png' },
                    { title: 'Office 365 Educación', desc: 'Herramientas de productividad y correo institucional.', img: 'https://unisalamanca.edu.co/assets/Microsotf%20365-DwOksrB0.png' },
                    { title: 'Azure Cloud', desc: 'Servicios en la nube para proyectos de ingeniería y TI.', img: 'https://unisalamanca.edu.co/assets/Logo%20Azure-C6PMMPDU.png' },
                    { title: 'Autodesk Education', desc: 'Software de diseño profesional para estudiantes.', img: 'https://unisalamanca.edu.co/assets/autodesk-CLpro_QZ.png' }
                  ].map((plat, idx) => (
                    <article key={plat.title} className={`off-feat-card reveal reveal-up delay-${(idx + 1) * 100}`} style={{ 
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
                          alt={`Plataforma ${plat.title}`} 
                          loading="lazy"
                          style={{ 
                            maxHeight: '80px', 
                            objectFit: 'contain',
                            transform: plat.title.includes('Office') ? 'scale(2.0)' : 'none',
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
                        IR A LA PLATAFORMA <ChevronRight size={16} />
                      </button>
                    </article>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. TECHNOLOGY & SECURITY (FEATURES) */}
         <section id="features" className="id-features reveal reveal-up">
            <div className="features-intro">
               <h2>Innovación en Educación y Seguridad Digital</h2>
               <p>Descubre los beneficios de portar tu identidad digital institucional UniSalamanca.</p>
            </div>

            <div className="features-official-grid">
               <div className="off-feat-card reveal reveal-left delay-100">
                  <div className="off-icon cyan"><QrCode size={30} /></div>
                  <h3>Carnetización con QR Dinámico</h3>
                  <p>Acceso seguro mediante un código encriptado que se renueva cada 30 segundos.</p>
               </div>
               <div className="off-feat-card reveal reveal-up delay-200">
                  <div className="off-icon navy"><ShieldCheck size={30} /></div>
                  <h3>Control de Acceso al Campus</h3>
                  <p>Verificación instantánea en portería para una entrada fluida y segura al campus universitario.</p>
               </div>
               <div className="off-feat-card reveal reveal-right delay-300">
                  <div className="off-icon green"><UserCheck size={30} /></div>
                  <h3>Protección de Datos Personales</h3>
                  <p>Gestión de información bajo la Ley 1581 (Habeas Data) y estándares de seguridad robustos.</p>
               </div>
            </div>
         </section>

         {/* 4. ROLES & COMMUNITY */}
         <section className="id-roles reveal reveal-up">
            <div className="roles-intro">
               <span className="id-badge-small">COMUNIDAD UNIVERSITARIA</span>
               <h2>Servicios Digitales para Toda la Comunidad</h2>
               <p>Nuestra plataforma SIAU centraliza servicios para cada perfil de la familia UniSalamanca.</p>
            </div>
            <div className="roles-grid">
               <div className="role-card reveal reveal-scale delay-100">
                  <div className="role-icon-box"><GraduationCap size={40} /></div>
                  <h3>Portal para Estudiantes</h3>
                  <p>Acceso al carnet digital, calificaciones, horarios y servicios de bienestar estudiantil.</p>
               </div>
               <div className="role-card reveal reveal-scale delay-200">
                  <div className="role-icon-box"><BookOpen size={40} /></div>
                  <h3>Portal para Docentes</h3>
                  <p>Gestión académica simplificada, registro de asistencia y herramientas pedagógicas.</p>
               </div>
               <div className="role-card reveal reveal-scale delay-300">
                  <div className="role-icon-box"><Briefcase size={40} /></div>
                  <h3>Gestión Administrativa</h3>
                  <p>Control de procesos internos y herramientas de seguridad para la administración universitaria.</p>
               </div>
               <div className="role-card reveal reveal-scale delay-400">
                  <div className="role-icon-box"><Users size={40} /></div>
                  <h3>Red de Egresados</h3>
                  <p>Vínculo permanente con la universidad y acceso a beneficios exclusivos para graduados.</p>
               </div>
            </div>
         </section>

         {/* 5. CONVENIOS Y PUNTOS DE ATENCIÓN */}
         <section className="id-convenios reveal reveal-up" style={{ padding: '100px 20px', background: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
               <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                  gap: '60px', 
                  alignItems: 'center' 
               }}>
                  <div className="reveal reveal-left delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <h2 style={{ 
                        fontSize: '2.8rem', 
                        fontWeight: 900, 
                        color: 'var(--primary)', 
                        lineHeight: 1.1,
                        margin: 0
                     }}>
                        Convenios y puntos de atención aliados
                     </h2>
                     <p style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 800, 
                        color: 'rgba(42, 34, 102, 0.7)', 
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        margin: 0
                     }}>
                        Presencia institucional en distintas regiones del país.
                     </p>
                     <div style={{ 
                        marginTop: '10px', 
                        background: '#f8fafc', 
                        padding: '30px', 
                        borderRadius: '24px', 
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                     }}>
                        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                           Contamos con aliados estratégicos en distintas ciudades para acompañarte en tu proceso académico.
                        </p>
                        <button 
                           onClick={() => navigate('/sedes')}
                           className="btn-id-primary-small"
                           style={{ width: 'fit-content', padding: '14px 30px', borderRadius: '50px' }}
                        >
                           VER CONVENIOS POR CIUDAD
                        </button>
                     </div>
                  </div>

                  <div className="reveal reveal-right delay-200" style={{ position: 'relative' }}>
                     <div style={{ 
                        aspectRatio: '4/3', 
                        width: '100%', 
                        overflow: 'hidden', 
                        borderRadius: '32px', 
                        border: '1px dashed #e2e8f0',
                        background: '#f8fafc',
                        backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.15) 1px, transparent 1px)',
                        backgroundSize: '12px 12px'
                     }}>
                        <img 
                           src="https://unisalamanca.edu.co/assets/Mapa%20Prueba-BCzaPIxh.webp" 
                           alt="Mapa de convenios y puntos de atención aliados" 
                           loading="lazy"
                           style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 6. STEPS (ONBOARDING) */}
         <section className="id-steps reveal reveal-up">
            <div className="steps-container">
               <div className="step-item reveal reveal-scale delay-100">
                  <div className="step-num">01</div>
                  <h3>Autenticación</h3>
                  <p>Inicia sesión con tu correo institucional UniSalamanca.</p>
               </div>
               <div className="step-item reveal reveal-scale delay-200">
                  <div className="step-num">02</div>
                  <h3>Actualización</h3>
                  <p>Verifica tu programa académico y sube tu fotografía.</p>
               </div>
               <div className="step-item reveal reveal-scale delay-300">
                  <div className="step-num">03</div>
                  <h3>Validación</h3>
                  <p>Obtén tu carnet digital con QR para ingreso al campus.</p>
               </div>
            </div>
         </section>

         <Footer />
      </div>
   );
};

export default Home;
