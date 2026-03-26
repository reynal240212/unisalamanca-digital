const fs = require('fs');
const path = require('path');

// Extract Supabase credentials from environment or default strings
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Content for Vite .env file
const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

// Save directly to project root as .env (Vite standard)
const targetPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(targetPath, envContent);

// Also update src/env.js for backward compatibility during transition if needed
const legacyPath = path.join(__dirname, '..', 'src', 'env.js');
const legacyContent = `window.ENV = {
  SUPABASE_URL: "${supabaseUrl}",
  SUPABASE_ANON_KEY: "${supabaseAnonKey}"
};`;
fs.writeFileSync(legacyPath, legacyContent);

console.log('✅ Environment configuration (.env) generated for Vite');
