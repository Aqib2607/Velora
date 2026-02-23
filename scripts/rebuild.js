import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(backendDir, 'public');

// Protected Laravel structure files that shouldn't be deleted
const protectedFiles = [
    'index.php',
    '.htaccess',
    'robots.txt',
    'favicon.ico',
    'storage'
];

async function rebuild() {
    try {
        console.log('🔄 --- Automated Rebuild Process ---');

        // 1. Clear Laravel backend cache and config
        console.log('\n🧹 Step 1: Clearing Backend Cache & Config (php artisan optimize:clear)...');
        execSync('php artisan optimize:clear', { cwd: backendDir, stdio: 'inherit' });

        // 2. Run the frontend build
        console.log('\n📦 Step 2: Building frontend (npm run build)...');
        execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

        // 3. Clear the backend/public folder safely
        console.log('\n🧹 Step 3: Clearing backend/public directory safely...');
        if (await fs.pathExists(publicDir)) {
            const items = await fs.readdir(publicDir);
            for (const item of items) {
                if (!protectedFiles.includes(item)) {
                    const itemPath = path.join(publicDir, item);
                    await fs.remove(itemPath);
                    console.log(`  - Removed: ${item}`);
                } else {
                    console.log(`  - Protected: ${item}`);
                }
            }
        } else {
            console.error('\n❌ Error: Directory backend/public does not exist.');
            process.exit(1);
        }

        // 4. Copy the fresh /dist output to backend/public
        console.log('\n📋 Step 4: Copying fresh dist assets to backend/public...');
        if (await fs.pathExists(distDir)) {
            await fs.copy(distDir, publicDir, { overwrite: true });
            console.log('\n✅ Success: Frontend successfully deployed to Laravel public directory!');
        } else {
            console.error('\n❌ Error: dist directory not found! The build might have failed silently.');
            process.exit(1);
        }

        console.log('\n✅ --- Rebuild Complete Successfully! ---');
    } catch (error) {
        console.error('\n❌ Rebuild failed with error:');
        console.error(error.message);
        process.exit(1);
    }
}

rebuild();
