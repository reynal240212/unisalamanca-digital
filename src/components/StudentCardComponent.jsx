import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';

const StudentCardComponent = ({ student, qrValue, progress, timeLeft, onPrintRequest }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger refresh animation when qrValue changes
  useEffect(() => {
    setIsRefreshing(true);
    const timeout = setTimeout(() => setIsRefreshing(false), 800);
    return () => clearTimeout(timeout);
  }, [qrValue]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5;
    const y = ((e.clientY - rect.top) / rect.height) - 0.5;
    setMousePos({ x: x * 20, y: y * -20 });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="premium-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(30px)', borderRadius: '40px',
        padding: isMobile ? '30px 20px' : '50px 35px', position: 'relative', overflow: 'hidden',
        boxShadow: `0 30px 60px rgba(0,0,0,0.12), 
                    inset 0 0 0 1px rgba(255,255,255,0.6),
                    ${mousePos.x * 2}px ${mousePos.y * 2}px 40px rgba(22, 182, 214, 0.15)`,
        transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
        border: '1px solid rgba(255,255,255,0.4)',
        width: '100%',
        maxWidth: '350px',
        margin: '0 auto'
      }}
    >
      {/* Dynamic Background Textures */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none', background: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '180px', height: '180px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, zIndex: 0 }}></div>
      
      <div style={{ transform: 'translateZ(60px)', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
             <div style={{ width: '150px', height: '150px', borderRadius: '38px', border: '8px solid white', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.15)', background: '#f8fafc', position: 'relative', zIndex: 2 }}>
                <img src={student?.photo_url || '/images/default-avatar.png'} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '14px', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(42, 34, 102, 0.3)', zIndex: 3 }}>
                <ShieldCheck size={20} color="white" />
             </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>{student?.name?.toUpperCase() || 'ESTUDIANTE'}</h2>
          <div style={{ display: 'inline-block', background: 'rgba(22, 182, 214, 0.1)', color: 'var(--secondary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, marginTop: '10px', letterSpacing: '1px' }}>
            {student?.program || 'PROGRAMA ACADÉMICO'}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
            <div className="qr-container-premium" style={{ margin: '0 auto', maxWidth: '230px' }}>
                {isRefreshing && (
                    <div className="qr-refresh-overlay">
                        <div className="pulse-dot"></div>
                    </div>
                )}
                <a 
                  href={`/validate/${student?.id}`} 
                  className="qr-scanner-container" 
                  style={{ display: 'block', margin: '0 auto', textDecoration: 'none', transition: 'all 0.3s ease' }}
                  onClick={(e) => { e.preventDefault(); alert('Validando Credencial...'); }}
                >
                    <div className="scan-line" style={{ background: 'linear-gradient(to right, transparent, var(--secondary), transparent)', height: '4px', opacity: 0.8 }}></div>
                    <div className="qr-frame" style={{ borderRadius: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <QRCodeSVG 
                            value={qrValue} 
                            size={180} 
                            level="Q" 
                            includeMargin={false}
                            imageSettings={{
                                src: "/images/escudo.png",
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </div>
                </a>
                
                {/* Countdown Timer Bar */}
                <div className="qr-countdown-bar">
                    <div className="qr-countdown-inner" style={{ width: `${((timeLeft || 0) / 30) * 100}%` }}></div>
                </div>
                <p style={{ marginTop: '10px', fontSize: isMobile ? '0.55rem' : '0.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '1px' }}>
                    REFRESCO EN: <span style={{ color: 'var(--secondary)' }}>{String(timeLeft || 0).padStart(2, '0')}s</span>
                </p>
            </div>
            <p style={{ marginTop: '15px', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>ID: {student?.id?.substring(0, 8) || '00000000'}</p>
        </div>

        <div style={{ width: '100%', maxWidth: '260px', margin: '0 auto' }}>
           <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '100px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', width: `${progress}%`, transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)', borderRadius: '100px' }}></div>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="pulse-dot"></span>
              <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 900, letterSpacing: '0.5px' }}>SISTEMA DE SEGURIDAD ACTIVO</p>
           </div>
        </div>

        <button 
           onClick={onPrintRequest}
           className="btn-primary-premium"
           style={{ marginTop: '40px', width: '100%', background: 'white', color: 'var(--primary)', border: '1.5px solid #e2e8f0' }}
        >
           <ShieldCheck size={18} /> DESCARGAR CARNET PDF
        </button>
      </div>
    </div>
  );
};

export default StudentCardComponent;
