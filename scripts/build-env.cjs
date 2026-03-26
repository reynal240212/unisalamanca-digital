const fs = require('fs');
const path = require('path');

// Support both SUPABASE_URL and VITE_SUPABASE_URL (Vercel may use either)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

const targetPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(targetPath, envContent);

console.log('✅ Vite environment configured (.env)');
console.log('   URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : '(empty!)');
