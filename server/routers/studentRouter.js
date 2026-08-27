const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.get('/me', studentController.getMyProfile);

router.route('/')
  .post(studentController.createStudent)
  .get(studentController.getStudents);

router.route('/:id')
  .get(studentController.getStudent)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;