-- MIGRACIÓN: GESTIÓN ACADÉMICA (PERIODOS, MATERIAS Y HORARIOS)

-- 1. PERIODOS ACADÉMICOS (Ej: 2026-1, 2026-2)
CREATE TABLE IF NOT EXISTS academic_periods (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- Ej: '2026-1'
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MATERIAS (Estructura detallada)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  program_id UUID REFERENCES academic_programs(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HORARIOS DE MATERIAS
-- Siguiendo los bloques: 6:00 AM - 7:45 PM y 7:45 PM - 9:00 PM
CREATE TABLE IF NOT EXISTS subject_schedules (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- 'Lunes', 'Martes', etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  classroom TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_times CHECK (start_time < end_time)
);

-- 4. INSCRIPCIONES (Relación Estudiante - Materia - Periodo)
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID REFERENCES public.user(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  period_id UUID REFERENCES academic_periods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, period_id) -- Evita duplicados
);

-- CONFIGURACIÓN DE RLS (SEGURIDAD)
ALTER TABLE academic_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura
CREATE POLICY "Public read periods" ON academic_periods FOR SELECT USING (true);
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read schedules" ON subject_schedules FOR SELECT USING (true);

-- Los estudiantes solo ven sus propias inscripciones
CREATE POLICY "Users view own enrollments" ON student_enrollments 
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM public.user WHERE id = auth.uid()) = 'ADMIN');

-- INSERTAR DATOS INICIALES DE PRUEBA (PERIODOS)
INSERT INTO academic_periods (name, is_active) VALUES 
('2026-1', true),
('2026-2', false)
ON CONFLICT (name) DO NOTHING;
