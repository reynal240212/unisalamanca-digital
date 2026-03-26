const fs = require('fs');
const path = require('path');

/**
 * Script to prepare the 'public' directory for Vercel deployment.
 * This script copies the contents of the 'frontend' directory into a new 'public' directory
 * at the root of the project to satisfy Vercel's default output expectations.
 */

const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const publicDir = path.join(projectRoot, 'public');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    });
}

try {
    console.log('🏁 Iniciando preparación del directorio public...');
    
    // 1. Eliminar public si ya existe para asegurar una instalación limpia
    if (fs.existsSync(publicDir)) {
        console.log('🗑️  Limpiando directorio public existente...');
        fs.rmSync(publicDir, { recursive: true, force: true });
    }

    // 2. Crear public y copiar el contenido de frontend
    console.log(`📦 Copiando contenido de ${frontendDir} a ${publicDir}...`);
    copyFolderSync(frontendDir, publicDir);

    // 3. Copiar vercel.json a la raíz de public (opcional, pero útil para depuración)
    const vercelJsonSource = path.join(projectRoot, 'vercel.json');
    const vercelJsonDest = path.join(publicDir, 'vercel.json');
    if (fs.existsSync(vercelJsonSource)) {
        fs.copyFileSync(vercelJsonSource, vercelJsonDest);
    }

    console.log('✅ Directorio public preparado exitosamente.');
} catch (error) {
    console.error('❌ Error preparando el directorio public:', error);
    process.exit(1);
}
