-- MIGRACIÓN: GEOLOCALIZACIÓN Y ASISTENCIA AUTOMATIZADA
-- Fecha: 2026-04-15

-- 1. Actualizar access_logs para incluir coordenadas del Validador
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='access_logs' AND column_name='latitude') THEN
        ALTER TABLE access_logs ADD COLUMN latitude NUMERIC(10, 8);
        ALTER TABLE access_logs ADD COLUMN longitude NUMERIC(11, 8);
    END IF;
END $$;

-- 2. Tabla de Asignaciones de Profesores (Si no existe)
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  teacher_id UUID REFERENCES public.user(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  period_id UUID REFERENCES academic_periods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, period_id)
);

-- 3. Tabla de Asistencia a Clase
CREATE TABLE IF NOT EXISTS class_attendance (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  student_id UUID REFERENCES public.user(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.user(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES subject_schedules(id) ON DELETE CASCADE,
  period_id UUID REFERENCES academic_periods(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PRESENT', -- PRESENT, LATE, ABSENT
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  is_in_perimeter BOOLEAN DEFAULT true,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_attendance ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Professors view own assignments" ON teacher_assignments 
  FOR SELECT USING (auth.uid() = teacher_id OR (SELECT role FROM public.user WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "Professors manage own attendance" ON class_attendance 
  FOR ALL USING (auth.uid() = teacher_id OR (SELECT role FROM public.user WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "Students view own attendance" ON class_attendance 
  FOR SELECT USING (auth.uid() = student_id);
