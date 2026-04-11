import { useState, useEffect } from 'react';

/**
 * Hook para gestionar la lógica del QR dinámico (TOTP-Style compatible con Validador)
 * @param {string} id - ID del estudiante
 * @returns {object} { qrValue, timeLeft }
 */
export const useQR = (id) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrValue, setQrValue] = useState("");

  const generateDynamicQR = (studentId) => {
    if (!studentId) return "";
    // Ventanas de 30 segundos (sincronizadas con tiempo Unix)
    const windowBlock = Math.floor(Date.now() / 30000); 
    // Formato requerido por Validator.jsx: UNIS|ID|BLOCK
    return `UNIS|${studentId}|${windowBlock}`;
  };

  useEffect(() => {
    const syncTimer = () => {
      const now = new Date();
      // Calcular segundos restantes en la ventana actual de 30s
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
