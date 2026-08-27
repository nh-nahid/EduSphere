const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.post('/', submissionController.submitAssignment);
router.put('/:id/grade', submissionController.gradeSubmission);
router.get('/assignment/:assignmentId', submissionController.getSubmissionsByAssignment);
router.get('/me', submissionController.getMySubmissions);

module.exports = router;