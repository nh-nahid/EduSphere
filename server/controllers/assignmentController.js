const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  req.body.teacherId = req.user._id;
  const assignment = await Assignment.create(req.body);
  res.status(201).json({ success: true, data: assignment });
};

exports.getAssignments = async (req, res, next) => {
  const assignments = await Assignment.find({ schoolId: req.schoolId, classId: req.query.classId }).populate('subjectId teacherId');
  res.status(200).json({ success: true, data: assignments });
};

exports.getAssignment = async (req, res, next) => {
  const assignment = await Assignment.findOne({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: assignment });
};

exports.updateAssignment = async (req, res, next) => {
  const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  res.status(200).json({ success: true, data: assignment });
};

exports.deleteAssignment = async (req, res, next) => {
  await Assignment.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: {} });
};