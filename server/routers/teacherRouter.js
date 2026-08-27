const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.get('/me/profile', teacherController.getMyProfile);

router.route('/')
  .post(teacherController.createTeacher)
  .get(teacherController.getTeachers);

router.route('/:id')
  .get(teacherController.getTeacher)
  .put(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;