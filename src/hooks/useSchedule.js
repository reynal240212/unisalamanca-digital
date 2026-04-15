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
      setError(null);
      // Consulta 3NF con HINTS explícitos de llaves foráneas
      const { data, error: err } = await supabase
        .from('academic_enrollments')
        .select(`
          id,
          status,
          academic_sections!academic_enrollments_section_id_fkey (
            id,
            subjects!academic_sections_subject_id_fkey (id, name, credits),
            teacher:user!academic_sections_teacher_id_fkey (id, name),
            academic_periods!academic_sections_period_id_fkey (name),
            schedule_blocks (*)
          )
        `)
        .eq('student_id', userId);

      if (err) throw err;

      console.log('API RESPONSE [useSchedule]:', { userId, count: data?.length, data });

      const formatted = (data || []).map(enrollment => {
        const sec = enrollment.academic_sections;
        if (!sec) return null;

        const subjectData = sec.subjects;
        const teacherData = sec.teacher;
        const periodData = sec.academic_periods;

        return {
          id: enrollment.id,
          section_id: sec.id,
          subject: (Array.isArray(subjectData) ? subjectData[0] : subjectData)?.name || 'Materia desconocida',
          teacher: (Array.isArray(teacherData) ? teacherData[0] : teacherData)?.name || 'Sin asignar',
          credits: (Array.isArray(subjectData) ? subjectData[0] : subjectData)?.credits || 0,
          period: (Array.isArray(periodData) ? periodData[0] : periodData)?.name || 'N/A',
          blocks: sec.schedule_blocks || [],
        };
      }).filter(Boolean);

      setSchedule(formatted);
    } catch (err) {
      console.error('FETCH ERROR [useSchedule]:', err);
      setError('Error al cargar horario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [userId]);

  return { schedule, loading, error, refetch: fetchSchedule };
};
