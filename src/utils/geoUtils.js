/**
 * Utilidades de Geolocalización para UniSalamanca (Sede Barranquilla)
 */

// Coordenadas Sede Principal Barranquilla (CUES: Carrera 50 #79-155)
export const UNISALAMANCA_HQ = {
  lat: 11.0011,
  lng: -74.8117,
  radiusKm: 0.5 // 500 metros de margen
};

/**
 * Calcula la distancia entre dos puntos (Fórmula de Haversine)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distancia en Kilómetros
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Verifica si unas coordenadas están dentro del perímetro de la universidad
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export const isInCampusPerimeter = (lat, lng) => {
  const distance = calculateDistance(lat, lng, UNISALAMANCA_HQ.lat, UNISALAMANCA_HQ.lng);
  return distance <= UNISALAMANCA_HQ.radiusKm;
};

/**
 * Obtiene la ubicación actual del dispositivo
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada por el navegador"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};
