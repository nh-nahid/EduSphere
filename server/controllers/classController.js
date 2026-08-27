const Class = require('../models/Class');

exports.createClass = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  const cls = await Class.create(req.body);
  res.status(201).json({ success: true, data: cls });
};

exports.getClasses = async (req, res, next) => {
  const classes = await Class.find({ schoolId: req.schoolId }).populate('classTeacherId');
  res.status(200).json({ success: true, data: classes });
};

exports.getClass = async (req, res, next) => {
  const cls = await Class.findOne({ _id: req.params.id, schoolId: req.schoolId })
    .populate({ path: 'classTeacherId', populate: { path: 'userId', select: 'name email' } })
    .populate({ path: 'studentIds', populate: { path: 'userId', select: 'name email phone' } })
    .populate('subjectIds');
  res.status(200).json({ success: true, data: cls });
};

exports.updateClass = async (req, res, next) => {
  const cls = await Class.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  res.status(200).json({ success: true, data: cls });
};

exports.deleteClass = async (req, res, next) => {
  await Class.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
  res.status(200).json({ success: true, data: {} });
};

exports.enrollStudents = async (req, res, next) => {
  const cls = await Class.findOne({ _id: req.params.id, schoolId: req.schoolId });
  cls.studentIds.push(...req.body.studentIds);
  await cls.save();
  res.status(200).json({ success: true, data: cls });
};

exports.assignTeacher = async (req, res, next) => {
  const cls = await Class.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, { classTeacherId: req.body.teacherId }, { new: true });
  res.status(200).json({ success: true, data: cls });
};