import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://znwpyikzhsldykwaqaoh.supabase.co'
// Service role key is secret and ONLY for the server
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Using anon key as fallback (less secure).')
}

// Clients for different purposes
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY
)

export const supabase = createClient(
  supabaseUrl,
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3B5aWt6aHNsZHlrd2FxYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDYxNzAsImV4cCI6MjA4OTAyMjE3MH0.gvQnlt7k55YMYjPhCAgnMEGrVB37H8nvRMHOPUqpJek'
)
