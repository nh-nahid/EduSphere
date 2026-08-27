const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.route('/')
  .post(subjectController.createSubject)
  .get(subjectController.getSubjects);

router.route('/:id')
  .get(subjectController.getSubject)
  .put(subjectController.updateSubject)
  .delete(subjectController.deleteSubject);

module.exports = router;