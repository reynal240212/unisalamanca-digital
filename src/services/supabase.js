import { createClient } from '@supabase/supabase-js'

const supabaseUrl = window.ENV?.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
