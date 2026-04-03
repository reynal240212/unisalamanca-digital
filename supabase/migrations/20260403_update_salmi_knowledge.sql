-- ACTUALIZACIÓN DE CONOCIMIENTO PARA SALMI AI

-- 1. Insertar Programas Faltantes
INSERT INTO academic_programs (name, program_type, duration, description, pdf_url, career_profile)
VALUES 
('Ingeniería de Sistemas de Información', 'Profesional', '9 Semestres', 'Lidera la transformación digital y el desarrollo de soluciones tecnológicas complejas.', '/assets/INGENIERIA-SISTEMAS-ACTUAL.pdf', 'Director de TI, Arquitecto de Software, Analista de Ciberseguridad.'),
('Finanzas y Comercio Internacional', 'Profesional', '9 Semestres', 'Domina los mercados globales y la gestión financiera estratégica.', '/assets/FINANZAS-COMERCIO-ACTUAL.pdf', 'Analista Financiero, Gestor de Exportaciones, Trader Internacional.'),
('Gestión Bancaria y Financiera', 'Tecnología', '6 Semestres', 'Especialízate en el sector bancario, riesgos y servicios financieros.', '/assets/GESTION-BANCARIA-ACTUAL.pdf', 'Asesor Financiero, Analista de Crédito, Coordinador de Cartera.'),
('Auxiliar Administrativo', 'Técnico Laboral', '3 Semestres', 'Desarrolla habilidades fundamentales para el apoyo en oficinas y gestión empresarial.', '/assets/TECNICO-ADMINISTRATIVO-ACTUAL.pdf', 'Asistente de Oficina, Auxiliar de Recursos Humanos, Apoyo Administrativo.'),
('Auxiliar de Seguridad en el Trabajo', 'Técnico Laboral', '3 Semestres', 'Formación técnica en prevención de riesgos laborales y salud ocupacional.', '/assets/TECNICO-SEGURIDAD-ACTUAL.pdf', 'Auxiliar SST, Inspector de Seguridad, Gestor de Riesgos.'),
('Bodega y Distribución', 'Técnico Laboral', '3 Semestres', 'Optimiza los procesos de logística, almacenamiento y cadena de suministro.', '/assets/TECNICO-BODEGA-ACTUAL.pdf', 'Auxiliar de Logística, Gestor de Inventarios, Despachador.'),
('Mecánica Automotriz', 'Técnico Laboral', '3 Semestres', 'Mantenimiento preventivo y correctivo de vehículos con tecnología moderna.', '/assets/TECNICO-MECANICA-ACTUAL.pdf', 'Técnico Mecánico, Jefe de Taller, Especialista en Motores.');

-- 2. Expandir Información Institucional (FAQs y Procesos)
INSERT INTO university_info (category, title, content)
VALUES 
('admisiones', 'Proceso de Inscripción', 'Para inscribirte sigue estos pasos: 1. Registra tus datos en el portal. 2. Sube tus documentos (Acta de Grado, ICFES, Documento). 3. Entrevista con admisiones. 4. Pago de matrícula.'),
('inscripcion', 'Requisitos de Grado', 'Para graduarte debes cumplir con: 1. Total de créditos aprobados. 2. Práctica profesional calificada. 3. Opción de grado (Tesis o Diplomado). 4. Certificación de Inglés Nivel B1.'),
('contacto', 'Horarios de Atención', 'Atención en Sede Barranquilla: Lunes a Viernes de 8:00 AM a 6:00 PM (Jornada Continua). Sábados de 8:00 AM a 12:00 PM.'),
('bienestar', 'Apoyo Financiero', 'Contamos con convenios con ICETEX, Comfamiliar y diferentes entidades bancarias para financiar tu carrera. Pregunta por el plan "Bellota de Oro" para descuentos por promedio.');
