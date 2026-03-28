-- TABLA: INFORMACIÓN INSTITUCIONAL
CREATE TABLE IF NOT EXISTS university_info (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category TEXT NOT NULL, -- 'mision', 'bienestar', 'contacto'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: PROGRAMAS ACADÉMICOS
CREATE TABLE IF NOT EXISTS academic_programs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  program_type TEXT NOT NULL, -- 'Tecnológico', 'Profesional'
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  career_profile TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: PÉNSUM (MATERIAS POR SEMESTRE)
CREATE TABLE IF NOT EXISTS program_curriculum (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  program_id BIGINT REFERENCES academic_programs(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  subjects TEXT NOT NULL, -- Lista de materias separadas por coma
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Lectura pública para la base de conocimiento
ALTER TABLE university_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_curriculum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read University Info" ON university_info FOR SELECT USING (true);
CREATE POLICY "Public read Programs" ON academic_programs FOR SELECT USING (true);
CREATE POLICY "Public read Curriculum" ON program_curriculum FOR SELECT USING (true);
