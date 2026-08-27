const Teacher = require('../models/Teacher');
const User = require('../models/User');

exports.createTeacher = async (req, res, next) => {
  const { name, email, password, subjects, classIds, qualification, joiningDate } = req.body;
  const user = await User.create({ name, email, password, role: 'teacher', schoolId: req.schoolId });
  const teacher = await Teacher.create({ userId: user._id, schoolId: req.schoolId, subjects, classIds, qualification, joiningDate });
  res.status(201).json({ success: true, data: teacher });
};

exports.getTeachers = async (req, res, next) => {
  const teachers = await Teacher.find({ schoolId: req.schoolId }).populate('userId subjects classIds');
  res.status(200).json({ success: true, data: teachers });
};

exports.getTeacher = async (req, res, next) => {
  const teacher = await Teacher.findOne({ _id: req.params.id, schoolId: req.schoolId }).populate('userId subjects classIds');
  res.status(200).json({ success: true, data: teacher });
};

exports.updateTeacher = async (req, res, next) => {
  const teacher = await Teacher.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  res.status(200).json({ success: true, data: teacher });
};

exports.deleteTeacher = async (req, res, next) => {
  await Teacher.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: {} });
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id, schoolId: req.schoolId }).populate('userId subjects classIds');
    res.status(200).json({ success: true, data: teacher });
  } catch (err) {
    next(err);
  }
};