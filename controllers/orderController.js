const db = require('../config/db');

// 1. CHECKOUT & GENERATE WHATSAPP LINK
exports.checkoutWhatsApp = (req, res) => {
    const { id, userId, customerName, phone, address, items, total, date } = req.body;

    if (!id || !userId || !customerName || !phone || !address || !items || !total) {
        return res.status(400).json({ status: 'error', message: 'Data checkout tidak lengkap!' });
    }

    const orderId = id;
    const orderDate = date || new Date().toLocaleString('id-ID');
    const orderStatus = 'Diproses';

    // Nomor WA Admin / Owner (Bisa diganti dengan nomor lain, e.g. 6285712345678)
    const adminPhone = "6285712345678"; 

    // Bikin rincian barang belanjaan untuk WA
    let itemsSummary = '';
    if (Array.isArray(items)) {
        itemsSummary = items.map(item => `- ${item.name} (${item.quantity}x) @ Rp ${Number(item.price).toLocaleString('id-ID')}`).join('\n');
    } else {
        itemsSummary = '- (Tidak ada rincian barang)';
    }

    // Format pesan WhatsApp
    const rawMessage = `Halo Admin AnaMac, saya mau pesan:\n\n` +
                       `Invoice: ${orderId}\n` +
                       `Nama Pelanggan: ${customerName}\n` +
                       `Nomor WhatsApp: ${phone}\n` +
                       `Alamat Pengiriman: ${address}\n\n` +
                       `Rincian Barang:\n${itemsSummary}\n\n` +
                       `Total Pembayaran: Rp ${Number(total).toLocaleString('id-ID')}\n\n` +
                       `Mohon diproses ya kak!`;

    // Encode URI untuk link WA
    const message = encodeURIComponent(rawMessage);
    const waLink = `https://wa.me/${adminPhone}?text=${message}`;

    // Simpan ke database
    const sql = 'INSERT INTO orders (id, userId, customerName, phone, address, items, total, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [orderId, userId, customerName, phone, address, JSON.stringify(items), total, orderDate, orderStatus], (err, results) => {
        if (err) {
            console.error("Gagal menyimpan order:", err);
            return res.status(500).json({ status: 'error', message: err.message });
        }

        res.json({
            status: 'success',
            message: 'Checkout berhasil disimpan ke database!',
            whatsapp_link: waLink
        });
    });
};

// 2. READ ALL ORDERS (Untuk Admin Dashboard)
exports.getAllOrders = (req, res) => {
    db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });

        const formattedResults = results.map(row => {
            try {
                row.items = JSON.parse(row.items);
            } catch (e) {
                row.items = [];
            }
            return row;
        });

        // Kembalikan langsung array untuk kompatibilitas frontend
        res.json(formattedResults);
    });
};

// 3. READ USER ORDERS (Untuk Riwayat Belanja User)
exports.getUserOrders = (req, res) => {
    const { email } = req.params;

    db.query('SELECT * FROM orders WHERE userId = ? ORDER BY created_at DESC', [email], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });

        const formattedResults = results.map(row => {
            try {
                row.items = JSON.parse(row.items);
            } catch (e) {
                row.items = [];
            }
            return row;
        });

        res.json(formattedResults);
    });
};

// 4. DELETE ORDER (Untuk Admin Hapus Data)
exports.deleteOrder = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM orders WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan' });

        res.json({ status: 'success', message: 'Pesanan berhasil dihapus' });
    });
};