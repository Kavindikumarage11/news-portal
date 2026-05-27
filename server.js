const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware to handle form data and JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/CSS files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Connection Configuration for MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminkavi@123',
    database: 'news_portal_db'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// --- DML Operations (API Routes) ---

// 1. SELECT Operation: Fetch all news articles for the Home Page
app.get('/api/news', (req, res) => {
    db.query('SELECT * FROM news ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. INSERT Operation: Add a new news article from the Admin Dashboard
app.post('/api/news', (req, res) => {
    const { title, content, image_url, category } = req.body;
    const query = 'INSERT INTO news (title, content, image_url, category) VALUES (?, ?, ?, ?)';
    db.query(query, [title, content, image_url, category], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'News article added successfully!', id: result.insertId });
    });
});

// 3. DELETE Operation: Remove a news article using its ID
app.delete('/api/news/:id', (req, res) => {
    const query = 'DELETE FROM news WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'News article deleted successfully!' });
    });
});

// Start the server on Port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});