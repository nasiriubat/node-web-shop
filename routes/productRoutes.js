const express = require('express');
const productController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const checkRefreshToken = require('../middleware/checkRefreshToken');


const router = express.Router();

router.get('/all', productController.getAllProducts);
// router.post('/create', productController.createProduct);
router.post('/create', authenticateToken, isAdmin, productController.createProduct);
router.get('/:productId', productController.showProduct);
router.put('/:productId', authenticateToken, isAdmin, productController.editProduct);
router.delete('/:productId', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;