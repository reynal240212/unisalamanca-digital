import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  MapPin, Users, FileText, Heart, CheckCircle, 
  ArrowRight, Landmark, Info, Globe, Building2 
} from 'lucide-react';

const ConveniosCAT = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Convenios CAT | UniSalamanca";
  }, []);

  const cities = [
    "Barranquilla", "Bogotá", "Caldas", "Cartagena", "Caucacia", "Cauca", 
    "Chocó", "Facatativá", "Huila", "Ibagué", "Lorica", "Medellín", 
    "Montería", "Nariño", "Popayán", "Putumayo", "Quindío", "Risaralda", 
    "Sabanalarga", "Sahagún", "San Andrés", "Santo Tomás", "Sincelejo", "Valle del Cauca"
  ];

  return (
    <div className="cat-page-wrapper" style={{ background: '#f8fafc' }}>
      <Header />
      
      {/* HERO SECTION */}
      <section className="cat-hero" style={{ 
        padding: '140px 20px 80px', 
        background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ 
            background: 'rgba(22, 182, 214, 0.2)', 
            color: 'var(--secondary)', 
            padding: '8px 20px', 
            borderRadius: '50px', 
            fontSize: '0.85rem', 
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: '20px',
            display: 'inline-block',
            border: '1px solid rgba(22, 182, 214, 0.3)'
          }}>
            PRESENCIA NACIONAL
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>Convenios CAT</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Los Centros de Atención Tutorial (CAT) acercan los servicios de UniSalamanca a tu ciudad a través de aliados estratégicos.
          </p>
        </div>
      </section>

      {/* MAP & INTRO */}
      <section style={{ padding: '0 20px', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '32px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr'
        }}>
          <div style={{ padding: '60px' }}>
            <h2 style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '2rem', marginBottom: '20px' }}>
              ¿Qué encuentras en los CAT?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '30px' }}>
              Los CAT facilitan aulas, orientación y espacios de acompañamiento, eliminando las barreras geográficas para que cumplas tus metas académicas desde tu propio territorio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle size={20} color="var(--secondary)" /> Orientación presencial en tu región
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle size={20} color="var(--secondary)" /> Espacios de tutoría y evaluación
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: 600 }}>
                <CheckCircle size={20} color="var(--secondary)" /> Gestión de trámites administrativos
              </div>
            </div>
          </div>
          <div style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <img 
              src="https://unisalamanca.edu.co/assets/MAPA-COLOMBIA2-Yj4iOvVb.webp" 
              alt="Mapa de cobertura CAT UniSalamanca" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            
            {/* Alianzas */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Building2 size={30} color="#0369a1" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>Alianzas y Convenios</h3>
              <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Activamos convenios con instituciones regionales para facilitar espacios de reunión y laboratorios.</p>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Uso de instalaciones para inducciones y tutorías.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Coordinación de talleres con apoyo local.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Eventos de regionalización en cada territorio.
                </li>
              </ul>
            </div>

            {/* Atencion */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', background: '#fef3c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FileText size={30} color="#b45309" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>Atención y Trámites</h3>
              <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Guiamos tus procesos administrativos para que los completes sin desplazamientos largos.</p>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Inscripciones, pagos y certificaciones asistidas.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Mesa de ayuda para Moodle, Q10 y Teams.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Acompañamiento a PQRS y solicitudes.
                </li>
              </ul>
            </div>

            {/* Vida Estudiantil */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', background: '#fce7f3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Heart size={30} color="#be185d" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px' }}>Vida Estudiantil</h3>
              <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Conectamos a los estudiantes con bienestar, prácticas y opciones de grado en su región.</p>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Beneficios de bienestar y permanencia.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Agenda de inducciones y ferias de servicios.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                  <ArrowRight size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Rutas de prácticas y articulación local.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* COVERAGE SECTION */}
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'var(--primary)', borderRadius: '32px', padding: '60px', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>Cobertura en Colombia</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Ciudades donde UniSalamanca se hace presente. Consulta los territorios con convenios activos.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '15px' 
          }}>
            {cities.map(city => (
              <div key={city} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '12px 20px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <MapPin size={16} color="var(--secondary)" />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConveniosCAT;
