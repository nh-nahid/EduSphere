const Submission = require('../models/Submission');
const Student = require('../models/Student');

exports.submitAssignment = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  const student = await Student.findOne({ userId: req.user._id });
  req.body.studentId = student._id;
  const submission = await Submission.create(req.body);
  res.status(201).json({ success: true, data: submission });
};

exports.gradeSubmission = async (req, res, next) => {
  const submission = await Submission.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, { marks: req.body.marks, feedback: req.body.feedback }, { new: true });
  res.status(200).json({ success: true, data: submission });
};

exports.getSubmissionsByAssignment = async (req, res, next) => {
  const submissions = await Submission.find({ assignmentId: req.params.assignmentId, schoolId: req.schoolId }).populate('studentId');
  res.status(200).json({ success: true, data: submissions });
};

exports.getMySubmissions = async (req, res, next) => {
  const student = await Student.findOne({ userId: req.user._id, schoolId: req.schoolId });
  const submissions = await Submission.find({ studentId: student._id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: submissions });
};