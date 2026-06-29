exports.checkoutWhatsApp = (req, res) => {
    const { name, phone, productName, price } = req.body;

    // Nomor WA Admin (Ganti sama nomor kamu, contoh: 62812xxxx)
    const adminPhone = "6285712345678"; 

    // Bikin format pesan
    const message = `Halo Admin AnaMac, saya mau pesan:%0A%0A` +
                    `Nama: ${name}%0A` +
                    `Produk: ${productName}%0A` +
                    `Harga: Rp${price}%0A%0A` +
                    `Mohon diproses ya kak!`;

    // Link redirect ke WhatsApp
    const waLink = `https://wa.me/${adminPhone}?text=${message}`;

    res.json({
        status: 'success',
        message: 'Checkout berhasil!',
        whatsapp_link: waLink
    });
};