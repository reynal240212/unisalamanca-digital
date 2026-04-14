import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Scale, Lock, Users, PhoneCall, History, Mail, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DataPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <FileText className="text-secondary" size={24} />,
      title: "1. Responsable del Tratamiento",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0 }}>
            La <strong>Corporación Universitaria Empresarial de Salamanca</strong>, identificada con NIT 890.003.405-4, 
            actúa como Responsable del Tratamiento de los datos personales.
          </p>
          <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={14} /> <span>Carrera 50 No. 79 – 155, Barranquilla, Atlántico.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} /> <span>basededatos@unisalamanca.edu.co</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={14} /> <span>www.unisalamanca.edu.co</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Scale className="text-secondary" size={24} />,
      title: "2. Marco Legal",
      content: "Nuestra política se rige bajo la Ley 1581 de 2012 (Ley General de Protección de Datos Personales), el Decreto 1377 de 2013 y demás normas que las modifiquen o adicionen, garantizando el derecho constitucional al Habeas Data."
    },
    {
      icon: <Users className="text-secondary" size={24} />,
      title: "3. Finalidades Institucionales",
      content: (
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Gestión académica y administrativa del estudiante.</li>
          <li>Emisión y validación de la Identidad Digital Universitaria.</li>
          <li>Comunicaciones educativas y de bienestar.</li>
          <li>Seguridad física y lógica en las instalaciones de la Universidad.</li>
          <li>Reportes obligatorios ante el Ministerio de Educación Nacional.</li>
        </ul>
      )
    },
    {
      icon: <Lock className="text-secondary" size={24} />,
      title: "4. Tratamiento de Datos Sensibles",
      content: (
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <p style={{ margin: 0, color: '#b91c1c', fontWeight: 600 }}>
            El tratamiento de datos biométricos (como la fotografía) es facultativo. Sin embargo, es necesario para la correcta identificación y seguridad institucional dentro del Ecosistema Digital. Los datos sensibles son protegidos con altos estándares de encriptación.
          </p>
        </div>
      )
    },
    {
      icon: <ShieldCheck className="text-secondary" size={24} />,
      title: "5. Derechos del Titular",
      content: "Usted tiene derecho a conocer, actualizar y rectificar sus datos personales. Puede solicitar prueba de la autorización otorgada o revocarla cuando no se respeten los principios constitucionales y legales."
    },
    {
      icon: <PhoneCall className="text-secondary" size={24} />,
      title: "6. Consultas y Reclamos",
      content: "Para cualquier solicitud relacionada con sus datos, puede dirigirse al correo basededatos@unisalamanca.edu.co o presentar una solicitud escrita en la oficina de Registro y Control de nuestra sede principal."
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: "'Outfit', sans-serif",
      color: '#1e293b',
      paddingBottom: '80px'
    }}>
      {/* HEADER TOP NAV */}
      <nav style={{
        background: 'white',
        padding: '20px 5%',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.8)'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <div style={{ textAlign: 'right' }}>
          <img src="/images/logo-unisalamanca.png" alt="Logo" style={{ height: '35px' }} />
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'var(--primary)', 
            borderRadius: '24px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 24px',
            boxShadow: '0 20px 40px rgba(30, 27, 75, 0.2)'
          }}>
            <ShieldCheck size={40} color="var(--secondary)" />
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Política de Privacidad
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
             Protección de datos personales y biométricos bajo la Ley 1581 de 2012.
          </p>
        </header>

        <div style={{ display: 'grid', gap: '24px' }}>
          {sections.map((section, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
              transition: 'transform 0.2s ease',
              cursor: 'default'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '48px', height: '48px', background: 'rgba(22, 182, 214, 0.1)', 
                  borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {section.icon}
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER LEGALS */}
        <footer style={{ marginTop: '60px', textAlign: 'center', padding: '40px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94a3b8', marginBottom: '16px' }}>
            <History size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Última actualización: 14 de Abril, 2026</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>
            © 2026 Corporación Universitaria Empresarial de Salamanca. NIT 890.003.405-4.
          </p>
        </footer>
      </main>

      <style>{`
        body { margin: 0; }
        .text-secondary { color: var(--secondary); }
      `}</style>
    </div>
  );
};

export default DataPolicy;
