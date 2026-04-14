-- Corrección de errores de seguridad en Supabase
-- Ejecutar en el Editor SQL de Supabase

-- 0. Crear tabla semester si no existe
CREATE TABLE IF NOT EXISTS public.semester (
    id SERIAL PRIMARY KEY,
    semester_number INTEGER NOT NULL,
    semester_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de ejemplo si está vacía
INSERT INTO public.semester (semester_number, semester_name)
SELECT 1, 'Primer Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 1);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 2, 'Segundo Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 2);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 3, 'Tercer Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 3);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 4, 'Cuarto Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 4);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 5, 'Quinto Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 5);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 6, 'Sexto Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 6);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 7, 'Séptimo Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 7);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 8, 'Octavo Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 8);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 9, 'Noveno Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 9);
INSERT INTO public.semester (semester_number, semester_name)
SELECT 10, 'Décimo Semestre' WHERE NOT EXISTS (SELECT 1 FROM public.semester WHERE semester_number = 10);

-- 1. Habilitar RLS en la tabla characterization
ALTER TABLE public.characterization ENABLE ROW LEVEL SECURITY;

-- 2. Recrear la vista user_with_semester sin SECURITY DEFINER
DROP VIEW IF EXISTS public.user_with_semester;

CREATE OR REPLACE VIEW public.user_with_semester AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.document_type,
    u.document,
    u.program,
    u.semester,
    u.status,
    u.photo_url,
    u.created_at,
    s.semester_number,
    s.semester_name
FROM public.user u
LEFT JOIN public.semester s ON u.semester = s.id
WHERE u.role = 'student';

-- 3. Crear políticas RLS para characterization
CREATE POLICY "Public read characterization" ON public.characterization FOR SELECT USING (true);
CREATE POLICY "Authenticated insert characterization" ON public.characterization FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update characterization" ON public.characterization FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete characterization" ON public.characterization FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user WHERE id = auth.uid() AND role = 'admin')
);