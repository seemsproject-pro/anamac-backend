const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || process.env.DB_PORT // Tambahkan baris ini!
});

// Cek koneksi
db.getConnection((err, connection) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke database MySQL (anamac_db)');
        connection.release();
    }
});

module.exports = db;