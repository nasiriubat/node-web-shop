const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin, isCustomer } = require('../middleware/authMiddleware');
const checkRefreshToken = require('../middleware/checkRefreshToken');


const router = express.Router();

router.post('/place-order', authenticateToken, isCustomer, orderController.placeOrder);
router.get('/user-orders', authenticateToken, orderController.getUserOrders);
router.get('/all-orders', authenticateToken, isAdmin, orderController.getAllOrders);
router.get('/:orderId', authenticateToken, orderController.getOrderDetails);
router.put('/:orderId', authenticateToken, isAdmin, orderController.editOrder);

module.exports = router;