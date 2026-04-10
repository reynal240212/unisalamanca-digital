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
  

  return (
    <div 
      className="premium-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        boxShadow: `0 30px 60px rgba(0,0,0,0.12), 
                    inset 0 0 0 1px rgba(255,255,255,0.6),
                    ${mousePos.x * 2}px ${mousePos.y * 2}px 40px rgba(22, 182, 214, 0.15)`,
        transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
      }}
    >
      {/* Interactive Shine Effect (Hologram) */}
      <div 
        className="card-shine" 
        style={{ 
            position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', zIndex: 5,
            background: `radial-gradient(circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, white, transparent 60%)` 
        }}
      ></div>

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

        <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative' }}>
            <div className="qr-container-premium">
                {isRefreshing && (
                    <div className="qr-refresh-overlay">
                        <div className="pulse-dot"></div>
                    </div>
                )}
                
                <a 
                  href={`/validate/${student?.id}`} 
                  className="qr-scanner-container" 
                  onClick={(e) => { e.preventDefault(); alert('Validando Credencial...'); }}
                >
                    <div className="scan-line"></div>
                    <div className="qr-frame">
                        <QRCodeSVG 
                            value={qrValue} 
                            size={160} 
                            level="Q" 
                            includeMargin={false}
                            imageSettings={{
                                src: "/images/escudo.png",
                                height: 36,
                                width: 36,
                                excavate: true,
                            }}
                        />
                    </div>
                </a>
                
                {/* Simplified Security Cycle Area */}
                <div style={{ width: '100%', maxWidth: '210px', margin: '20px auto 0' }}>
                    <div className="qr-countdown-bar">
                        <div 
                            className="qr-countdown-inner" 
                            style={{ 
                                width: `${(timeLeft / 30) * 100}%`,
                                transition: timeLeft === 30 ? 'none' : 'width 1s linear',
                                background: timeLeft < 10 ? 'var(--accent)' : 'var(--secondary)'
                            }}
                        ></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                        <span className="pulse-dot-small" style={{ width: '6px', height: '6px', background: 'var(--secondary)', borderRadius: '50%', boxShadow: '0 0 10px var(--secondary)' }}></span>
                        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '1.5px', margin: 0 }}>
                            SEGURIDAD ACTIVA: <span style={{ color: 'var(--secondary)' }}>{String(timeLeft || 0).padStart(2, '0')}s</span>
                        </p>
                    </div>
                </div>
            </div>
            <p style={{ marginTop: '15px', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>ID DE IDENTIDAD: {student?.id?.substring(0, 8) || '00000000'}</p>
        </div>

        <button 
           onClick={onPrintRequest}
           className="btn-primary-premium"
           style={{ marginTop: '15px', width: '100%', background: 'white', color: 'var(--primary)', border: '1.5px solid #e2e8f0' }}
        >
           <ShieldCheck size={18} /> DESCARGAR CARNET DIGITAL
        </button>
      </div>
    </div>
  );
};

export default StudentCardComponent;
