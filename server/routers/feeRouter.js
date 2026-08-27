const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.route('/')
  .post(feeController.createFee)
  .get(feeController.getFees);

router.get('/student', feeController.getStudentFees);
router.get('/student/:studentId', feeController.getFeesByStudentId);

module.exports = router;