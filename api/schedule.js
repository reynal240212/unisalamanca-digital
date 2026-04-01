import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './_utils/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'UniSalamanca-Digital-Identity-Safe-2026-Keys';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // 1. Obtener inscripciones vigentes con detalles de materia y horario
    const { data: schedule, error } = await supabaseAdmin
      .from('student_enrollments')
      .select(`
        id,
        period_id,
        academic_periods (name, is_active),
        subjects (
          id,
          name,
          semester,
          credits,
          subject_schedules (
            day_of_week,
            start_time,
            end_time,
            classroom
          )
        )
      `)
      .eq('user_id', userId)
      .eq('academic_periods.is_active', true);

    if (error) throw error;

    // 2. Formatear la respuesta para el frontend
    const formattedSchedule = schedule.map(item => ({
      enrollmentId: item.id,
      period: item.academic_periods.name,
      subject: item.subjects.name,
      semester: item.subjects.semester,
      credits: item.subjects.credits,
      blocks: item.subjects.subject_schedules
    }));

    return res.status(200).json({ schedule: formattedSchedule });
  } catch (err) {
    console.error('Schedule Fetch Error:', err);
    return res.status(401).json({ error: 'Token inválido o error de sistema' });
  }
}
