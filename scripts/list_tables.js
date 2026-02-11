const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('prisma/dev.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Found ${tables.length} tables.`);

    let completed = 0;
    tables.forEach(t => {
        db.get(`SELECT count(*) as count FROM "${t.name}"`, (err, row) => {
            if (err) {
                console.log(`Table: ${t.name}, Error: ${err.message}`);
            } else {
                console.log(`Table: ${t.name.padEnd(25)} | Count: ${row.count}`);
            }
            completed++;
            if (completed === tables.length) {
                db.close();
            }
        });
    });
});
