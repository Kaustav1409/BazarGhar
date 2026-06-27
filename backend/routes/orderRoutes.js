const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
