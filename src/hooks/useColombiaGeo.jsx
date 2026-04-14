import { useState, useEffect, useMemo } from 'react';

/**
 * Hook para obtener departamentos y municipios de Colombia
 * Utiliza la API de Datos Abiertos de Colombia (Socrata)
 */
const useColombiaGeo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                // Socrata API para División Político Administrativa (DIVIPOLA - DANE)
                // Recurso actualizado: gdxc-w37w
                const response = await fetch('https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=5000');
                if (!response.ok) throw new Error('Error al conectar con la API de Datos Abiertos');
                
                const result = await response.json();
                
                // Mapeamos los campos para mantener compatibilidad con los componentes existentes
                // dpto -> departamento, nom_mpio -> municipio
                const mappedData = result.map(item => ({
                    ...item,
                    departamento: item.dpto,
                    municipio: item.nom_mpio
                }));

                setData(mappedData);
                setLoading(false);
            } catch (err) {
                console.error('Geo API Error:', err);
                setError(err.message);
                
                // Opcional: Podríamos cargar un set mínimo de datos aquí si la API falla
                setLoading(false);
            }
        };

        fetchGeoData();
    }, []);

    // Lista de departamentos únicos ordenada alfabéticamente
    const departments = useMemo(() => {
        if (!data.length) return [];
        const uniqueDepts = [...new Set(data.map(item => item.departamento))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
        return uniqueDepts;
    }, [data]);

    /**
     * Obtiene los municipios de un departamento específico
     * @param {string} departmentName 
     */
    const getCitiesByDept = (departmentName) => {
        if (!departmentName || !data.length) return [];
        return data
            .filter(item => item.departamento === departmentName)
            .map(item => item.municipio)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
    };

    /**
     * Obtiene todos los municipios (para búsquedas globales como Lugar de Nacimiento)
     */
    const allCities = useMemo(() => {
        if (!data.length) return [];
        return [...new Set(data.map(item => item.municipio))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
    }, [data]);

    return { 
        departments, 
        getCitiesByDept, 
        allCities,
        loading, 
        error 
    };
};

export default useColombiaGeo;
