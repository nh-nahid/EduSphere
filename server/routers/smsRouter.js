const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');
const requireRole = require('../middlewares/common/requireRole');

router.use(checkLogin, injectSchool, requireRole('admin'));

router.get('/logs', smsController.getSmsLogs);
router.post('/send', smsController.sendManualSms);

module.exports = router;