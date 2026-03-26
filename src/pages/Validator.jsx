import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';

const Validator = () => {
  const [scanResult, setScanResult] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  
  const scannerRef = useRef(null);
  const { user, logout } = useAuth();
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
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
    }
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      if (!data.id || !data.ts) throw new Error("QR Inválido");

      // Stop scanner temporarily
      await scannerRef.current.stop();
      setIsScanning(false);

      // Check for security: Time difference
      const now = Date.now();
      const diff = (now - data.ts) / 1000;
      if (diff > 60) { // Max 60 seconds
        setScanResult({ success: false, message: "Código QR expirado" });
        return;
      }

      // Fetch student from Supabase
      const { data: student, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', data.id)
        .single();
      
      if (error || !student) throw new Error("Estudiante no encontrado");

      if (student.status !== 'Active') {
        setScanResult({ success: false, message: `Cuenta: ${student.status}` });
        setStudentData(student);
        return;
      }

      setScanResult({ success: true, message: "Acceso Permitido" });
      setStudentData(student);

      // Log access in real-time
      await supabase.from('access_logs').insert({
        user_id: student.id,
        validator_id: user.id,
        status: 'GRANTED'
      });

    } catch (err) {
      console.error("Scan error:", err);
      setScanResult({ success: false, message: err.message || "Error al procesar QR" });
    }
  };

  const resetScanner = async () => {
    setScanResult(null);
    setStudentData(null);
    setIsScanning(true);
    await startScanner();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="student-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
        <div className="logo-text">UniSalamanca<span>Validador</span></div>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
          <LogOut size={14} />
        </button>
      </header>

      <div className="scanner-view">
        <div className="scanner-frame">
          <div id="reader"></div>
          {isScanning && <div className="qr-scanner-line"></div>}
        </div>
        
        <div className="scanner-instructions">
          <h3 style={{ color: 'white' }}>Preparado para Escanear</h3>
          <p style={{ color: '#94a3b8' }}>Apunta al código QR del estudiante</p>
        </div>
      </div>

      {scanResult && (
        <div className="result-panel">
          <div className="result-card">
            <div className={`status-badge ${scanResult.success ? 'granted' : 'denied'}`}>
              {scanResult.success ? <CheckCircle size={40} /> : <XCircle size={40} />}
            </div>
            
            {studentData && (
              <div className="student-avatar-lg">
                <img src={studentData.photo_url || '/images/default-avatar.png'} alt="Foto" />
              </div>
            )}

            <div className="result-info">
              <h2 style={{ color: 'white' }}>{scanResult.message}</h2>
              {studentData && (
                <p style={{ color: '#94a3b8' }}>
                  {studentData.name}<br />
                  {studentData.program}
                </p>
              )}
            </div>

            <button className="next-btn" onClick={resetScanner}>
              LISTO PARA EL SIGUIENTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validator;
