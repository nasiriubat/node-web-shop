const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const checkRefreshToken = require('../middleware/checkRefreshToken');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/edit-profile', authenticateToken, authController.editProfile);
router.get('/edit-profile', authenticateToken, authController.getProfile);

router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;