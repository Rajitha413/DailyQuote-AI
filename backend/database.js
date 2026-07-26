const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const DB_SOURCE = "db.sqlite";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT, password TEXT, creationDate TEXT )`);
        db.run(`CREATE TABLE IF NOT EXISTS moods ( id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, mood TEXT, quote TEXT, date TEXT, FOREIGN KEY (userId) REFERENCES users (id) )`);
        // ADD THIS LINE
        db.run(`CREATE TABLE IF NOT EXISTS schedules ( userId INTEGER PRIMARY KEY, email TEXT, frequency TEXT, time TEXT, category TEXT, FOREIGN KEY (userId) REFERENCES users (id) )`);
    }
});

const createUser = async (username, email, password) => {
    // ... (rest of the file is the same)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const creationDate = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (username, email, password, creationDate) VALUES (?,?,?,?)';
        db.run(sql, [username, email, hashedPassword, creationDate], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, username, email });
            }
        });
    });
};

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

module.exports = {
    db,
    createUser,
    findUserByUsername
};