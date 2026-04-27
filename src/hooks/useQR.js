import { useState, useEffect } from 'react';

/**
 * Hook para gestionar la lógica del QR dinámico con Firma Criptográfica
 * @param {string} id - ID del estudiante
 * @returns {object} { qrValue, timeLeft }
 */
export const useQR = (id) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrValue, setQrValue] = useState("");

  // LLAVE SECRETA INSTITUCIONAL (En prod debe venir de Env Var / Backend)
  const SECRET = "Unisalamanca_Secure_Key_2026";

  const generateDynamicQR = (studentId) => {
    if (!studentId) return "";
    
    // Ventanas de 30 segundos sincronizadas
    const windowBlock = Math.floor(Date.now() / 30000); 
    
    // Payload para validación offline
    const payload = {
      iss: "UniSalamanca",
      sub: studentId,
      iat: windowBlock, // Usamos el bloque como iat para la ventana de tiempo
      role: "student",
      v: "2.0" // Versión del protocolo
    };

    // Firmar el contenido (Simulación de firma JWT para compatibilidad navegador sin dependencias pesadas)
    // En una implementación final se usaría la librería 'jose' o similar
    try {
      // Creamos una estructura similar a JWT pero simplificada para el QR
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const body = btoa(JSON.stringify(payload));
      
      // En un entorno real aquí iría un HMAC real. Por ahora simulamos la estructura
      // para demostrar el concepto de Resiliencia Offline solicitado.
      const signature = btoa(`SIG|${studentId}|${windowBlock}|${SECRET}`).substring(0, 16);
      
      return `${header}.${body}.${signature}`;
    } catch (e) {
      return `UNIS|${studentId}|${windowBlock}`; // Fallback a legacy
    }
  };

  useEffect(() => {
    const syncTimer = () => {
      const now = new Date();
      const currentWindowSecond = now.getSeconds() % 30;
      setTimeLeft(30 - currentWindowSecond);
      setQrValue(generateDynamicQR(id));
    };

    syncTimer();
    const interval = setInterval(syncTimer, 1000);
    return () => clearInterval(interval);
  }, [id]);

  return { qrValue, timeLeft };
};

