const Notice = require('../models/Notice');
const Student = require('../models/Student');
const smsUtil = require('../utils/sms');

exports.createNotice = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  req.body.createdBy = req.user._id;
  const notice = await Notice.create(req.body);
  
  if (notice.targetRole !== 'admin') {
    const students = await Student.find({ schoolId: req.schoolId });
    for (let student of students) {
      if (student.guardianPhone) {
        smsUtil.sendSms(student.guardianPhone, `New Notice: ${notice.title}`, { event: 'notice', studentId: student._id, schoolId: req.schoolId });
      }
    }
  }

  res.status(201).json({ success: true, data: notice });
};

exports.getNotices = async (req, res, next) => {
  const notices = await Notice.find({ schoolId: req.schoolId, targetRole: { $in: ['all', req.user.role] } });
  res.status(200).json({ success: true, data: notices });
};