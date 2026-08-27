module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (req.user.role === 'super_admin') {
    req.schoolId = req.query.schoolId || req.body.schoolId || null;
  } else {
    req.schoolId = req.user.schoolId;
  }
  next();
};