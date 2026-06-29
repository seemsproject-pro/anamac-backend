const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_anamac_super_aman';

// 1. REGISTER USER
exports.register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }

    if (password.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password minimal harus 6 karakter' });
    }

    // Cek apakah email sudah terdaftar
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        
        if (results.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar! Gunakan email lain.' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Gagal melakukan enkripsi password' });

            const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(sql, [name, email, hashedPassword], (err, insertResults) => {
                if (err) return res.status(500).json({ status: 'error', message: err.message });
                
                res.status(201).json({
                    status: 'success',
                    message: 'Registrasi berhasil! Silakan login.',
                    data: {
                        id: insertResults.insertId,
                        name,
                        email
                    }
                });
            });
        });
    });
};

// 2. LOGIN USER
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });

        if (results.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Email atau password salah!' });
        }

        const user = results[0];

        // Bandingkan password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message });

            if (!isMatch) {
                return res.status(401).json({ status: 'error', message: 'Email atau password salah!' });
            }

            // Buat token JWT (opsional, untuk keamaan lebih)
            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                status: 'success',
                message: 'Login berhasil!',
                token,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    });
};
