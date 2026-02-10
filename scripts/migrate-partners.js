
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src/data/partners.json');

try {
    if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        let modified = false;

        // Migrate Categories
        if (data.categories && Array.isArray(data.categories)) {
            data.categories = data.categories.map(cat => {
                if (!cat.nameEn) {
                    cat.nameEn = "";
                    modified = true;
                }
                if (!cat.descriptionEn) {
                    cat.descriptionEn = "";
                    modified = true;
                }
                return cat;
            });
        }

        // Migrate Items
        if (data.items && Array.isArray(data.items)) {
            data.items = data.items.map(item => {
                if (!item.descriptionEn) {
                    item.descriptionEn = "";
                    modified = true;
                }
                if (!item.profileEn) {
                    item.profileEn = "";
                    modified = true;
                }
                return item;
            });
        }

        if (modified) {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            console.log("Successfully migrated partners.json");
        } else {
            console.log("partners.json already up to date");
        }
    } else {
        console.error("partners.json not found");
    }
} catch (error) {
    console.error("Error migrating partners data:", error);
}
