import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { LogOut, Camera, Check, RotateCcw, ShieldCheck } from 'lucide-react';

const StudentCard = () => {
  const [student, setStudent] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [progress, setProgress] = useState(100);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  
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
    // Lógica antifraude basada en bloques de 30s
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
    <div className="login-page" style={{ padding: '20px' }}>
      <div className="app-container" style={{ width: '100%', maxWidth: '400px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <h2 style={{ fontSize: '1rem', color: '#4f46e5' }}>UniSalamanca</h2>
           <button onClick={logout} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.7rem' }}>SALIR</button>
        </header>

        <div className="login-card" style={{ flexDirection: 'column', padding: '30px', alignItems: 'center', textAlign: 'center' }}>
           <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #4f46e5', overflow: 'hidden', marginBottom: '20px' }}>
              <img src={student?.photo_url || '/images/default-avatar.png'} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
           
           <h2 style={{ margin: 0 }}>{student?.name || 'Cargando...'}</h2>
           <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>{student?.program}</p>

           <div style={{ background: 'white', padding: '15px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <QRCodeSVG value={qrValue} size={180} level="H" />
           </div>

           <div style={{ width: '100%' }}>
              <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginBottom: '8px', overflow: 'hidden' }}>
                 <div style={{ height: '100%', background: '#4f46e5', width: `${progress}%`, transition: 'width 1s linear' }}></div>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ROTACIÓN DINÁMICA DE SEGURIDAD</p>
           </div>
        </div>

        <footer style={{ marginTop: '30px', textAlign: 'center' }}>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#4f46e5" />
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Identidad Digital Verificada</p>
           </div>
        </footer>
      </div>

      {showOnboarding && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.95)', z-index: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div className="login-card" style={{ maxWidth: '450px', padding: '40px', textAlign: 'center', flexDirection: 'column' }}>
              <h3>¡Bienvenido Estudiante!</h3>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Activa tu carnet digital capturando tu foto de perfil.</p>
              
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '2px dashed #4f46e5', margin: '0 auto 20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {capturedImg ? (
                   <img src={capturedImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                   isCapturing ? <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}></video> : <Camera size={40} color="#4f46e5" />
                 )}
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

              <div style={{ marginBottom: '20px' }}>
                 <label style={{ fontSize: '0.8rem', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left' }}>
                    <input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} />
                    Autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012 para fines de identificación institucional.
                 </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                 {!capturedImg ? (
                    <button onClick={startCamera} className="btn-primary" disabled={isCapturing}>ENCENDER CÁMARA</button>
                 ) : (
                    <button onClick={() => { setCapturedImg(null); startCamera(); }} className="btn-primary" style={{ background: '#64748b' }}>REPETIR</button>
                 )}
                 {isCapturing && <button onClick={takePhoto} className="btn-primary">CAPTURAR</button>}
                 {capturedImg && <button onClick={savePhoto} className="btn-primary">GUARDAR Y ACTIVAR</button>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
