import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

/**
 * Hook para gestionar el estado y verificación de la caracterización del estudiante.
 * @param {string} userId - ID del usuario de Supabase.
 * @returns {object} { profileCompleted, characterizationData, checkCharacterization, loading }
 */
export const useCharacterization = (userId) => {
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [characterizationData, setCharacterizationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCharacterization = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characterization')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (data) {
        setProfileCompleted(true);
        setCharacterizationData(data);
      } else {
        setProfileCompleted(false);
        setCharacterizationData(null);
      }
    } catch (err) {
      console.error('Error checking characterization:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { 
    profileCompleted, 
    characterizationData, 
    checkCharacterization, 
    loading,
    setProfileCompleted 
  };
};
