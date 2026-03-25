// Configuración Global de Supabase para UniSalamanca
// Las llaves se cargan desde env.js (Vercel Environment)
const SUPABASE_URL = window.ENV ? window.ENV.SUPABASE_URL : "";
const SUPABASE_ANON_KEY = window.ENV ? window.ENV.SUPABASE_ANON_KEY : "";

// El objeto 'supabase' es proporcionado por el CDN en el HTML
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
