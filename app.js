require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Panggil Database
require('./config/db'); 

// Middleware Global
app.use(cors()); // Wajib biar Frontend HTML bisa nembak API
app.use(express.json()); // Penting! Biar req.body gak undefined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ROUTES ---

// 1. Routes Produk (CRUD)
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

// 2. Routes Checkout (Notif WA)
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// 3. Nanti kita isi ini untuk Auth (Login/Register)
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

// --- TEST ROUTE ---
app.get('/', (req, res) => {
    res.json({ message: "🚀 API AnaMac Komputer Berjalan Lancar!" });
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server nyala di http://localhost:${PORT}`);
});