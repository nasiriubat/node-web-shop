const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const checkRefreshToken = require('../middleware/checkRefreshToken');


const router = express.Router();

router.get('/all', authenticateToken, isAdmin, userController.getAllUsers);
router.post('/create', authenticateToken, isAdmin, userController.createUser);
router.get('/:userId', authenticateToken, userController.showUser);
router.put('/:userId', authenticateToken, userController.editUser);
router.delete('/:userId', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;