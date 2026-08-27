const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkLogin = require('../middlewares/common/checkLogin');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', checkLogin, authController.logout);
router.get('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.get('/me', checkLogin, authController.getMe);

module.exports = router;