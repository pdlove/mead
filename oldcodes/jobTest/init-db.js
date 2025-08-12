const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jobs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      name TEXT,
      status TEXT,
      created INTEGER,
      finished INTEGER,
      progress INTEGER,
      params TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS job_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT,
      timestamp INTEGER,
      group_name TEXT,
      detail TEXT,
      message TEXT
    );
  `);
});

db.close();
