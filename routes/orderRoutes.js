const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin, isCustomer } = require('../middleware/authMiddleware');
const checkRefreshToken = require('../middleware/checkRefreshToken');


const router = express.Router();

router.post('/place-order', authenticateToken, isCustomer, orderController.placeOrder);
router.get('/user-orders', authenticateToken, orderController.getUserOrders);
router.get('/all-orders', authenticateToken, isAdmin, orderController.getAllOrders);
router.get('/status/:status', authenticateToken, orderController.getUserOrdersByStatus);
router.get('/:order_id', authenticateToken, orderController.getOrderDetails);
router.put('/updateStatus', authenticateToken, isAdmin, orderController.updateStatus);

module.exports = router;