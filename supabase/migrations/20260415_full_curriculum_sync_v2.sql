-- UNI SALAMANCA - FULL CURRICULUM SYNC (v2)
-- FECHA: 15-04-2026

BEGIN;

-- 0. CREAR NUEVO PROGRAMA RECREACIÓN Y DEPORTES
INSERT INTO academic_programs (id, name, program_type, duration, description)
VALUES ('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 'Servicios de Recreación y Deportes', 'TÉCNICO LABORAL', '3 Semestres', 'Prepárate para liderar actividades recreativas, físicas y deportivas con enfoque en integración y bienestar.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, program_type = EXCLUDED.program_type;

-- 1. LIMPIAR MATERIAS EXISTENTES PARA LOS PROGRAMAS A ACTUALIZAR
DELETE FROM subjects WHERE program_id IN (
    'ef3e7b26-eba6-4d54-ae50-a290020eb3cd', -- Admin Emp
    '985a9f98-2191-4652-a485-0354483c0d90', -- Contaduría
    'af7abacd-c827-44c7-a731-2622761f8cf6', -- Ing Sistemas
    '00c1fecb-2705-4bfa-a7ac-978d01fd2c81', -- Finanzas
    'd4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', -- Soft Tech
    '368a199e-591f-4891-99b7-bf07ad20ad5a', -- Bancaria Tech
    '0ecd7e13-703b-45d8-9f69-41c514cce7bf', -- Comercio Tech
    '0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f'  -- Recreación
);

-- 2. INSERTAR MATERIAS: ADMINISTRACIÓN DE EMPRESAS (ef3e7b26-eba6-4d54-ae50-a290020eb3cd)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (19 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Administración Empresarial I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Espíritu y Mentalidad Empresarial', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Contabilidad General I', 4),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Informática', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Matemáticas Aplicadas', 4),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Seminario Humanístico I (Formación del Espíritu Científico)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Cátedra de Arte, Cultura y Deportes', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 1, 'Derecho Constitucional', 2),
-- S2 (17 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Administración Empresarial II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Modelos de Negocios I', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Contabilidad General II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Microeconomía', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Estadística I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Seminario Humanístico II (Competencias Comunicativas)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 2, 'Derecho Comercial', 2),
-- S3 (17 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Administración Empresarial III', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Modelos de Negocios II', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'International Financial Reporting Standards I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Macroeconomía', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Estadística II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Seminario Humanístico III (Interpretación y Argumentación)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 3, 'Derecho Laboral', 2),
-- S4 (19 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Gestión de Fuentes de Financiación', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Gestión del Talento Humano I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Derecho Tributario', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Matemáticas Financieras I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Seminario Humanístico IV (Competencias Ciudadanas)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Control Empresarial', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Fundamentos de Mercadeo', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 4, 'Investigación Aplicada I', 2),
-- S5 (17 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Finanzas I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Investigación de Mercados', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Gestión del Talento Humano II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Investigación Aplicada II', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Seminario Humanístico V (Liderazgo e Innovación)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Matemáticas Financieras II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 5, 'Electiva I (Talento Humano)', 2),
-- S6 (16 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'Finanzas II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'Gestión de la Calidad I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'Investigación de Operaciones', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'Seminario Humanístico VI (I+D+E+i)', 1),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'Administración de la Producción I', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 6, 'International Financial Reporting Standards for SMES', 3),
-- S7 (17 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Strategic Management', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Presupuestos', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Administración de la Producción II', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Diseño y Evaluación de Proyectos', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Gestión de la Calidad II', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Electiva II (Mercadeo)', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 7, 'Responsabilidad Social Empresarial', 1),
-- S8 (16 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Gestión de Proyectos de Inversión', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Electiva III (Finanzas)', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Ética y Desarrollo Profesional', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Énfasis I', 4),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Énfasis II', 4),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 8, 'Teorías Contemporáneas de la Administración', 2),
-- S9 (16 CR)
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Proyecto De Grado', 3),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Herramientas De Control De Gestión', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Business Negotiation', 2),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Énfasis III', 5),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Énfasis IV', 5),
('ef3e7b26-eba6-4d54-ae50-a290020eb3cd', 9, 'Lobbying', 1);

-- 3. INSERTAR MATERIAS: CONTADURÍA PÚBLICA (985a9f98-2191-4652-a485-0354483c0d90)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (19 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Administración Empresarial I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Contabilidad General I', 4),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Matemáticas Aplicadas', 4),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Espíritu y Mentalidad Empresarial', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Derecho Constitucional', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Informática', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Seminario Humanístico I', 1),
('985a9f98-2191-4652-a485-0354483c0d90', 1, 'Cátedra de Arte, Cultura y Deportes', 1),
-- S2 (17 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Planeación Administrativa', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Contabilidad General II', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Microeconomía', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Matemáticas Financieras I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Estadística I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Modelo de Negocios I', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 2, 'Seminario Humanístico II', 1),
-- S3 (17 CR) -- S3 extracted from IFRS...
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Macroeconomía', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Estadísticas II', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Matemáticas Financieras II', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'NIIF I - International Financial Reporting Standards I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Derecho Tributario', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Modelo de Negocios II', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 3, 'Seminario Humanístico III', 1),
-- S4 (19 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Gestión de Fuentes de Financiación', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Derecho Comercial', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Investigación Aplicada I', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'NIIF II - International Financial Reporting Standards II', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Software Contable I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Practica Tributaria I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Contabilidad de Costos', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 4, 'Seminario Humanístico IV', 1),
-- S5 (15 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Investigación Aplicada II', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Derecho Laboral', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'International Financial Reporting Standards III', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Finanzas I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Practica Tributaria II', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Desarrollo Talento Humano', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 5, 'Seminario Humanístico V', 1),
-- S6 (15 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'Electiva de Talento Humano', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'Servicios Informáticos Electrónicos', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'Epistemología Contable', 1),
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'Finanzas II', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'International Auditing Standards I', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 6, 'Software Contable II', 3),
-- S7 (14 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'Presupuestos', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'Diseño y Evaluación de Proyectos', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'Contabilidad Bancaria', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'International Auditing Standards II', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'Contabilidad Financiera', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 7, 'International Financial Reporting Standards For SMES', 3),
-- S8 (16 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Contabilidad Ambiental', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Ética y Desarrollo Profesional', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Electiva Contable', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Gestión de Proyectos de Inversión', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Énfasis Electivo I', 4),
('985a9f98-2191-4652-a485-0354483c0d90', 8, 'Énfasis Electivo II', 4),
-- S9 (16 CR)
('985a9f98-2191-4652-a485-0354483c0d90', 9, 'Contabilidad Forense', 2),
('985a9f98-2191-4652-a485-0354483c0d90', 9, 'Proyecto de Grado', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 9, 'Revisoría Fiscal', 3),
('985a9f98-2191-4652-a485-0354483c0d90', 9, 'Énfasis Electivo III', 4),
('985a9f98-2191-4652-a485-0354483c0d90', 9, 'Énfasis Electivo IV', 4);

-- 4. INSERTAR MATERIAS: INGENIERÍA DE SISTEMAS (af7abacd-c827-44c7-a731-2622761f8cf6)
-- (Usando OCR extendido para completar 9 semestres)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (16 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Programación I', 4),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Arquitectura de Computadores', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Introducción a la Informática', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Fundamentos de Matemáticas', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Seminario I Humanidades', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Ingles (Nivel I)', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 1, 'Laboratorio Empresarial', 1),
-- S2 (17 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Programación II', 4),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Redes I', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Calculo I', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Álgebra Integral', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Seminario II de Humanidades', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Ingles (Nivel 2)', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 2, 'Laboratorio Empresarial II', 1),
-- S3 (18 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Programación III', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Redes II', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Análisis y Diseño de Sistemas', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Calculo II', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Física I y Laboratorio', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Seminario III Humanidades', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Inglés (Nivel 3)', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 3, 'Laboratorio Empresarial III', 1),
-- S4 (18 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Programación IV', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Bases de Datos I', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Calculo III', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Física II y Laboratorio', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Seminario IV Humanidades', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Inglés (Nivel 4)', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Laboratorio Empresarial IV', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 4, 'Administración Empresarial', 2),
-- S5 (16 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Programación V', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Base de Datos II', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Física III y Laboratorio', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Investigación I', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Seminario V Humanidades', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Inglés (Nivel 5)', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Laboratorio Empresarial V', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 5, 'Planeación Administrativa', 2),
-- S6 (18 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Desarrollo Web I', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Ingeniería de Software I', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Ecuaciones Diferenciales', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Estadística', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Investigación II', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Seminario VI Humanidades', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Laboratorio Empresarial VI', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 6, 'Marketing', 3),
-- S7 (18 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Desarrollo Web II', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Sistemas Distribuidos', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Ingeniería de Software II', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Métodos Numéricos', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Investigaciones de Operaciones', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Investigación III', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Laboratorio Empresarial VII', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 7, 'Formulación y Evaluación de Proyectos', 3),
-- S8 (17 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Inteligencia Artificial', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Inteligencia de Negocios', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Simulación', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Investigación V', 1),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Trabajo de Grado I', 4),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Constitución y Democracia', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 8, 'Énfasis I Gestión de Proyectos I', 4),
-- S9 (16 CR)
('af7abacd-c827-44c7-a731-2622761f8cf6', 9, 'Nuevas Tecnologías', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 9, 'Auditoria de Sistemas', 3),
('af7abacd-c827-44c7-a731-2622761f8cf6', 9, 'Minería de Datos', 2),
('af7abacd-c827-44c7-a731-2622761f8cf6', 9, 'Trabajo de Grado II', 4),
('af7abacd-c827-44c7-a731-2622761f8cf6', 9, 'Énfasis I Gestión de Proyectos II', 4);

-- 5. INSERTAR MATERIAS: FINANZAS Y COMERCIO INTERNACIONAL (00c1fecb-2705-4bfa-a7ac-978d01fd2c81)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (19 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Administración Empresarial I', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Espíritu y Mentalidad Empresarial', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Contabilidad General I', 4),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Introducción al Comercio Internacional', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Matemáticas Aplicadas', 4),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Seminario Humanístico I (Formación del Espíritu Científico)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Cátedra de Arte, Cultura y Deportes', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 1, 'Informática', 2),
-- S2 (17 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Planeación Administrativa', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Modelos de Negocios I', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Contabilidad General II', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Microeconomía', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Estadística I', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'Seminario Humanístico II (Competencias Comunicativas)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 2, 'International Commercial Terms', 3),
-- S3 (18 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Comercio Exterior Colombiano', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Modelos de Negocios II', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Matemáticas Financieras I', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Macroeconomía', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Estadística II', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'Seminario Humanístico III (Interpretación y Argumentación)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 3, 'International Financial Reporting Standard I', 3),
-- S4 (19 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Gestión de Fuentes de Financiación', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Gestión del Talento Humano', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Gestión de los Negocios Internacionales', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Matemáticas Financieras II', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Seminario Humanístico IV (Competencias Ciudadanas)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Derecho Comercial', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Economía Internacional', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Investigación Aplicada I', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 4, 'Fundamentos de Mercadeo', 2),
-- S5 (16 CR, according to OCR footer but actually has many subjects)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Finanzas I', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Derecho Internacional', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Gestión del Talento Humano II', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Investigación Aplicada II', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Seminario Humanístico V (Liderazgo e Innovación)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Matemáticas Financieras II (Repeated in PDF but valid for credits)', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Electiva de Talento Humano', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Derecho Laboral', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Marketing Digital', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 5, 'Derecho Constitucional', 2),
-- S6 (15 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Finanzas II', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Mercado de Capitales', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Investigación de Mercados', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Seminario Humanístico VI (I+D+E+i)', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Logística y Distribución Física Internacional', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 6, 'Aranceles', 3),
-- S7 (15 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Presupuestos', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Electiva de Mercadeo', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Legislación Aduanera', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Diseño y Evaluación de Proyectos', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Geopolítica', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 7, 'Responsabilidad Social Empresarial', 2),
-- S8 (17 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Gestión de Proyectos de Inversión', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Análisis del Riesgo', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Ética y Desarrollo Profesional', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Énfasis I', 4),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Énfasis II', 4),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 8, 'Plan de Internacionalización de Empresas', 2),
-- S9 (16 CR)
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Proyecto De Grado', 3),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Business Negotiation', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Electiva de Finanzas', 2),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Lobbying', 1),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Énfasis III', 4),
('00c1fecb-2705-4bfa-a7ac-978d01fd2c81', 9, 'Énfasis IV', 4);

-- 6. INSERTAR MATERIAS: TECNOLOGÍA EN DESARROLLO DE SOFTWARE (d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (17 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Fundamentos De Matemáticas', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Algoritmos I', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Introducción a la Informática', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Cátedra De Arte, Cultura Y Deporte', 1),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Programación I', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Seminario Humanístico I', 1),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Espíritu Y Mentalidad Empresarial', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 1, 'Administración Empresarial', 2),
-- S2 (16 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Calculo I', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Algoritmos II', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Programación II', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Arquitectura de Computadores', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Planeación Administrativa', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Modelos De Negocios I', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 2, 'Seminario Humanístico II', 1),
-- S3 (17 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Calculo II', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Bases de Datos I', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Física I', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Programación III', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Redes', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Seminario Humanístico III', 1),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 3, 'Modelos De Negocios II', 2),
-- S4 (17 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Análisis y Diseño de Sistemas', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Álgebra Lineal', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Bases de Datos II', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Física II', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Programación IV', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Investigación Aplicada I', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Seminario Humanístico IV', 1),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Gestión De Fuentes De Financiación', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 4, 'Énfasis I', 2),
-- S5 (18 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Ecuaciones Diferenciales', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Sistemas Operativos En Redes', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Física III', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Programación V', 4),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Énfasis II', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Investigación Aplicada II', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 5, 'Paquetes Comerciales I', 2),
-- S6 (18 CR)
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Programación VI', 4),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Proyecto de Grado', 4),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Derecho Constitucional', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Paquete Comerciales II', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Énfasis III', 3),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Seminario de Actualización', 2),
('d4c9c4b4-4ccf-4b3f-a2f9-bb79741c58cc', 6, 'Seminario Humanístico V', 1);

-- 7. INSERTAR MATERIAS: TECNOLOGÍA EN GESTIÓN BANCARIA Y FINANCIERA (368a199e-591f-4891-99b7-bf07ad20ad5a)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (17 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Administración Empresarial I', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Espíritu y Mentalidad Emprendedora', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Microeconomía', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Contabilidad General', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Informática', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Matemáticas Aplicadas', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Seminario Humanístico I', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Derecho Constitucional', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 1, 'Cátedra Arte Cultura y Deporte', 1),
-- S2 (16 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Planeación Administrativa', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Modelo de Negocios I', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Macroeconomía', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Derecho Comercial', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Contabilidad General II', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Seminario Humanístico II', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Matemáticas Financieras I', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 2, 'Contabilidad de Costos', 2),
-- S3 (17 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Modelo de Negocios II', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Presupuestos', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Gestión del Talento Humano', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Derecho Laboral', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Estadística I', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Seminario Humanístico III', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Matemáticas Financieras II', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 3, 'Fundamentos de Mercadeo', 2),
-- S4 (18 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Finanzas I', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Gestión de Fuentes de Financiación', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'NIIF I-International Financial Reporting Standards I', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Seminario Humanístico IV', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Electiva de Talento Humano', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Mercados Financieros', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Estadística II', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 4, 'Investigación Aplicada I', 2),
-- S5 (16 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Ética y Desarrollo Profesional', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Seminario Humanístico V', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Finanzas II', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Laboratorio Contable', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Investigación Aplicada II', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Tesorería Financiera', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 5, 'Diseño y Evaluación de Proyectos', 3),
-- S6 (16 CR)
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Seminario Humanístico VI', 1),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Software Contable', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Análisis de Riesgo', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Mercado de Capitales', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Práctica Empresarial Externa', 2),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Proyecto de Grado', 3),
('368a199e-591f-4891-99b7-bf07ad20ad5a', 6, 'Electiva de Finanzas', 2);

-- 8. INSERTAR MATERIAS: RECREACIÓN Y DEPORTES (0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f)
INSERT INTO subjects (program_id, semester, name, credits) VALUES
-- S1 (Malla sugerida según PDF)
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Metodología De Las Clases Grupales', 3),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Elaboración Material Recreo Deportivo', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Escenarios Deportivos', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Introducción A La Pedagogía', 3),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Normatividad Deportiva', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Primeros Auxilios', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 1, 'Anatomía Humana', 3),
-- S2 (Plan Carrera)
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Acondicionamiento Físico', 3),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Juegos Y Lúdicas', 3),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Habilidades Comunicativas', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Mentalidad Empresarial', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Atención Y Servicio Al Cliente', 2),
('0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 2, 'Aplicaciones Informáticas Y Herramientas Digitales', 2);

COMMIT;
