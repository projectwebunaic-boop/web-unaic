
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src/data/facilities.json');

try {
    if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        let modified = false;

        // Migrate Academic Facilities
        if (data.academic && Array.isArray(data.academic)) {
            data.academic = data.academic.map(item => {
                if (!item.titleEn) {
                    item.titleEn = "";
                    modified = true;
                }
                if (!item.descriptionEn) {
                    item.descriptionEn = "";
                    modified = true;
                }
                return item;
            });
        }

        // Migrate Public Facilities
        if (data.public && Array.isArray(data.public)) {
            data.public = data.public.map(item => {
                if (!item.titleEn) {
                    item.titleEn = "";
                    modified = true;
                }
                if (!item.descriptionEn) {
                    item.descriptionEn = "";
                    modified = true;
                }
                return item;
            });
        }

        // Migrate Stats
        if (data.stats && Array.isArray(data.stats)) {
            data.stats = data.stats.map(item => {
                if (!item.labelEn) {
                    item.labelEn = "";
                    modified = true;
                }
                return item;
            });
        }

        if (modified) {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            console.log("Successfully migrated facilities.json");
        } else {
            console.log("facilities.json already up to date");
        }
    } else {
        console.error("facilities.json not found");
    }
} catch (error) {
    console.error("Error migrating facilities data:", error);
}
