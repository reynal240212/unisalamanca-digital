import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Landmark, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  ExternalLink,
  Info,
  FileText,
  Mail,
  CalendarDays,
  Coins,
  HeadphonesIcon
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Payments = () => {
  const paymentMethods = [
    {
      id: 'pse',
      title: 'Banco Finandina (PSE)',
      desc: 'Paga en línea desde el portal PSE con tu cuenta de cualquier banco nacional.',
      logo: 'https://unisalamanca.edu.co/assets/Banco%20Finandina-DvQXpfQI.png',
      color: '#004b93',
      url: 'https://solicitud.bancofinandina.com:8443/pagos-pse/recargar',
      tag: 'Canal Oficial'
    },
    {
      id: 'bold',
      title: 'Pasarela Bold',
      desc: 'Usa tarjetas de crédito, débito, Nequi o Daviplata para pagos rápidos.',
      logo: 'https://unisalamanca.edu.co/assets/Bold-C-PMj6wi.png',
      color: '#ff3b30',
      url: 'https://checkout.bold.co/payment/LNK_LWCAK2UEGD',
      tag: 'Pago Rápido'
    }
  ];

  return (
    <div className="payments-page">
      <Header />

      {/* Hero Section Refined */}
      <section className="payments-hero">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-text-content">
            <span className="badge-premium">PORTAL DE PAGOS</span>
            <h1>Gestiona tus pagos de forma segura</h1>
            <p>Elige el canal que prefieras, descarga instructivos y mantente al día con tus obligaciones financieras.</p>
            
            <div className="manuals-grid">
              <a href="https://newsite.unisalamanca.edu.co/documentos/Manuales/MANUAL%20DE%20PAGO.pdf" target="_blank" className="btn-manual">
                <Download size={18} /> Manual Pago Virtual
              </a>
              <a href="https://newsite.unisalamanca.edu.co/documentos/Manuales/MANUAL%20DE%20PAGO.pdf" target="_blank" className="btn-manual outline">
                <Download size={18} /> Pago Presencial
              </a>
            </div>
          </div>

          <div className="hero-stats-card glass-card">
            <div className="stats-header">Resumen de Confianza</div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Habilitado</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Seguro</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">+4</span>
                <span className="stat-label">Canales</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">5 min</span>
                <span className="stat-label">Promedio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="payments-content">
        {/* steps section */}
        <section className="section-container">
          <div className="section-header-center">
            <h2>Sigue estos pasos para completar tu pago</h2>
            <p>Conserva el comprobante y compártelo con cartera cuando sea necesario para agilizar la aplicación.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Genera la referencia</h4>
              <p>Identifica el concepto y valor a cancelar desde tu plataforma académica o con tesorería.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Selecciona el canal</h4>
              <p>Elige la opción de pago que prefieras y completa la información solicitada.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Confirma tu soporte</h4>
              <p>Descarga el comprobante y compártelo con tesorería si usaste transferencias o datáfono.</p>
            </div>
          </div>
        </section>

        {/* virtual channels */}
        <section className="section-container">
          <div className="section-header-left">
            <h2>Formas de pago virtual</h2>
            <p>Paga en línea de manera instantánea desde la comodidad de tu hogar.</p>
          </div>
          
          <div className="gateways-grid">
            {paymentMethods.map(method => (
              <div key={method.id} className="premium-gateway-card">
                <div className="card-top">
                  <div className="method-logo-box">
                    <img src={method.logo} alt={method.title} className="method-img-logo" />
                  </div>
                  <span className="method-badge">{method.tag}</span>
                </div>
                <h3>{method.title}</h3>
                <p>{method.desc}</p>
                <a href={method.url} target="_blank" rel="noopener noreferrer" className="btn-action-pay" style={{ backgroundColor: method.color }}>
                  Ir a pagar <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* physical channels */}
        <section className="section-container">
          <div className="section-header-left">
            <h2>Formas de pago presencial</h2>
            <p>Encuentra los bancos habilitados para pagos en oficina y sigue el paso a paso recomendado.</p>
          </div>

          <div className="gateways-grid">
            <div className="premium-gateway-card physical">
              <div className="bank-logo-main">
                <img src="https://unisalamanca.edu.co/assets/Logo%20Bancolombia-DLGA4Wqj.svg" alt="Bancolombia" />
              </div>
              <div className="card-info">
                <span className="method-badge">Presencial</span>
                <h3>Bancolombia</h3>
                <p>Acércate a puntos Bancolombia y sigue el instructivo oficial para realizar tu pago de manera presencial.</p>
              </div>
              <a href="https://newsite.unisalamanca.edu.co/documentos/Manuales/MANUAL%20DE%20PAGO.pdf" target="_blank" className="btn-action-pay" style={{ backgroundColor: '#2A2266' }}>
                Pago presencial Bancolombia
              </a>
            </div>

            <div className="premium-gateway-card physical">
              <div className="bank-logo-main">
                <img src="https://unisalamanca.edu.co/assets/Logo%20Banco%20de%20Bogota-B7_RIRBN.svg" alt="Banco de Bogotá" />
              </div>
              <div className="card-info">
                <span className="method-badge">Presencial</span>
                <h3>Banco de Bogotá</h3>
                <p>Realiza el pago presencial en Banco de Bogotá con el paso a paso detallado en el manual institucional.</p>
              </div>
              <a href="https://newsite.unisalamanca.edu.co/documentos/Manuales/MANUAL%20DE%20PAGO.pdf" target="_blank" className="btn-action-pay" style={{ backgroundColor: '#2A2266' }}>
                Pago presencial Banco de Bogotá
              </a>
            </div>
          </div>
        </section>

        {/* Resources & Support */}
        <section className="resources-section">
          <div className="resources-grid">
            <div className="resource-card dark">
              <h2>Recursos y acompañamiento</h2>
              <p>Nuestro equipo está disponible para ayudarte en tu proceso financiero.</p>
              
              <div className="resource-items">
                <div className="r-item">
                  <CalendarDays size={20} className="text-secondary" />
                  <div>
                    <h5>Calendario Financiero</h5>
                    <p>Consulta fechas límite y beneficios por pronto pago.</p>
                  </div>
                </div>
                <div className="r-item">
                  <Coins size={20} className="text-secondary" />
                  <div>
                    <h5>Planes de Financiación</h5>
                    <p>Convenios especiales y pagos parciales disponibles.</p>
                  </div>
                </div>
                <div className="r-item">
                  <HeadphonesIcon size={20} className="text-secondary" />
                  <div>
                    <h5>Soporte Directo</h5>
                    <p>Atención personalizada por WhatsApp y correo.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-sidebar">
              <div className="contact-card">
                <Mail size={24} />
                <h4>Correo de Tesorería</h4>
                <p className="email">recibosunisalamanca@unisalamanca.edu.co</p>
                <a href="mailto:recibosunisalamanca@unisalamanca.edu.co" className="btn-contact">Enviar mensaje</a>
              </div>
              
              <div className="contact-card outline">
                <Clock size={24} />
                <h4>Horario de Atención</h4>
                <p>Lunes a viernes</p>
                <p className="time">8:00 a.m. - 5:00 p.m.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .payments-page {
          background: #fdfdfd;
          padding-top: var(--nav-height);
        }

        .payments-hero {
          background: #0C2340;
          min-height: 450px;
          position: relative;
          color: white;
          padding: 60px 0;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, #2A2266 0%, #16B6D6 150%);
          opacity: 0.9;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 30px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          position: relative;
          z-index: 10;
        }

        .hero-text-content h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .hero-text-content p {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .manuals-grid {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn-manual {
          background: white;
          color: var(--primary);
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .btn-manual.outline {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
        }

        .btn-manual:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .hero-stats-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 30px;
        }

        .stats-header {
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--secondary);
          letter-spacing: 2px;
          margin-bottom: 25px;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-item {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.6;
        }

        .payments-content {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 30px;
        }

        .section-container {
          margin-bottom: 80px;
        }

        .section-header-left {
          margin-bottom: 40px;
        }

        .section-header-left h2 {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--primary);
        }

        .section-header-left p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .gateways-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .premium-gateway-card {
          background: white;
          border-radius: 30px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
        }

        .premium-gateway-card.physical {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .bank-logo-main {
          height: 180px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          margin-bottom: 25px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
        }

        .bank-logo-main img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .card-info {
          flex-grow: 1;
        }

        .premium-gateway-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .method-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .method-img-logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .method-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: #f1f5f9;
          padding: 5px 12px;
          border-radius: 50px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .btn-action-pay {
          margin-top: 30px;
          color: white;
          text-decoration: none;
          padding: 15px;
          border-radius: 15px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: filter 0.3s;
        }

        .btn-action-pay:hover {
          filter: brightness(1.1);
        }

        .banks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .bank-card {
          background: white;
          padding: 30px;
          border-radius: 25px;
          display: flex;
          gap: 25px;
          align-items: center;
          border: 1px solid #f1f5f9;
        }

        .bank-logo-area img {
          height: 40px;
          width: auto;
          filter: grayscale(1);
          opacity: 0.6;
        }

        .bank-details h4 {
          font-weight: 800;
          color: var(--text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .bank-details .code {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary);
          margin: 5px 0;
        }

        .bank-details .instruction {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .resources-section {
          background: #f8fafc;
          border-radius: 40px;
          padding: 60px;
          margin-top: 100px;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 40px;
        }

        .resource-card h2 {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 15px;
        }

        .section-header-center {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-header-center h2 {
          font-size: 2.2rem;
          color: var(--primary);
          margin-bottom: 15px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .step-card {
          background: #edfaff;
          border: 1px solid #cceeff;
          border-radius: 24px;
          padding: 30px;
          position: relative;
          transition: transform 0.3s;
        }

        .step-card:hover {
          transform: translateY(-5px);
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .step-card h4 {
          color: var(--primary);
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .step-card p {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .resource-items {
          margin-top: 40px;
          display: grid;
          gap: 25px;
        }

        .r-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .r-item h5 {
          font-weight: 800;
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .r-item p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-card {
          background: white;
          padding: 30px;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-card.outline {
          background: transparent;
          border: 2px dashed #e2e8f0;
          box-shadow: none;
        }

        .contact-card h4 {
          font-weight: 800;
          color: var(--primary);
        }

        .contact-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .contact-card .email {
          font-weight: 700;
          color: var(--text-main);
          word-break: break-all;
        }

        .contact-card .time {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--secondary);
        }

        .btn-contact {
          margin-top: 10px;
          background: var(--primary);
          color: white;
          text-decoration: none;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          font-weight: 800;
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; }
          .hero-text-content h1 { font-size: 2.5rem; }
          .banks-grid { grid-template-columns: 1fr; }
          .resources-grid { grid-template-columns: 1fr; }
          .resources-section { padding: 40px 20px; }
        }
      `}} />
    </div>
  );
};

export default Payments;
