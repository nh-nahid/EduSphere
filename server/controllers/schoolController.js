const School = require('../models/School');

exports.createSchool = async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const school = await School.create(req.body);
  res.status(201).json({ success: true, data: school });
};

exports.getAllSchools = async (req, res, next) => {
  const schools = await School.find();
  res.status(200).json({ success: true, data: schools });
};

exports.getSchool = async (req, res, next) => {
  const school = await School.findById(req.params.id);
  res.status(200).json({ success: true, data: school });
};

exports.updateSchool = async (req, res, next) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: school });
};

exports.toggleActive = async (req, res, next) => {
  const school = await School.findById(req.params.id);
  school.isActive = !school.isActive;
  await school.save();
  res.status(200).json({ success: true, data: school });
};