const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.post('/', attendanceController.markAttendance);
router.get('/class', attendanceController.getAttendanceByClass);
router.get('/class/:classId', (req, res, next) => {
  req.query.classId = req.params.classId;
  return attendanceController.getAttendanceByClass(req, res, next);
});
router.get('/me', attendanceController.getMyAttendance);
router.get('/summary', attendanceController.getMonthlyAttendanceSummary);

module.exports = router;