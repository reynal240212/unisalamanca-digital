const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

const targetPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(targetPath, envContent);

console.log('✅ Vite environment configured (.env)');
