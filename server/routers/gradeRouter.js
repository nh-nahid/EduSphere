const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.post('/', gradeController.recordGrade);
router.get('/student/:studentId', gradeController.getGradesByStudent);
router.get('/student/:studentId/report-card', gradeController.getReportCard);

module.exports = router;