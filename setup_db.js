const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Koneksi awal
const connection = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'anamac_db',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
});

console.log('🔌 Menghubungkan ke MySQL...');

connection.connect((err) => {
    if (err) {
        console.error('❌ Gagal menghubungkan ke MySQL:', err);
        process.exit(1);
    }
    console.log('✅ Terhubung ke MySQL server!');

    // Membaca file SQL
    const sqlPath = path.join(__dirname, 'database.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error('❌ File database.sql tidak ditemukan!');
        connection.end();
        process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Menghapus komentar dan memisahkan query berdasarkan titik koma (;)
    const queries = sqlContent
        .replace(/--.*$/gm, '') // Hapus komentar baris SQL
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);

    let completed = 0;

    function runQuery(index) {
        if (index >= queries.length) {
            console.log('🎉 Setup database dan seeding berhasil diselesaikan!');
            connection.end();
            process.exit(0);
        }

        const query = queries[index];
        // Tambahkan context baris pertama untuk logging log
        const logSnippet = query.split('\n')[0].substring(0, 50);
        
        connection.query(query, (err, results) => {
            if (err) {
                console.error(`❌ Gagal menjalankan query [${logSnippet}...]:`, err.message);
                connection.end();
                process.exit(1);
            }
            completed++;
            runQuery(index + 1);
        });
    }

    runQuery(0);
});
