const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.route('/')
  .post(assignmentController.createAssignment)
  .get(assignmentController.getAssignments);

router.route('/:id')
  .get(assignmentController.getAssignment)
  .put(assignmentController.updateAssignment)
  .delete(assignmentController.deleteAssignment);

module.exports = router;