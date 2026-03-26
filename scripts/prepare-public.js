const fs = require('fs');
const path = require('path');

/**
 * Script for Vercel compatibility.
 * Since the project has been reorganized to a permanent 'public' directory,
 * this step is no longer required to copy from 'frontend' to 'public'.
 */

console.log('✅ El proyecto ya está organizado en la carpeta public/. Omitiendo preparación.');
process.exit(0);
