import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StudentCardComponent from '../components/StudentCardComponent';
import { LogOut, Camera, Check, RotateCcw, ShieldCheck } from 'lucide-react';

const StudentCard = () => {
  const [student, setStudent] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [progress, setProgress] = useState(100);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  useEffect(() => {
    if (student) {
      generateDynamicQR();
      const interval = setInterval(() => {
        generateDynamicQR();
        setProgress(100);
      }, 30000);

      const timer = setInterval(() => {
        setProgress(prev => Math.max(0, prev - (100 / 30)));
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(timer);
      };
    }
  }, [student]);

  const fetchStudentData = async () => {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!error) {
      setStudent(data);
      if (!data.photo_url) setShowOnboarding(true);
    }
  };

  const generateDynamicQR = () => {
    const timeBlock = Math.floor(Date.now() / 30000);
    const value = `UNIS|${user.id}|${timeBlock}`;
    setQrValue(value);
  };

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert('Error accediendo a cámara');
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImg(dataUrl);
    
    const stream = video.srcObject;
    stream.getTracks().forEach(track => track.stop());
    setIsCapturing(false);
  };

  const savePhoto = async () => {
    if (!privacyChecked) return alert('Debes aceptar el tratamiento de datos');

    const fileName = `${user.id}_profile.jpg`;
    const blob = await (await fetch(capturedImg)).blob();
    
    await supabase.storage.from('student-photos').upload(fileName, blob, { upsert: true });
    
    const { data: { publicUrl } } = supabase.storage.from('student-photos').getPublicUrl(fileName);

    await supabase.from('user').update({ photo_url: publicUrl }).eq('id', user.id);

    setStudent(prev => ({ ...prev, photo_url: publicUrl }));
    setShowOnboarding(false);
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      perspective: '1000px'
    }}>
      <div className="app-container" style={{ width: '100%', maxWidth: '420px', zIndex: 10 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/images/escudo.png" alt="UniSalamanca" style={{ height: '32px', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
                ID <span style={{ color: 'var(--secondary)' }}>Digital</span>
              </h2>
           </div>
           <button onClick={logout} style={{ 
             background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
             color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
             transition: 'all 0.3s'
           }}>SALIR</button>
        </header>

         <StudentCardComponent 
           student={student} 
           qrValue={qrValue} 
           progress={progress} 
           onPrintRequest={() => setShowPrintModal(true)} 
         />

        <footer style={{ marginTop: '40px', textAlign: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.8 }}>
              <img src="/images/salmi.png" alt="Salmi" style={{ height: '28px' }} />
              <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, letterSpacing: '0.5px' }}>TECNOLOGÍA SALAMANCA DIGITAL</p>
           </div>
        </footer>
      </div>

      {showOnboarding && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.95)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div className="login-card" style={{ maxWidth: '450px', padding: '40px', textAlign: 'center', flexDirection: 'column', background: 'white', borderRadius: '32px' }}>
              <h3 style={{ fontWeight: 900, color: '#1e293b' }}>¡Bienvenido Estudiante!</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>Activa tu carnet digital capturando tu foto de perfil.</p>
              
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '3px dashed var(--secondary)', margin: '0 auto 20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                 {capturedImg ? (
                   <img src={capturedImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                   isCapturing ? <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}></video> : <Camera size={40} color="var(--secondary)" />
                 )}
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

              <div style={{ marginBottom: '24px' }}>
                 <label style={{ fontSize: '0.75rem', display: 'flex', gap: '12px', alignItems: 'center', textAlign: 'left', color: '#475569', lineHeight: '1.4' }}>
                    <input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    Autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012 para fines de identificación institucional.
                 </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                 {!capturedImg ? (
                    <button onClick={startCamera} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }} disabled={isCapturing}>ENCENDER CÁMARA</button>
                 ) : (
                    <button onClick={() => { setCapturedImg(null); startCamera(); }} style={{ background: '#64748b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>REPETIR</button>
                 )}
                 {isCapturing && <button onClick={takePhoto} style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>CAPTURAR</button>}
                 {capturedImg && <button onClick={savePhoto} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>ACTIVAR AHORA</button>}
              </div>
           </div>
        </div>
      )}

      {showPrintModal && (
        <PrintIDModal student={student} onClose={() => setShowPrintModal(false)} />
      )}

      <style>{styles}</style>
    </div>
  );
};

/* ─── MODAL CARNET FÍSICO (PARA IMPRIMIR) ───────────────────────── */
const PrintIDModal = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print" style={{ 
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
      zIndex: 2000, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '20px' 
    }}>
      {/* Botones de control */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary" onClick={handlePrint} style={{ background: 'var(--secondary)' }}>🖨️ IMPRIMIR AHORA</button>
        <button className="btn-outline-white" onClick={onClose}>CERRAR</button>
      </div>

      {/* área imprimible */}
      <div id="printable-card" style={{ 
        width: '320px', height: '500px', background: 'white', 
        borderRadius: '24px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0'
      }}>
        {/* Top Header */}
        <div style={{ background: 'var(--primary)', height: '140px', padding: '20px', textAlign: 'center' }}>
          <img src="/images/escudo.png" alt="Logo" style={{ width: '50px', filter: 'brightness(0) invert(1)', marginBottom: '5px' }} />
          <div style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--secondary)' }}>Uni</span>Salamanca
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 700 }}>IDENTIDAD INSTITUCIONAL</p>
        </div>

        {/* Photo Section */}
        <div style={{ marginTop: '-45px', textAlign: 'center', position: 'relative' }}>
          <div style={{ 
            width: '110px', height: '110px', borderRadius: '50%', 
            border: '5px solid white', overflow: 'hidden', margin: '0 auto',
            background: '#eee', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            <img src={student?.photo_url || '/images/default-avatar.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Info Section */}
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '5px' }}>{student?.name?.toUpperCase()}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>{student?.program}</p>
          
          <div style={{ borderTop: '1.5px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>ID INSTITUCIONAL</p>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>{student?.id?.substring(0, 10).toUpperCase()}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>VIGENCIA</p>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>SEM B-2026</p>
            </div>
          </div>
        </div>

        {/* Foot footer */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-card, #printable-card * { visibility: visible; }
          #printable-card { 
            position: absolute; 
            left: 50%; top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const styles = `
  .pulse-dot {
    width: 6px; height: 6px; background: #22c55e; border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
  .premium-card:hover {
    box-shadow: 0 45px 80px rgba(0,0,0,0.18);
  }
`;

export default StudentCard;
