const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('prisma/dev.db');

db.all("PRAGMA table_info('FacultyProgram')", (err, columns) => {
    if (err) {
        console.error(err);
        return;
    }
    const colNames = columns.map(c => c.name);
    console.log('Columns in FacultyProgram:', colNames.join(', '));

    db.all(`SELECT * FROM "FacultyProgram"`, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Found ${rows.length} programs.`);
        console.log(JSON.stringify(rows, null, 2));
    });
});
