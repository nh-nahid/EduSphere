const Subject = require('../models/Subject');

exports.createSubject = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
};

exports.getSubjects = async (req, res, next) => {
  const subjects = await Subject.find({ schoolId: req.schoolId }).populate('teacherId');
  res.status(200).json({ success: true, data: subjects });
};

exports.getSubject = async (req, res, next) => {
  const subject = await Subject.findOne({ _id: req.params.id, schoolId: req.schoolId }).populate('teacherId');
  res.status(200).json({ success: true, data: subject });
};

exports.updateSubject = async (req, res, next) => {
  const subject = await Subject.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  res.status(200).json({ success: true, data: subject });
};

exports.deleteSubject = async (req, res, next) => {
  await Subject.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: {} });
};