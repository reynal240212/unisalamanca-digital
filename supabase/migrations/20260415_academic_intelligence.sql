-- MIGRACIÓN: INTELIGENCIA ACADÉMICA Y VALIDACIÓN DE HORARIOS
-- Proyecto: UniSalamanca Digital

-- 1. TABLA DE CONFIGURACIÓN ACADÉMICA (Fechas y Parciales)
CREATE TABLE IF NOT EXISTS academic_config (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    period_id UUID REFERENCES academic_periods(id),
    semester_start DATE NOT NULL,
    exam_weeks INTEGER[] DEFAULT '{6, 12, 18}', -- Semanas estándar de parciales
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(period_id)
);

-- 2. TABLA DE PRERREQUISITOS
-- Define que para ver la materia B, debes haber pasado la materia A
CREATE TABLE IF NOT EXISTS subject_prerequisites (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    prerequisite_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    min_grade NUMERIC DEFAULT 3.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, prerequisite_id)
);

-- 3. TABLA DE SALONES (Aulas)
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    capacity INTEGER DEFAULT 30,
    location TEXT, -- Ej: 'Bloque A, Piso 2'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTUALIZAR INSCRIPCIONES Y BLOQUES
-- Añadir grado y estado extendido
ALTER TABLE academic_enrollments ADD COLUMN IF NOT EXISTS final_grade NUMERIC;
-- El status ya existe, pero aseguramos que acepte estados de progreso
-- status: 'ACTIVE', 'COMPLETED', 'FAILED', 'WITHDRAWN'

-- Añadir salón a los bloques
ALTER TABLE schedule_blocks ADD COLUMN IF NOT EXISTS classroom_id UUID REFERENCES classrooms(id);

-- 5. FUNCIÓN DE DETECCIÓN DE CHOQUES DE HORARIO
-- Esta función verifica si un bloque de tiempo se cruza con otro
CREATE OR REPLACE FUNCTION check_schedule_overlap(
    p_day TEXT,
    p_start TIME,
    p_end TIME,
    p_existing_start TIME,
    p_existing_end TIME
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN (p_start < p_existing_end AND p_end > p_existing_start);
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER PARA PREVENIR CHOQUES DE HORARIO
-- Verifica conflictos para Docentes, Alumnos y Salones
CREATE OR REPLACE FUNCTION fn_prevent_schedule_conflict()
RETURNS TRIGGER AS $$
DECLARE
    v_section_teacher UUID;
    v_conflict_info TEXT;
BEGIN
    -- Obtener el profesor de la sección actual
    SELECT teacher_id INTO v_section_teacher 
    FROM academic_sections 
    WHERE id = NEW.section_id;

    -- 1. VALIDAR CHOQUE DE PROFESOR
    IF EXISTS (
        SELECT 1 FROM schedule_blocks sb
        JOIN academic_sections as2 ON sb.section_id = as2.id
        WHERE as2.teacher_id = v_section_teacher
        AND sb.day_of_week = NEW.day_of_week
        AND check_schedule_overlap(NEW.day_of_week, NEW.start_time, NEW.end_time, sb.start_time, sb.end_time)
        AND sb.id <> NEW.id -- Evitar compararse consigo mismo en actualizaciones
    ) THEN
        RAISE EXCEPTION 'EL DOCENTE YA TIENE UNA CLASE EN ESTE HORARIO.';
    END IF;

    -- 2. VALIDAR CHOQUE DE SALÓN
    IF NEW.classroom_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM schedule_blocks sb
        WHERE sb.classroom_id = NEW.classroom_id
        AND sb.day_of_week = NEW.day_of_week
        AND check_schedule_overlap(NEW.day_of_week, NEW.start_time, NEW.end_time, sb.start_time, sb.end_time)
        AND sb.id <> NEW.id
    ) THEN
        RAISE EXCEPTION 'EL SALÓN YA ESTÁ OCUPADO EN ESTE HORARIO.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_schedule_conflict ON schedule_blocks;
CREATE TRIGGER trg_prevent_schedule_conflict
BEFORE INSERT OR UPDATE ON schedule_blocks
FOR EACH ROW EXECUTE FUNCTION fn_prevent_schedule_conflict();

-- 7. POLÍTICAS DE RLS PARA NUEVAS TABLAS
ALTER TABLE academic_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read academic config" ON academic_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read prerequisites" ON subject_prerequisites FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read classrooms" ON classrooms FOR SELECT TO anon, authenticated USING (true);

-- 8. POBLAR ALGUNOS SALONES INICIALES
INSERT INTO classrooms (name, capacity, location) VALUES
('Aula 101', 35, 'Bloque A - Piso 1'),
('Aula 202', 30, 'Bloque A - Piso 2'),
('Laboratorio de Software I', 25, 'Bloque B - Piso 1'),
('Sala de Audiovisuales', 50, 'Biblioteca - Piso 1')
ON CONFLICT (name) DO NOTHING;
