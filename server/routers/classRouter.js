const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.route('/')
  .post(classController.createClass)
  .get(classController.getClasses);

router.route('/:id')
  .get(classController.getClass)
  .put(classController.updateClass)
  .delete(classController.deleteClass);

router.post('/:id/enroll', classController.enrollStudents);
router.post('/:id/assign-teacher', classController.assignTeacher);

module.exports = router;