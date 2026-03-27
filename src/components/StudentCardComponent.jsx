import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';

const StudentCardComponent = ({ student, qrValue, progress, onPrintRequest }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5;
    const y = ((e.clientY - rect.top) / rect.height) - 0.5;
    setMousePos({ x: x * 20, y: y * -20 });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <div 
      className="premium-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px',
        padding: '40px 30px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.5)',
        transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--secondary)', filter: 'blur(80px)', opacity: 0.15, zIndex: 0 }}></div>
      
      <div style={{ transform: 'translateZ(50px)', zIndex: 1 }}>
        <div style={{ width: '140px', height: '140px', borderRadius: '32px', border: '6px solid white', overflow: 'hidden', margin: '0 auto 24px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', background: '#f8fafc' }}>
           <img src={student?.photo_url || '/images/default-avatar.png'} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <h2 style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.4rem', textAlign: 'center' }}>{student?.name?.toUpperCase() || 'Cargando...'}</h2>
        <p style={{ color: 'var(--secondary)', fontSize: '0.85rem', marginBottom: '25px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>{student?.program}</p>
        <div style={{ textAlign: 'center' }}>
            <div style={{ 
            background: 'white', padding: '20px', borderRadius: '24px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '25px', 
            border: '1px solid #f1f5f9', display: 'inline-block'
            }}>
                <QRCodeSVG value={qrValue} size={190} level="H" includeMargin={false} />
            </div>
        </div>

        <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}>
           <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', width: `${progress}%`, transition: 'width 1s linear' }}></div>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span className="pulse-dot"></span>
              <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.5px' }}>TOKEN DE SEGURIDAD ACTIVO</p>
           </div>
        </div>

        <button 
           onClick={onPrintRequest}
           style={{ 
             marginTop: '32px', background: '#f8fafc', border: '1.5px solid #e2e8f0', 
             color: '#475569', fontSize: '0.8rem', padding: '12px 24px', 
             borderRadius: '16px', cursor: 'pointer', fontWeight: 800,
             display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center',
             transition: 'all 0.2s'
           }}
        >
           <ShieldCheck size={18} /> GENERAR VERSIÓN FÍSICA
        </button>
      </div>
    </div>
  );
};

export default StudentCardComponent;
