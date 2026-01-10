import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const backendDir = path.join(__dirname, 'velora_backend');
const publicAssetsDir = path.join(backendDir, 'public', 'assets');
const viewsDir = path.join(backendDir, 'resources', 'views');

// Ensure dist exists
if (!fs.existsSync(distDir)) {
    console.error('Dist directory not found. Run npm run build first.');
    process.exit(1);
}

// 1. Copy Assets
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
    if (!fs.existsSync(publicAssetsDir)) {
        fs.mkdirSync(publicAssetsDir, { recursive: true });
    }

    const files = fs.readdirSync(distAssetsDir);
    files.forEach(file => {
        const src = path.join(distAssetsDir, file);
        const dest = path.join(publicAssetsDir, file);
        fs.copyFileSync(src, dest);
    });
    console.log(`Copied ${files.length} asset files to public/assets`);
}

// 2. Copy index.html to app.blade.php
const indexHtml = path.join(distDir, 'index.html');
const appBlade = path.join(viewsDir, 'app.blade.php');

if (fs.existsSync(indexHtml)) {
    const content = fs.readFileSync(indexHtml, 'utf-8');
    fs.writeFileSync(appBlade, content);
    console.log(`Copied index.html to resources/views/app.blade.php`);
} else {
    console.error('index.html not found in dist.');
}

console.log('Deployment complete.');
