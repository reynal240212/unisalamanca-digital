import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useSchedule = (userId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('schedules')
        .select('*, schedule_blocks(*)')
        .eq('user_id', userId)
        .order('subject');

      if (err) throw err;

      // Adaptar estructura al formato que espera StudentSchedule
      const formatted = (data || []).map(s => ({
        id: s.id,
        subject: s.subject,
        teacher: s.teacher,
        credits: s.credits,
        period: s.period,
        program: s.program,
        blocks: s.schedule_blocks || [],
      }));

      setSchedule(formatted);
    } catch (err) {
      setError('No se pudo cargar el horario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [userId]);

  return { schedule, loading, error, refetch: fetchSchedule };
};
