const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.post('/initiate', checkLogin, injectSchool, paymentController.initiatePayment);
router.post('/success', paymentController.paymentSuccess);
router.post('/fail', paymentController.paymentFail);
router.post('/cancel', paymentController.paymentCancel);
router.get('/:id/invoice', checkLogin, injectSchool, paymentController.downloadInvoice);

module.exports = router;