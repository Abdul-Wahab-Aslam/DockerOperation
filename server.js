// // server.js
// // Node + Express + MySQL CRUD API for "products" table (XAMPP - phpMyAdmin / MySQL)

// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ---------- MySQL Connection ----------
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',        // default XAMPP user
//     password: '',        // default XAMPP password (empty)
//     // database: 'shop_db'  // change if your database name is different
//     database: 'dockeroperation'
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.message);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });

// // ---------- CREATE: Add a new product ----------
// app.post('/products', (req, res) => {
//     const { name, description, price, quantity } = req.body;

//     if (!name || price === undefined || quantity === undefined) {
//         return res.status(400).json({ error: 'name, price and quantity are required' });
//     }

//     const sql = 'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)';
//     db.query(sql, [name, description, price, quantity], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ message: 'Product created', id: result.insertId });
//     });
// });

// // ---------- READ: Get all products ----------
// app.get('/products', (req, res) => {
//     db.query('SELECT * FROM products', (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });

// // ---------- READ: Get a single product by ID ----------
// app.get('/products/:id', (req, res) => {
//     const { id } = req.params;
//     db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
//         res.json(results[0]);
//     });
// });

// // ---------- UPDATE: Update a product by ID ----------
// app.put('/products/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, description, price, quantity } = req.body;

//     const sql = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
//     db.query(sql, [name, description, price, quantity, id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
//         res.json({ message: 'Product updated' });
//     });
// });

// // ---------- DELETE: Delete a product by ID ----------
// app.delete('/products/:id', (req, res) => {
//     const { id } = req.params;
//     db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
//         res.json({ message: 'Product deleted' });
//     });
// });

// // ---------- Start Server ----------
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// server.js
// Node + Express + MySQL CRUD API for "products" table (Docker version)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- MySQL Connection Pool ----------
// Uses environment variables (set in docker-compose.yml).
// Falls back to localhost values if not running in Docker.
// A pool (instead of a single connection) automatically reconnects
// per-query, so a MySQL restart doesn't permanently break the app.
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shop_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Quick check on startup, with retry, so you get a clear log message
function checkConnection() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed, retrying in 5s:', err.message);
            setTimeout(checkConnection, 5000);
            return;
        }
        console.log('Connected to MySQL database.');
        connection.release();
    });
}
checkConnection();

// ---------- CREATE: Add a new product ----------
app.post('/products', (req, res) => {
    const { name, description, price, quantity } = req.body;

    if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ error: 'name, price and quantity are required' });
    }

    const sql = 'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, price, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Product created', id: result.insertId });
    });
});

// ---------- READ: Get all products ----------
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ---------- READ: Get a single product by ID ----------
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(results[0]);
    });
});

// ---------- UPDATE: Update a product by ID ----------
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(sql, [name, description, price, quantity, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated' });
    });
});

// ---------- DELETE: Delete a product by ID ----------
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});