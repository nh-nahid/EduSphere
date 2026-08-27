const Student = require('../models/Student');
const User = require('../models/User');
const emailUtil = require('../utils/email');
const smsUtil = require('../utils/sms');
const bcrypt = require('bcryptjs');

exports.createStudent = async (req, res, next) => {
  const { name, email, password, classId, roll, section, guardianName, guardianPhone } = req.body;
  const user = await User.create({ name, email, password, role: 'student', schoolId: req.schoolId });
  const student = await Student.create({ userId: user._id, schoolId: req.schoolId, classId, roll, section, guardianName, guardianPhone, admissionDate: Date.now() });
  
  emailUtil.sendEmail({ to: email, subject: 'Admission Confirmed', templateName: 'admissionConfirm', replacements: { name } });
  smsUtil.sendSms(guardianPhone, `Welcome ${name} to our school!`, { event: 'admission', studentId: student._id, schoolId: req.schoolId });

  res.status(201).json({ success: true, data: student });
};

exports.getStudents = async (req, res, next) => {
  const query = { schoolId: req.schoolId };
  if (req.query.classId) query.classId = req.query.classId;
  const students = await Student.find(query).populate('userId classId');
  res.status(200).json({ success: true, data: students });
};

exports.getStudent = async (req, res, next) => {
  const student = await Student.findOne({ _id: req.params.id, schoolId: req.schoolId }).populate('userId classId');
  res.status(200).json({ success: true, data: student });
};

exports.updateStudent = async (req, res, next) => {
  const student = await Student.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: student });
};

exports.deleteStudent = async (req, res, next) => {
  await Student.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: {} });
};

exports.getMyProfile = async (req, res, next) => {
  const student = await Student.findOne({ userId: req.user._id, schoolId: req.schoolId }).populate('classId');
  res.status(200).json({ success: true, data: student });
};