
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src/data/achievements.json');

try {
    if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        let modified = false;

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

        // Migrate Highlights
        if (data.highlights && Array.isArray(data.highlights)) {
            data.highlights = data.highlights.map(item => {
                if (!item.titleEn) {
                    item.titleEn = "";
                    modified = true;
                }
                if (!item.descriptionEn) {
                    item.descriptionEn = "";
                    modified = true;
                }
                // categoryEn migration
                if (!item.categoryEn) {
                    item.categoryEn = "";
                    modified = true;
                }
                return item;
            });
        }

        // Migrate Carousel
        if (data.carousel && Array.isArray(data.carousel)) {
            data.carousel = data.carousel.map(item => {
                if (!item.titleEn) {
                    item.titleEn = "";
                    modified = true;
                }
                return item;
            });
        }

        // Migrate Timeline
        if (data.timeline && Array.isArray(data.timeline)) {
            data.timeline = data.timeline.map(item => {
                if (!item.descriptionEn) {
                    item.descriptionEn = "";
                    modified = true;
                }
                return item;
            });
        }

        if (modified) {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            console.log("Successfully migrated achievements.json");
        } else {
            console.log("achievements.json already up to date");
        }
    } else {
        console.error("achievements.json not found");
    }
} catch (error) {
    console.error("Error migrating achievements data:", error);
}
