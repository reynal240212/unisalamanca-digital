import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
   ShieldCheck,
   QrCode,
   UserCheck,
   Smartphone,
   ChevronRight,
   Search,
   Menu,
   Facebook,
   Instagram,
   Linkedin,
   MapPin,
   Phone,
   Mail
} from 'lucide-react';

const Home = () => {
   const navigate = useNavigate();

   return (
      <div className="official-presentation">
         {/* Official Header Clone */}
         <header className="official-header">
            <div className="header-container">
               <div className="branding" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <img src="/images/logo-oficial.svg" alt="UniSalamanca" style={{ height: '50px' }} />
               </div>
               <div className="header-actions">
                  <div className="search-circle"><Search size={18} /></div>
                  <div className="menu-circle"><Menu size={18} /></div>
               </div>
            </div>
         </header>

         {/* Presentation Hero */}
         <section className="id-hero" style={{ 
            backgroundImage: 'url(https://newsite.unisalamanca.edu.co/api/uploads/imgs/hero/71bf71e3a8d2b8cd_DIPLOMADOS_Mesa-de-trabajo-1-copia-3.webp)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            position: 'relative', 
            overflow: 'hidden' 
         }}>
            <div className="hero-overlay"></div>
            
            <div className="hero-grid">
               <div className="hero-text-side" style={{ position: 'relative', zIndex: 1, animation: 'fadeInLeft 1s ease-out' }}>
                  <span className="id-badge">IDENTIDAD 2026</span>
                  <h1 style={{ fontWeight: 900 }}>Tu Identidad, <br />Ahora es <span className="text-cyan">Premium</span></h1>
                  <p className="hero-desc">
                     Vive la evolución digital de UniSalamanca. Acceso inteligente, 
                     encriptación de grado militar y diseño institucional de vanguardia.
                  </p>
                  <div className="cta-group">
                     <button onClick={() => navigate('/login')} className="btn-id-primary">
                        ACTIVAR MI CARNET <ChevronRight size={18} />
                     </button>
                     <button className="btn-id-secondary">EXPLORAR FUNCIONES</button>
                  </div>
               </div>
               <div className="hero-image-side" style={{ position: 'relative', zIndex: 1, animation: 'fadeInRight 1.2s ease-out' }}>
                  <div className="phone-mockup" style={{ transform: 'rotate(-5deg)' }}>
                     <div className="mockup-screen" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                        <div className="card-preview" style={{ 
                          background: 'rgba(255,255,255,0.15)', 
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white'
                        }}>
                           <div className="card-top">
                              <span style={{ color: 'var(--secondary)', fontWeight: 900 }}>Uni</span><span>Salamanca</span>
                           </div>
                           <img 
                              src="/images/salmi.png" 
                              alt="Salmi" 
                              className="floating-mascot"
                              style={{ width: '100px', marginBottom: '8px', filter: 'drop-shadow(0 0 20px rgba(22,182,214,0.6))' }} 
                           />
                           <div className="card-qr" style={{ background: 'white', padding: '10px', borderRadius: '12px', marginTop: '10px' }}>
                              <QrCode size={100} color="#2A2266" />
                           </div>
                           <p style={{ fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 800, marginTop: '15px' }}>ESTUDIANTE DIGITAL</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Presentation */}
         <section className="id-features">
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
                  <h4>Captura tu Foto</h4>
                  <p>Activa tu perfil con una selfie de seguridad.</p>
               </div>
               <div className="step-item">
                  <div className="step-num">03</div>
                  <h4>¡Listo para Usar!</h4>
                  <p>Presenta tu QR en los puntos de acceso.</p>
               </div>
            </div>
         </section>

         {/* Official Footer Clone */}
         <footer className="official-footer">
            <div className="footer-top-official">
               <div className="footer-col-brand">
                  <div className="logo-concept inverse">
                     <span className="part-cyan">Uni</span>
                     <span className="part-white">Salamanca</span>
                  </div>
                  <p className="footer-description">
                     Institución de educación superior sujeta a inspección y vigilancia por el Ministerio de Educación Nacional.
                  </p>
                  <div className="social-links">
                     <Facebook size={20} /> <Instagram size={20} /> <Linkedin size={20} />
                  </div>
               </div>
               <div className="footer-col-links">
                  <h4>NORMATIVIDAD</h4>
                  <ul>
                     <li>Política de Privacidad</li>
                     <li>Tratamiento de Datos</li>
                     <li>Estatutos</li>
                     <li>Reglamento Estudiantil</li>
                  </ul>
               </div>
               <div className="footer-col-contact">
                  <h4>UBICACIÓN</h4>
                  <p><MapPin size={16} /> Cra. 7 #45-21, Bogotá</p>
                  <p><Phone size={16} /> (601) 485 0000</p>
                  <p><Mail size={16} /> info@unisalamanca.edu.co</p>
               </div>
            </div>
            <div className="footer-bottom-official">
               <p>© 2026 CORPORACIÓN UNIVERSITARIA EMPRESARIAL DE SALAMANCA. TODOS LOS DERECHOS RESERVADOS.</p>
            </div>
         </footer>
      </div>
   );
};

export default Home;
