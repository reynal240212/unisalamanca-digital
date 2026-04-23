import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Monitor, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'PQRSF',
      icon: <MessageSquare size={24} />,
      question: '¿Cómo redactar una PQRSF?',
      answer: 'Este espacio está diseñado para gestionar solicitudes y resolver inconvenientes relacionados con servicios académicos o administrativos de la institución.',
      steps: [
        'Define tu solicitud en una frase clara y concisa.',
        'Adjunta soportes clave (documentos, capturas, etc.) si aplica.',
        'Radica la solicitud y conserva el número de seguimiento.'
      ],
      videoUrl: 'https://unisalamanca.edu.co/assets/pqrsf-video.mp4' // Placeholder based on official site structure
    },
    {
      id: 2,
      category: 'Plataformas',
      icon: <Monitor size={24} />,
      question: '¿Cómo entrar a Microsoft Teams?',
      answer: 'Microsoft Teams es la plataforma oficial para participar en clases sincrónicas y espacios colaborativos institucionales.',
      steps: [
        'Abre la guía oficial de "Cómo Entrar a Teams".',
        'Sigue los pasos indicados en el video tutorial.',
        'Usa tu correo institucional para el inicio de sesión.'
      ],
      videoUrl: '#'
    },
    {
      id: 3,
      category: 'Académico',
      icon: <GraduationCap size={24} />,
      question: '¿Cómo utilizar Moodle?',
      answer: 'El acceso a la plataforma virtual se realiza con el correo institucional. Es el centro de tus actividades y material de estudio.',
      steps: [
        'Ingresa con tus credenciales de correo institucional.',
        'Valida que tus cursos estén correctamente asignados en el tablero.',
        'Revisa el tutorial de navegación para completar tus tareas.'
      ],
      videoUrl: '#'
    },
    {
      id: 4,
      category: 'Correo',
      icon: <Mail size={24} />,
      question: '¿Cómo ingresar al correo institucional?',
      answer: 'Acceso a Microsoft 365 para revisar correos y utilizar herramientas ofimáticas como Word, Excel y PowerPoint.',
      steps: [
        'Abre el portal de Office 365.',
        'Introduce tu dirección @unisalamanca.edu.co.',
        'Si el acceso falla, limpia la caché o intenta con otro navegador.'
      ],
      videoUrl: '#'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="faq-page">
      <Header />
      
      <section className="faq-hero">
        <div className="hero-container">
          <HelpCircle size={48} className="hero-icon" />
          <h1>Centro de Ayuda</h1>
          <p>Encuentra respuestas rápidas y tutoriales para el uso de nuestras plataformas.</p>
          
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="¿En qué podemos ayudarte hoy?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="faq-content">
        <div className="container">
          {filteredFaqs.length > 0 ? (
            <div className="faq-grid">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className={`faq-card ${activeId === faq.id ? 'active' : ''}`}>
                  <button className="faq-header" onClick={() => toggleAccordion(faq.id)}>
                    <div className="faq-title-area">
                      <div className="category-icon">{faq.icon}</div>
                      <div className="faq-text">
                        <span className="category-tag">{faq.category}</span>
                        <h3>{faq.question}</h3>
                      </div>
                    </div>
                    {activeId === faq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                  
                  {activeId === faq.id && (
                    <div className="faq-body">
                      <p className="faq-answer">{faq.answer}</p>
                      <div className="steps-list">
                        <h4>Pasos rápidos:</h4>
                        <ul>
                          {faq.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                      <button className="btn-tutorial">
                        <PlayCircle size={18} /> Ver video tutorial
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={48} />
              <p>No encontramos resultados para tu búsqueda.</p>
              <button onClick={() => setSearchTerm('')} className="btn-reset">Ver todas las preguntas</button>
            </div>
          )}
        </div>
      </main>

      <section className="faq-footer">
        <div className="container">
          <h2>¿Aún tienes dudas?</h2>
          <p>Nuestro equipo de soporte técnico está listo para ayudarte.</p>
          <div className="contact-options">
            <a href="mailto:soporte@unisalamanca.edu.co" className="contact-btn">
              Contactar Soporte
            </a>
            <a href="/pqrsf" className="contact-btn outline">
              Radicar PQRSF
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .faq-page {
          background-color: #f8fafc;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
        }

        .faq-hero {
          background: linear-gradient(135deg, #0C2340 0%, #2A2266 100%);
          color: white;
          padding: 100px 20px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-icon {
          opacity: 0.2;
          margin-bottom: 20px;
          color: #38bdf8;
        }

        .faq-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
        }

        .faq-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .search-wrapper {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 5px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-wrapper input {
          width: 100%;
          padding: 15px 15px 15px 55px;
          border: none;
          border-radius: 15px;
          font-size: 1.1rem;
          outline: none;
          color: #1e293b;
        }

        .faq-content {
          padding: 80px 20px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .faq-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .faq-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s;
        }

        .faq-card.active {
          border-color: #38bdf8;
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.1);
        }

        .faq-header {
          width: 100%;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .faq-title-area {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .category-icon {
          width: 50px;
          height: 50px;
          background: #f1f5f9;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .category-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #38bdf8;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 4px;
        }

        .faq-text h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin: 0;
        }

        .faq-body {
          padding: 0 30px 30px 100px;
          animation: fadeIn 0.4s ease;
        }

        .faq-answer {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .steps-list {
          background: #f8fafc;
          padding: 25px;
          border-radius: 20px;
          margin-bottom: 25px;
        }

        .steps-list h4 {
          margin-bottom: 15px;
          color: var(--primary);
        }

        .steps-list ul {
          list-style: none;
          padding: 0;
        }

        .steps-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 12px;
          color: #475569;
        }

        .steps-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #38bdf8;
          font-weight: bold;
          font-size: 1.5rem;
          line-height: 1;
        }

        .btn-tutorial {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          color: white;
          padding: 12px 25px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-tutorial:hover {
          transform: scale(1.02);
          filter: brightness(1.1);
        }

        .faq-footer {
          padding: 100px 20px;
          text-align: center;
          background: white;
        }

        .faq-footer h2 {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 15px;
        }

        .contact-options {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }

        .contact-btn {
          padding: 15px 35px;
          border-radius: 15px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
        }

        .contact-btn:not(.outline) {
          background: #38bdf8;
          color: white;
        }

        .contact-btn.outline {
          border: 2px solid #e2e8f0;
          color: #64748b;
        }

        .no-results {
          text-align: center;
          padding: 60px 0;
          color: #94a3b8;
        }

        .btn-reset {
          margin-top: 20px;
          background: none;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .faq-hero h1 { font-size: 2.2rem; }
          .faq-header { padding: 20px; }
          .faq-body { padding: 0 20px 25px; }
          .contact-options { flex-direction: column; }
        }
      `}} />
    </div>
  );
};

export default FAQ;
