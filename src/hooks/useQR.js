import { useState, useEffect } from 'react';

/**
 * Hook para gestionar la lógica del QR dinámico (TOTP-Style)
 * @param {string} id - ID del estudiante para la semilla del hash
 * @returns {object} { qrValue, timeLeft }
 */
export const useQR = (id) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrValue, setQrValue] = useState("");

  const generateDynamicQR = (studentId) => {
    if (!studentId) return "";
    const window = Math.floor(Date.now() / 30000); // Ventanas de 30 segundos
    const secret = "US-SECRET-2026-"; 
    const raw = `${secret}${studentId}-${window}`;
    
    // Hash simple FNV-1a para el token
    let hash = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
        hash ^= raw.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const token = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
    return `unisalamanca:token:${studentId}:${token}`;
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
