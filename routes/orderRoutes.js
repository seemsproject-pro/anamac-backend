const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.checkoutWhatsApp);
router.get('/', orderController.getAllOrders);
router.get('/user/:email', orderController.getUserOrders);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;