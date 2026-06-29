-- Script Database UAS - AnaMac Komputer

DROP DATABASE IF EXISTS anamac_db;
CREATE DATABASE anamac_db;
USE anamac_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    stock INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    items TEXT NOT NULL, -- Menyimpan serialisasi JSON array dari barang belanjaan
    total DECIMAL(12,2) NOT NULL,
    date VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Diproses',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seeding Data Produk Default (Sesuai products.json UTS)
INSERT INTO products (id, name, price, category, image, description, stock) VALUES
(1, 'Tablet Xiaomi + Stylus & Cover', 4500000.00, 'Tablet', 'https://placehold.co/400x300/e2e8f0/1e293b?text=Xiaomi+Tablet', 'Tablet performa tinggi, lengkap dengan stylus.', 10),
(2, 'Laptop Gaming RTX Series', 15500000.00, 'Laptop', 'https://placehold.co/400x300/e2e8f0/1e293b?text=Gaming+Laptop', 'Laptop tangguh memberikan frame rate maksimal.', 8),
(3, 'Smart TV 4K 50-Inch', 5200000.00, 'Televisi', 'https://placehold.co/400x300/e2e8f0/1e293b?text=Smart+TV', 'TV pintar resolusi 4K untuk pengalaman sinematik.', 5),
(4, 'Headphone Wireless ANC', 1200000.00, 'Aksesoris', 'https://placehold.co/400x300/e2e8f0/1e293b?text=Headphone', 'Nikmati musik tanpa gangguan suara bising dari luar.', 15),
(5, 'MacBook Air M2', 18000000.00, 'Laptop', 'https://placehold.co/400x300/e2e8f0/1e293b?text=MacBook+Air', 'Laptop ultra tipis dengan performa chip M2 yang efisien.', 7),
(6, 'iPad Pro 11-Inch', 14500000.00, 'Tablet', 'https://placehold.co/400x300/e2e8f0/1e293b?text=iPad+Pro', 'Kanvas digital terbaik untuk para profesional kreatif.', 6),
(7, 'Monitor Ultrawide 34-Inch', 6500000.00, 'Aksesoris', 'https://placehold.co/400x300/e2e8f0/1e293b?text=Ultrawide+Monitor', 'Ruang kerja super luas untuk kebutuhan multitasking.', 12)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), 
    price=VALUES(price), 
    category=VALUES(category), 
    image=VALUES(image), 
    description=VALUES(description), 
    stock=VALUES(stock);
