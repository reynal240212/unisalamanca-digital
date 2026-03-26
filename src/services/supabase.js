import { createClient } from '@supabase/supabase-js'

// Public credentials - the anon key is safe to expose (it's the public key)
// These are also read from env vars if available (for local overrides)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
  || 'https://znwpyikzhsldykwaqaoh.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3B5aWt6aHNsZHlrd2FxYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDYxNzAsImV4cCI6MjA4OTAyMjE3MH0.gvQnlt7k55YMYjPhCAgnMEGrVB37H8nvRMHOPUqpJek'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
