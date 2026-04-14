const fs = require('fs');
const path = require('path');

// Support both SUPABASE_URL and VITE_SUPABASE_URL (Vercel may use either)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const targetPath = path.join(__dirname, '..', '.env');

// SAFEGUARD: If env variables are empty and .env already exists, don't overwrite it.
if (!supabaseUrl && !supabaseAnonKey && fs.existsSync(targetPath)) {
  const existingContent = fs.readFileSync(targetPath, 'utf8');
  if (existingContent.includes('VITE_SUPABASE_URL=https')) {
    console.log('ℹ️  Using existing .env configuration (environment variables are empty).');
    process.exit(0);
  }
}

const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

fs.writeFileSync(targetPath, envContent);

console.log('✅ Vite environment configured (.env)');
console.log('   URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : '(empty!)');
