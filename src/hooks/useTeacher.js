import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export const useTeacher = (teacherId) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeClass, setActiveClass] = useState(null);

  const fetchSubjects = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const { data: sections, error } = await supabase
        .from('academic_sections')
        .select(`
          id,
          subject:subjects(id, name, credits),
          period:academic_periods(name),
          blocks:schedule_blocks(*)
        `)
        .eq('teacher_id', teacherId);

      if (error) throw error;

      const formatted = (sections || []).map(sec => ({
        id: sec.id,
        subject: sec.subject.name,
        subject_id: sec.subject.id,
        period: sec.period.name,
        credits: sec.subject.credits,
        schedule_blocks: sec.blocks || []
      }));
      
      setSubjects(formatted);
      return formatted;
    } catch (err) {
      console.error("Error fetching academic load:", err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const detectLiveClass = useCallback((currentSubjects) => {
    const list = currentSubjects || subjects;
    if (!list.length) return;

    const daysArr = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const now = new Date();
    const currentDay = daysArr[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const live = list.find(s => {
      return (s.schedule_blocks || []).some(b => {
        if (b.day_of_week !== currentDay) return false;
        
        const [hStart, mStart] = b.start_time.split(':').map(Number);
        const [hEnd, mEnd] = b.end_time.split(':').map(Number);
        
        const startTimeInMin = hStart * 60 + mStart;
        const endTimeInMin = hEnd * 60 + mEnd;
        
        return currentTime >= (startTimeInMin - 15) && currentTime <= endTimeInMin;
      });
    });

    setActiveClass(live || null);
  }, [subjects]);

  return {
    subjects,
    loading,
    activeClass,
    fetchSubjects,
    detectLiveClass
  };
};
