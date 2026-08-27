const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const checkLogin = require('../middlewares/common/checkLogin');
const { avatarUpload } = require('../middlewares/users/avatarUpload');

router.get('/profile', checkLogin, getProfile);
router.put('/profile', checkLogin, avatarUpload.single('avatar'), updateProfile);
router.put('/change-password', checkLogin, changePassword);

module.exports = router;