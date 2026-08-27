const Grade = require('../models/Grade');
const Student = require('../models/Student');
const smsUtil = require('../utils/sms');

exports.recordGrade = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  const grade = await Grade.create(req.body);
  
  const student = await Student.findOne({ _id: grade.studentId, schoolId: req.schoolId });
  if (student && student.guardianPhone) {
    smsUtil.sendSms(student.guardianPhone, `Your child scored ${grade.marks}/${grade.totalMarks} in ${grade.examType}`, { event: 'grade', studentId: student._id, schoolId: req.schoolId });
  }
  
  res.status(201).json({ success: true, data: grade });
};

exports.getGradesByStudent = async (req, res, next) => {
  const grades = await Grade.find({ studentId: req.params.studentId, schoolId: req.schoolId }).populate('subjectId');
  res.status(200).json({ success: true, data: grades });
};

exports.getReportCard = async (req, res, next) => {
  const grades = await Grade.find({ studentId: req.params.studentId, examType: req.query.examType, schoolId: req.schoolId }).populate('subjectId');
  res.status(200).json({ success: true, data: grades });
};