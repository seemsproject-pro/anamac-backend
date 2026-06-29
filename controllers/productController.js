const db = require('../config/db');

// 1. READ: Ambil Semua Produk
exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', data: results });
    });
};

// 2. READ: Ambil Detail Satu Produk (Berdasarkan ID)
exports.getProductById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json({ status: 'success', data: results[0] });
    });
};

// 3. CREATE: Tambah Produk Baru
exports.createProduct = (req, res) => {
    const { name, category, price, description, image, stock } = req.body;

    // Validasi dasar
    if (!name || !price) {
        return res.status(400).json({ status: 'error', message: 'Field name dan price wajib diisi' });
    }

    const sql = 'INSERT INTO products (name, category, price, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, category, price, description, image, stock || 10], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(201).json({ status: 'success', message: 'Produk berhasil ditambahkan', id: results.insertId });
    });
};

// 4. UPDATE: Edit Produk
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, category, price, description, image, stock } = req.body;
    const sql = 'UPDATE products SET name=?, category=?, price=?, description=?, image=?, stock=? WHERE id=?';

    db.query(sql, [name, category, price, description, image, stock || 10, id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'Produk berhasil diupdate' });
    });
};

// 5. DELETE: Hapus Produk
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });
        res.json({ status: 'success', message: 'Produk berhasil dihapus' });
    });
};