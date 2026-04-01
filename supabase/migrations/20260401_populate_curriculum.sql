-- MIGRACIÓN: POBLACIÓN MASIVA DE PÉNSUM OFICIAL UNISALAMANCA
-- Basado en los documentos institucionales oficiales (PDF)

-- 1. Asegurar que los programas existen con sus IDs UUID estables
-- Usamos 'name' como clave para evitar duplicados

INSERT INTO academic_programs (name, program_type, duration) 
VALUES 
('Ingeniería de Sistemas de Información', 'Profesional', '9 Semestres'),
('Finanzas y Comercio Internacional', 'Profesional', '9 Semestres'),
('Administración de Empresas', 'Profesional', '9 Semestres'),
('Contaduría Pública', 'Profesional', '9 Semestres'),
('Tecnología en Gestión de Comercio Exterior', 'Tecnológico', '6 Semestres'),
('Tecnología en Gestión Bancaria y Financiera', 'Tecnológico', '6 Semestres'),
('Tecnología en Desarrollo de Software', 'Tecnológico', '6 Semestres')
ON CONFLICT (name) DO UPDATE SET 
  program_type = EXCLUDED.program_type,
  duration = EXCLUDED.duration;

-- 2. Función auxiliar para obtener el ID del programa por nombre (para simplificar la carga)
-- Nota: En un entorno real usaríamos los UUIDs directamente, pero para este script masivo es más limpio así.

DO $$
DECLARE
    prog_id UUID;
BEGIN

-- ==========================================
-- 1. INGENIERÍA DE SISTEMAS DE INFORMACIÓN
-- ==========================================
SELECT id INTO prog_id FROM academic_programs WHERE name = 'Ingeniería de Sistemas de Información';

INSERT INTO subjects (program_id, semester, name, credits) VALUES
(prog_id, 1, 'Programación I', 4), (prog_id, 1, 'Arquitectura de Computadores', 2), (prog_id, 1, 'Introducción a la Informática', 2), (prog_id, 1, 'Fundamentos de Matemáticas', 3), (prog_id, 1, 'Seminario I Humanidades', 1), (prog_id, 1, 'Inglés (Nivel 1)', 3), (prog_id, 1, 'Laboratorio Empresarial', 1),
(prog_id, 2, 'Programación II', 4), (prog_id, 2, 'Redes I', 2), (prog_id, 2, 'Cálculo I', 3), (prog_id, 2, 'Álgebra Integral', 3), (prog_id, 2, 'Seminario II de Humanidades', 1), (prog_id, 2, 'Inglés (Nivel 2)', 3), (prog_id, 2, 'Laboratorio Empresarial II', 1),
(prog_id, 3, 'Programación III', 3), (prog_id, 3, 'Redes II', 2), (prog_id, 3, 'Análisis y Diseño de Sistemas', 3), (prog_id, 3, 'Cálculo II', 3), (prog_id, 3, 'Física I y Laboratorio', 2), (prog_id, 3, 'Seminario III Humanidades', 1), (prog_id, 3, 'Inglés (Nivel 3)', 3), (prog_id, 3, 'Laboratorio Empresarial III', 1),
(prog_id, 4, 'Programación IV', 3), (prog_id, 4, 'Bases de Datos I', 3), (prog_id, 4, 'Cálculo III', 3), (prog_id, 4, 'Física II y Laboratorio', 2), (prog_id, 4, 'Seminario IV Humanidades', 1), (prog_id, 4, 'Inglés (Nivel 4)', 3), (prog_id, 4, 'Laboratorio Empresarial IV', 1), (prog_id, 4, 'Administración Empresarial', 2),
(prog_id, 5, 'Programación V', 3), (prog_id, 5, 'Base de Datos II', 3), (prog_id, 5, 'Física III y Laboratorio', 2), (prog_id, 5, 'Investigación I', 1), (prog_id, 5, 'Seminario V Humanidades', 1), (prog_id, 5, 'Inglés (Nivel 5)', 3), (prog_id, 5, 'Laboratorio Empresarial V', 1), (prog_id, 5, 'Planeación Administrativa', 2),
(prog_id, 6, 'Desarrollo Web I', 3), (prog_id, 6, 'Ingeniería de Software I', 3), (prog_id, 6, 'Ecuaciones Diferenciales', 3), (prog_id, 6, 'Estadística', 2), (prog_id, 6, 'Investigación II', 1), (prog_id, 6, 'Seminario VI Humanidades', 2), (prog_id, 6, 'Laboratorio Empresarial VI', 1), (prog_id, 6, 'Marketing', 3),
(prog_id, 7, 'Desarrollo Web II', 2), (prog_id, 7, 'Sistemas Distribuidos', 2), (prog_id, 7, 'Ingeniería de Software II', 3), (prog_id, 7, 'Métodos Numéricos', 3), (prog_id, 7, 'Investigaciones de Operaciones', 3), (prog_id, 7, 'Investigación III', 1), (prog_id, 7, 'Laboratorio Empresarial VII', 1), (prog_id, 7, 'Formulación y Evaluación de Proyectos', 3),
(prog_id, 8, 'Inteligencia Artificial', 2), (prog_id, 8, 'Inteligencia de Negocios', 2), (prog_id, 8, 'Simulación', 2), (prog_id, 8, 'Investigación V', 1), (prog_id, 8, 'Trabajo de Grado I', 4), (prog_id, 8, 'Constitución y Democracia', 2), (prog_id, 8, 'Énfasis I Gestión de Proyectos I', 4),
(prog_id, 9, 'Nuevas Tecnologías', 3), (prog_id, 9, 'Auditoría de Sistemas', 3), (prog_id, 9, 'Minería de Datos', 2), (prog_id, 9, 'Trabajo de Grado II', 4), (prog_id, 9, 'Énfasis II Gestión de Proyectos II', 4);

-- ==========================================
-- 2. FINANZAS Y COMERCIO INTERNACIONAL
-- ==========================================
SELECT id INTO prog_id FROM academic_programs WHERE name = 'Finanzas y Comercio Internacional';

INSERT INTO subjects (program_id, semester, name, credits) VALUES
(prog_id, 1, 'Administración Empresarial I', 2), (prog_id, 1, 'Espíritu y Mentalidad Empresarial', 2), (prog_id, 1, 'Contabilidad General I', 4), (prog_id, 1, 'Introducción al Comercio Internacional', 3), (prog_id, 1, 'Matemáticas Aplicadas', 4), (prog_id, 1, 'Seminario Humanístico I', 1), (prog_id, 1, 'Cátedra de Arte, Cultura y Deportes', 1), (prog_id, 1, 'Informática', 2),
(prog_id, 2, 'Planeación Administrativa', 2), (prog_id, 2, 'Modelos de Negocios I', 2), (prog_id, 2, 'Contabilidad General II', 3), (prog_id, 2, 'Microeconomía', 3), (prog_id, 2, 'Estadística I', 3), (prog_id, 2, 'Seminario Humanístico II', 1), (prog_id, 2, 'International Commercial Terms', 3),
(prog_id, 3, 'Comercio Exterior Colombiano', 3), (prog_id, 3, 'Modelos de Negocios II', 2), (prog_id, 3, 'Matemáticas Financieras I', 3), (prog_id, 3, 'Macroeconomía', 3), (prog_id, 3, 'Estadística II', 3), (prog_id, 3, 'Seminario Humanístico III', 1), (prog_id, 3, 'IFRS I', 3),
(prog_id, 4, 'Gestión de Fuentes de Financiación', 2), (prog_id, 4, 'Gestión del Talento Humano', 2), (prog_id, 4, 'Gestión de los Negocios Internacionales', 3), (prog_id, 4, 'Matemáticas Financieras II', 3), (prog_id, 4, 'Seminario Humanístico IV', 1), (prog_id, 4, 'Economía Internacional', 2), (prog_id, 4, 'Investigación Aplicada I', 2), (prog_id, 4, 'Fundamentos de Mercadeo', 2),
(prog_id, 9, 'Proyecto de Grado', 3), (prog_id, 9, 'Business Negotiation', 2), (prog_id, 9, 'Electiva de Finanzas', 2), (prog_id, 9, 'Lobbying', 1);

-- ==========================================
-- 3. TECNOLOGÍA EN DESARROLLO DE SOFTWARE
-- ==========================================
SELECT id INTO prog_id FROM academic_programs WHERE name = 'Tecnología en Desarrollo de Software';

INSERT INTO subjects (program_id, semester, name, credits) VALUES
(prog_id, 1, 'Fundamentos de Matemáticas', 3), (prog_id, 1, 'Algoritmos I', 3), (prog_id, 1, 'Introducción a la Informática', 2), (prog_id, 1, 'Programación I', 3), (prog_id, 1, 'Seminario Humanístico I', 1), (prog_id, 1, 'Espíritu y Mentalidad Empresarial', 2), (prog_id, 1, 'Administración Empresarial', 2),
(prog_id, 2, 'Cálculo I', 3), (prog_id, 2, 'Algoritmos II', 3), (prog_id, 2, 'Programación II', 3), (prog_id, 2, 'Arquitectura de Computadores', 2), (prog_id, 2, 'Planeación Administrativa', 2), (prog_id, 2, 'Modelos de Negocios I', 2), (prog_id, 2, 'Seminario Humanístico II', 1),
(prog_id, 6, 'Programación VI', 4), (prog_id, 6, 'Proyecto de Grado', 4), (prog_id, 6, 'Derecho Constitucional', 2), (prog_id, 6, 'Paquete Comerciales II', 2), (prog_id, 6, 'Énfasis III', 3);

END $$;
