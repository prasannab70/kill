const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite DB setup
const db = new sqlite3.Database('items.db', (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database.");
});

db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    description TEXT,
    latitude REAL,
    longitude REAL,
    date TEXT
)`);

// Add item
app.post('/add', (req, res) => {
    const { type, description, latitude, longitude, date } = req.body;
    if (!type || !description || !latitude || !longitude || !date) {
        return res.status(400).json({ error: "All fields required" });
    }
    db.run(`INSERT INTO items (type, description, latitude, longitude, date) VALUES (?, ?, ?, ?, ?)`,
        [type, description, latitude, longitude, date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Get all items
app.get('/items', (req, res) => {
    db.all(`SELECT * FROM items`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
