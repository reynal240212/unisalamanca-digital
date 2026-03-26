// Configuración Global de Supabase para UniSalamanca
// Las llaves se cargan desde env.js (Vercel Environment)
if (!window.ENV) {
    console.warn("⚠️ Advertencia: window.ENV no está definido. Asegúrate de que env.js se cargue antes.");
}

const SUPABASE_URL = window.ENV ? window.ENV.SUPABASE_URL : "";
const SUPABASE_ANON_KEY = window.ENV ? window.ENV.SUPABASE_ANON_KEY : "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("❌ Error: SUPABASE_URL o SUPABASE_ANON_KEY están vacíos.");
} else {
    console.log("✅ Conectando a Supabase:", SUPABASE_URL);
}

// El objeto 'supabase' es proporcionado por el CDN en el HTML
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
