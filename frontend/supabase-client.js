// Configuración Global de Supabase para UniSalamanca
const SUPABASE_URL = "https://znwpyikzhsldykwaqaoh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3B5aWt6aHNsZHlrd2FxYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDYxNzAsImV4cCI6MjA4OTAyMjE3MH0.gvQnlt7k55YMYjPhCAgnMEGrVB37H8nvRMHOPUqpJek";

// El objeto 'supabase' es proporcionado por el CDN en el HTML
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
