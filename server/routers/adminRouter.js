const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');
const requireRole = require('../middlewares/common/requireRole');

router.use(checkLogin, injectSchool, requireRole(['admin', 'super_admin']));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/stats', adminController.getDashboardStats);
router.get('/monthly-fees', adminController.getMonthlyfees);
router.get('/top-performers', adminController.getTopPerformers);
router.get('/users', adminController.getUserManagement);
router.patch('/users/:id/toggle', adminController.toggleUserStatus);

module.exports = router;