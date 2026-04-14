import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ScrollText, CheckCircle2, AlertTriangle, ExternalLink, X } from 'lucide-react';

const DataPolicyModal = ({ onAccept, isOpen }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Permitir un margen pequeño para detectar el final del scroll
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        borderRadius: '32px',
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '30px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <ShieldCheck size={28} color="var(--secondary)" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Tratamiento de Datos</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>CUMPLIMIENTO LEY 1581 DE 2012</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div 
          onScroll={handleScroll}
          style={{
            padding: '40px',
            overflowY: 'auto',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#334155'
          }}
        >
          <div style={{ 
            background: '#f8fafc', 
            borderLeft: '4px solid var(--secondary)', 
            padding: '20px', 
            borderRadius: '0 12px 12px 0',
            marginBottom: '30px',
            display: 'flex',
            gap: '15px'
          }}>
            <AlertTriangle size={24} className="text-secondary" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem' }}>
              Para activar tu Ecosistema Digital y Carnetización, es obligatorio leer y aceptar nuestra política de datos personales y biométricos.
            </p>
          </div>

          <section>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>1. Objeto</h3>
            <p>UniSalamanca informa al titular que sus datos serán tratados bajo los principios de legalidad, finalidad, libertad, veracidad, transparencia y seguridad, protegiendo su derecho fundamental al Habeas Data.</p>
          </section>

          <section style={{ marginTop: '25px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>2. Tratamiento de Datos Biométricos (Fotos)</h3>
            <div style={{ background: '#fdf2f2', padding: '15px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
              <p style={{ margin: 0, color: '#991b1b', fontWeight: 600 }}>
                Informamos que la fotografía capturada es un <strong>dato biométrico sensible</strong>. Su tratamiento es indispensable para el proceso de validación de identidad digital y seguridad física en el campus.
              </p>
            </div>
          </section>

          <section style={{ marginTop: '25px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>3. Derechos del Titular</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Conocer, actualizar y rectificar su información.</li>
              <li>Presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong>.</li>
              <li>Revocar la autorización salvo en casos de deber legal académico.</li>
            </ul>
          </section>

          <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Puedes consultar el documento legal completo en nuestra documentación oficial: 
              <Link to="/data-policy" target="_blank" style={{ color: 'var(--secondary)', fontWeight: 700, marginLeft: '5px' }}>Ver política completa</Link>
            </p>
          </div>
        </div>

        {/* FOOTER / ACTIONS */}
        <div style={{
          padding: '30px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          {!hasScrolledToBottom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
              <ScrollText size={16} /> <span>Por favor, desplázate hasta el final para habilitar la opción.</span>
            </div>
          )}
          
          <button
            onClick={onAccept}
            disabled={!hasScrolledToBottom}
            style={{
              width: '100%',
              padding: '18px',
              background: hasScrolledToBottom ? 'var(--primary)' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
          >
            {hasScrolledToBottom ? (
              <>ACEPTO Y AUTORIZO EL TRATAMIENTO <CheckCircle2 size={20} /></>
            ) : (
              <>LEE HASTA EL FINAL</>
            )}
          </button>
          
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
            Al hacer clic en aceptar, confirmas que has leído y comprendido el tratamiento de tus datos personales conforme a la Ley 1581 de 2012.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        section p { margin-bottom: 0; }
      `}</style>
    </div>
  );
};

export default DataPolicyModal;
