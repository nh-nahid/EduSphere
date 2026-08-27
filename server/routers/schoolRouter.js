const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const checkLogin = require('../middlewares/common/checkLogin');
const requireRole = require('../middlewares/common/requireRole');

router.use(checkLogin, requireRole('super_admin'));

router.route('/')
  .post(schoolController.createSchool)
  .get(schoolController.getAllSchools);

router.route('/:id')
  .get(schoolController.getSchool)
  .put(schoolController.updateSchool);

router.put('/:id/toggle', schoolController.toggleActive);

module.exports = router;