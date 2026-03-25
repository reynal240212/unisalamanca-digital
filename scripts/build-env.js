const fs = require('fs');
const path = require('path');

const envContent = `window.ENV = {
  SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",
  SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY || ''}"
};`;

const targetPath = path.join(__dirname, '..', 'frontend', 'env.js');
const examplePath = path.join(__dirname, '..', 'frontend', 'env.example.js');

// Write the real env.js
fs.writeFileSync(targetPath, envContent);

// Write the template if it doesn't exist
if (!fs.existsSync(examplePath)) {
  const exampleContent = `window.ENV = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key"
};`;
  fs.writeFileSync(examplePath, exampleContent);
}

console.log('✅ Environment configuration generated successfully in frontend/env.js');
