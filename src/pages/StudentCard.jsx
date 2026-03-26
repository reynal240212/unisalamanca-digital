import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { LogOut, Camera, Check, RotateCcw } from 'lucide-react';

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
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setStudent(data);
      
      if (!data.photo_url) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  const generateDynamicQR = () => {
    const timestamp = Date.now();
    const token = Math.random().toString(36).substring(7);
    const value = JSON.stringify({
      id: user.id,
      ts: timestamp,
      tk: token
    });
    setQrValue(value);
  };

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Por favor permite el acceso a la cámara');
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Draw frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImg(dataUrl);
      
      // Stop camera
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCapturing(false);
    }
  };

  const savePhoto = async () => {
    if (!privacyChecked) {
      alert('Debes aceptar la política de datos');
      return;
    }

    try {
      // Upload to Supabase Storage
      const fileName = `${user.id}_profile.jpg`;
      const blob = await (await fetch(capturedImg)).blob();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user record
      const { error: updateError } = await supabase
        .from('user')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setStudent(prev => ({ ...prev, photo_url: publicUrl }));
      setShowOnboarding(false);
    } catch (err) {
      console.error('Error saving photo:', err);
      alert('Error al guardar la foto');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="student-bg">
      <div className="app-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
          <div className="logo" style={{ fontWeight: 'bold', color: 'white' }}>UniSalamanca</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="badge active">Activo</div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
              <LogOut size={14} />
            </button>
          </div>
        </header>

        <main>
          <div className="id-card">
            <div className="photo-placeholder">
              <img 
                src={student?.photo_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'} 
                alt="Foto" 
              />
            </div>
            
            <div className="info-section">
              <h1 style={{ color: 'white' }}>{student?.name || 'Cargando...'}</h1>
              <p className="program">{student?.program || 'Programa Académico'}</p>
              <div className="divider"></div>
              <div className="meta-info">
                <div className="meta-item">
                  <span className="label">ID Estudiante</span>
                  <span className="value">{user?.id.substring(0, 8)}...</span>
                </div>
                <div className="meta-item">
                  <span className="label">Vence</span>
                  <span className="value">{student?.expiry_date || '2024-12-31'}</span>
                </div>
              </div>
            </div>

            <div className="qr-section">
              {qrValue ? (
                <QRCodeSVG value={qrValue} size={150} level="H" />
              ) : (
                <div style={{ width: 150, height: 150, background: '#eee' }}></div>
              )}
              <div className="qr-scanner-line"></div>
            </div>
            
            <div className="refresh-section">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <p id="timer-text">El código se actualiza pronto</p>
            </div>
          </div>
        </main>
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-content">
            <h2>¡Bienvenido!</h2>
            <p>Necesitamos una foto para tu credencial digital.</p>
            
            {!capturedImg ? (
              <div className="capture-area">
                {isCapturing ? (
                  <video ref={videoRef} autoPlay playsInline id="camera-stream"></video>
                ) : (
                  <button onClick={startCamera} className="btn-primary">
                    <Camera size={24} /> Activar Cámara
                  </button>
                )}
              </div>
            ) : (
              <div className="capture-area">
                <img src={capturedImg} alt="Captura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', textAlign: 'left' }}>
                <input 
                  type="checkbox" 
                  checked={privacyChecked} 
                  onChange={(e) => setPrivacyChecked(e.target.checked)} 
                />
                Autorizo el uso de mi foto para identificación institucional.
              </label>
            </div>

            <div className="capture-btns">
              {isCapturing && (
                <button onClick={takePhoto} className="btn-primary">Tomar Foto</button>
              )}
              {capturedImg && (
                <>
                  <button onClick={() => { setCapturedImg(null); startCamera(); }} className="btn-secondary">
                    <RotateCcw size={16} /> Repetir
                  </button>
                  <button onClick={savePhoto} className="btn-primary">
                    <Check size={16} /> Guardar y Activar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
