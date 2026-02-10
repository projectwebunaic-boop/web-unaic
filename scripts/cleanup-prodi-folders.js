const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '[locale]', 'fakultas');

const directoriesToRemove = [
    'ilmu-kesehatan/s1-keperawatan',
    'ilmu-kesehatan/s1-kebidanan',
    'ilmu-kesehatan/s1-fisioterapi',
    'ilmu-kesehatan/d3-keperawatan',
    'ilmu-kesehatan/d3-kebidanan',
    'ilmu-kesehatan/profesi-bidan',
    'ilmu-kesehatan/profesi-ners',
    'farmasi-sains-teknologi/s1-farmasi',
    'farmasi-sains-teknologi/s1-informatika',
    'farmasi-sains-teknologi/d4-tlm',
    'farmasi-sains-teknologi/d3-farmasi',
    'farmasi-sains-teknologi/profesi-apoteker',
    'ekonomi-bisnis/s1-bisnis-digital',
    'ekonomi-bisnis/s1-kewirausahaan'
];

directoriesToRemove.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`Removing ${fullPath}`);
        fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
        console.log(`Directory ${fullPath} does not exist.`);
    }
});

console.log('Cleanup finished.');
