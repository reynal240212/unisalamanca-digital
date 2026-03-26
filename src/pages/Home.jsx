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
         <section className="id-hero" style={{ backgroundImage: 'url(https://newsite.unisalamanca.edu.co/api/uploads/imgs/hero/71bf71e3a8d2b8cd_DIPLOMADOS_Mesa-de-trabajo-1-copia-3.webp)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', zIndex: 0 }}></div>
            <div className="hero-grid">
               <div className="hero-text-side" style={{ position: 'relative', zIndex: 1 }}>
                  <span className="id-badge">NUEVO LANZAMIENTO</span>
                  <h1>Tu Identidad, <br />Ahora es <span className="text-cyan">Digital</span></h1>
                  <p className="hero-desc">
                     Bienvenido a la evolución de UniSalamanca. Un sistema de identificación
                     inteligente, seguro y siempre contigo.
                  </p>
                  <div className="cta-group">
                     <button onClick={() => navigate('/login')} className="btn-id-primary">
                        ACTIVAR MI CARNET <ChevronRight size={18} />
                     </button>
                     <button className="btn-id-secondary">VER TUTORIAL</button>
                  </div>
               </div>
               <div className="hero-image-side" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="phone-mockup">
                     <div className="mockup-screen">
                        <div className="card-preview" style={{ background: 'linear-gradient(135deg, #fff, #f0f7ff)' }}>
                           <div className="card-top">
                              <span className="uni">Uni</span><span className="sal">Salamanca</span>
                           </div>
                           <img src="https://newsite.unisalamanca.edu.co/api/uploads/imgs/mascota/salmi.webp" alt="Salmi" style={{ width: '80px', marginBottom: '10px' }} onError={(e) => e.target.style.display = 'none'} />
                           <div className="card-qr">
                              <QrCode size={120} color="#2A2266" />
                           </div>
                           <p>ESTUDIANTE ACTIVO</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Presentation */}
         <section className="id-features">
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
