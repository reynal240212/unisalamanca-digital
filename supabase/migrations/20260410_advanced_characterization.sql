-- 1. EXTENDER LA TABLA DE USUARIOS PARA MANEJO DE FOTOS CON APROBACIÓN
ALTER TABLE public.user 
ADD COLUMN IF NOT EXISTS photo_status TEXT DEFAULT 'approved' CHECK (photo_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS pending_photo_url TEXT;

-- 2. EXTENDER TABLA DE CARACTERIZACIÓN CON MÁS DATOS
ALTER TABLE public.characterization
ADD COLUMN IF NOT EXISTS document_type TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS disability TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS has_children TEXT,
ADD COLUMN IF NOT EXISTS work_company TEXT,
ADD COLUMN IF NOT EXISTS work_role TEXT,
ADD COLUMN IF NOT EXISTS emergency_relationship TEXT;

-- 3. CONFIGURAR STORAGE PARA AVATARES (Bucket y RLS)
-- Nota: Esto asume que el esquema 'storage' existe (estándar en Supabase)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Lectura pública para todos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Política: Los usuarios pueden subir solo a su propia carpeta (user_id/nombre.ext)
CREATE POLICY "User Upload Own" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Los usuarios pueden borrar sus propias fotos
CREATE POLICY "User Delete Own" ON storage.objects FOR DELETE 
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
