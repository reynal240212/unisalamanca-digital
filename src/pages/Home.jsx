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
   Briefcase
} from 'lucide-react';

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
            backgroundImage: `url(${heroImages[currentBg]})`, 
            backgroundSize: '100% 100%', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            transition: 'background-image 0.5s ease-in-out'
         }}>
            <div className="hero-overlay"></div>
            
            <div className="hero-grid">
               {/* El contenido se movió al Sub-Header para evitar superposiciones */}
               {/* Eliminamos el mockup del teléfono para evitar sobrecarga con los banners */}
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
            <div className="features-intro" style={{ animation: 'reveal 1s ease-out' }}>
               <h2>Tecnología al Servicio de tu Seguridad</h2>
               <p>Descubre los beneficios de portar tu identidad digital institucional.</p>
            </div>

            <div className="features-official-grid">
               <div className="off-feat-card" style={{ animation: 'reveal 1.2s ease-out' }}>
                  <div className="off-icon cyan"><QrCode size={30} /></div>
                  <h3>QR Dinámico</h3>
                  <p>Código encriptado que se renueva cada 30 segundos para evitar duplicados.</p>
               </div>
               <div className="off-feat-card" style={{ animation: 'reveal 1.4s ease-out' }}>
                  <div className="off-icon navy"><ShieldCheck size={30} /></div>
                  <h3>Validación Instantánea</h3>
                  <p>Verificación rápida en portería para un acceso fluido al campus.</p>
               </div>
               <div className="off-feat-card" style={{ animation: 'reveal 1.6s ease-out' }}>
                  <div className="off-icon green"><UserCheck size={30} /></div>
                  <h3>Ley 1581 (Habeas Data)</h3>
                  <p>Tus datos protegidos bajo los más altos estándares legales de Colombia.</p>
               </div>
            </div>
         </section>

         {/* Roles Section */}
         <section className="id-roles">
            <div className="roles-intro">
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

