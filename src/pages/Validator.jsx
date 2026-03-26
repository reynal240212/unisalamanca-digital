import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { LogOut, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const Validator = () => {
  const [scanResult, setScanResult] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  
  const scannerRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      );
    } catch (err) {
      console.error("Scanner error:", err);
    }
  };

  const playSound = (type) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const parts = decodedText.split('|');
      if (parts[0] !== 'UNIS' || parts.length !== 3) throw new Error("QR No institucional");

      const studentId = parts[1];
      const receivedBlock = parseInt(parts[2]);
      const currentBlock = Math.floor(Date.now() / 30000);

      await scannerRef.current.stop();
      setIsScanning(false);

      const diff = Math.abs(currentBlock - receivedBlock);
      if (diff > 1) {
        playSound('error');
        setScanResult({ success: false, message: "CÓDIGO EXPIRADO (Captura detectada)" });
        return;
      }

      const { data: student, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', studentId)
        .single();
      
      if (error || !student) throw new Error("Estudiante no registrado");

      if (student.status !== 'Active') {
        playSound('error');
        setScanResult({ success: false, message: `ACCESO DENEGADO: Cuenta ${student.status}` });
        setStudentData(student);
        return;
      }

      playSound('success');
      setScanResult({ success: true, message: "ACCESO PERMITIDO" });
      setStudentData(student);

      await supabase.from('access_logs').insert({
        user_id: studentId,
        status: 'GRANTED',
        location: 'ENTRADA PRINCIPAL'
      });

    } catch (err) {
      playSound('error');
      setScanResult({ success: false, message: err.message });
    }
  };

  const resetScanner = async () => {
    setScanResult(null);
    setStudentData(null);
    setIsScanning(true);
    await startScanner();
  };

  return (
    <div className="login-page" style={{ flexDirection: 'column', background: 'var(--footer-bg)' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 900 }}>
          <span style={{ color: 'var(--secondary)' }}>Uni</span>Salamanca <span style={{ fontWeight: 300, fontSize: '0.8rem', opacity: 0.8 }}>| VALIDADOR</span>
        </h2>
        <button onClick={logout} className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.75rem', background: 'var(--primary)' }}>SALIR</button>
      </header>

      <div className="scanner-view" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '85%', maxWidth: '380px', background: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', border: '4px solid var(--secondary)' }}>
           <div id="reader" style={{ width: '100%', height: '100%' }}></div>
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Escáner de Seguridad</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Apunta al código QR del carnet digital</p>
        </div>
      </div>

      {scanResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.98)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div className="login-card" style={{ maxWidth: '400px', padding: '40px', textAlign: 'center', flexDirection: 'column', background: 'white', borderRadius: '40px' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '30px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                margin: '0 auto 20px',
                background: scanResult.success ? '#f0fdf4' : '#fef2f2',
                color: scanResult.success ? '#16A34A' : '#ef4444'
              }}>
                 {scanResult.success ? <CheckCircle size={50} /> : <XCircle size={50} />}
              </div>
              
              {studentData && (
                <div style={{ width: '140px', height: '140px', borderRadius: '40px', overflow: 'hidden', margin: '0 auto 20px', border: '5px solid var(--secondary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  <img src={studentData.photo_url || '/images/default-avatar.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <h2 style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '10px' }}>{scanResult.message}</h2>
              {studentData && <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontWeight: 700 }}>{studentData.name}<br/>{studentData.program}</p>}

              <button className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '15px', fontWeight: 900, background: 'var(--primary)' }} onClick={resetScanner}>CONTINUAR ESCANEO</button>
           </div>
        </div>
      )}
    </div>
  );
}; export default Validator;tor;
