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

  const onScanSuccess = async (decodedText) => {
    try {
      // Formato esperado: UNIS|{studentId}|{timeBlock}
      const parts = decodedText.split('|');
      if (parts[0] !== 'UNIS' || parts.length !== 3) throw new Error("QR No institucional");

      const studentId = parts[1];
      const receivedBlock = parseInt(parts[2]);
      const currentBlock = Math.floor(Date.now() / 30000);

      // Parada temporal del scanner
      await scannerRef.current.stop();
      setIsScanning(false);

      // Validación del bloque de tiempo (±1 bloque = 60s ventana)
      const diff = Math.abs(currentBlock - receivedBlock);
      if (diff > 1) {
        setScanResult({ success: false, message: "CÓDIGO EXPIRADO (Captura detectada)" });
        return;
      }

      // Consulta a Supabase
      const { data: student, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', studentId)
        .single();
      
      if (error || !student) throw new Error("Estudiante no registrado");

      if (student.status !== 'Active') {
        setScanResult({ success: false, message: `ACCESO DENEGADO: Cuenta ${student.status}` });
        setStudentData(student);
        return;
      }

      setScanResult({ success: true, message: "ACCESO PERMITIDO" });
      setStudentData(student);

      // Registro de Log (RF-05)
      await supabase.from('access_logs').insert({
        user_id: studentId,
        status: 'GRANTED',
        location: 'ENTRADA PRINCIPAL'
      });

    } catch (err) {
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
    <div className="login-page" style={{ flexDirection: 'column' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', width: '100%', color: '#4f46e5' }}>
        <h2 style={{ fontSize: '1rem' }}>UniSalamanca <span style={{ fontWeight: 300 }}>Validador</span></h2>
        <button onClick={logout} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.7rem' }}>SALIR</button>
      </header>

      <div className="scanner-view" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '90%', maxWidth: '400px', background: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
           <div id="reader" style={{ width: '100%', height: '100%' }}></div>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3>Escaner de Identidad</h3>
          <p style={{ color: '#64748b' }}>Apunta al código QR del estudiante</p>
        </div>
      </div>

      {scanResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.98)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div className="login-card" style={{ maxWidth: '400px', padding: '40px', textAlign: 'center', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '25px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                margin: '0 auto 20px',
                background: scanResult.success ? '#ecfdf5' : '#fef2f2',
                color: scanResult.success ? '#10b981' : '#ef4444'
              }}>
                 {scanResult.success ? <CheckCircle size={40} /> : <XCircle size={40} />}
              </div>
              
              {studentData && (
                <div style={{ width: '100px', height: '100px', borderRadius: '30px', overflow: 'hidden', margin: '0 auto 20px', border: '3px solid #4f46e5' }}>
                  <img src={studentData.photo_url || '/images/default-avatar.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <h2>{scanResult.message}</h2>
              {studentData && <p style={{ color: '#64748b', marginBottom: '30px' }}>{studentData.name}<br/>{studentData.program}</p>}

              <button className="btn-primary" style={{ width: '100%', padding: '18px' }} onClick={resetScanner}>SIGUIENTE</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Validator;
