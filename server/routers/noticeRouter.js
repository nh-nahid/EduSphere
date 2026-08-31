const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const checkLogin = require('../middlewares/common/checkLogin');
const injectSchool = require('../middlewares/common/injectSchool');

router.use(checkLogin, injectSchool);

router.route('/')
  .post(noticeController.createNotice)
  .get(noticeController.getNotices);

router.route('/:id')
  .delete(noticeController.deleteNotice);

module.exports = router;