import { createClient } from '@supabase/supabase-js'

// Public credentials - the anon key is safe to expose (it's the public key)
// These are also read from env vars if available (for local overrides)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
