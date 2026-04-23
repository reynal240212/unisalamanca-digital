import { useState, useEffect } from 'react';

/**
 * Hook para detectar el gesto de "Agitar" (Shake) el dispositivo.
 * @param {Function} onShake - Callback a ejecutar cuando se detecta el agite.
 * @param {number} threshold - Sensibilidad del agite (por defecto 15).
 */
export const useShake = (onShake, threshold = 15) => {
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        setPermissionStatus(response);
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
        return response;
      } catch (e) {
        console.error("DeviceMotion permission error:", e);
        setPermissionStatus('denied');
        return 'denied';
      }
    } else {
      window.addEventListener('devicemotion', handleMotion);
      setPermissionStatus('granted');
      return 'granted';
    }
  };

  let lastX, lastY, lastZ;
  let lastUpdate = 0;

  const handleMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const currentTime = Date.now();
    if ((currentTime - lastUpdate) > 100) {
      const diffTime = currentTime - lastUpdate;
      lastUpdate = currentTime;

      const { x, y, z } = acceleration;

      if (lastX !== undefined) {
        // Cálculo de velocidad/fuerza del movimiento
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        
        // Suma vectorial simple para detectar cambios bruscos
        const totalMovement = deltaX + deltaY + deltaZ;
        const speed = (totalMovement / diffTime) * 10000;

        if (speed > 800) { // Umbral de velocidad estándar para agitar
          if (onShake) onShake();
          // Feedback vibración si es posible
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }
  };

  useEffect(() => {
    // Si no es iOS, intentamos registrarlo directamente
    if (typeof DeviceMotionEvent === 'undefined' || typeof DeviceMotionEvent.requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotion);
      setPermissionStatus('granted');
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return { permissionStatus, requestPermission };
};
