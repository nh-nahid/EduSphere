const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const SmsLog = require('../models/SmsLog');
const Grade = require('../models/Grade');
const User = require('../models/User');
const School = require('../models/School');

exports.getDashboardStats = async (req, res, next) => {
  const isSuperAdmin = req.user.role === 'super_admin';

  if (isSuperAdmin) {
    const totalSchools = await School.countDocuments({});
    const totalStudents = await Student.countDocuments({});
    const totalTeachers = await Teacher.countDocuments({});
    const totalClasses = await Class.countDocuments({});
    const payments = await Payment.find({ status: 'paid' });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const smsCount = await SmsLog.countDocuments({ sentAt: { $gte: today } });

    return res.status(200).json({
      success: true,
      data: {
        isSuperAdmin: true,
        totalSchools,
        totalStudents,
        totalTeachers,
        totalClasses,
        totalRevenue,
        smsCount,
        attendanceRate: 100
      }
    });
  }

  const schoolId = req.schoolId;
  const totalStudents = await Student.countDocuments({ schoolId });
  const totalTeachers = await Teacher.countDocuments({ schoolId });
  const totalClasses = await Class.countDocuments({ schoolId });
  
  const payments = await Payment.find({ schoolId, status: 'paid' });
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const attendances = await Attendance.find({ schoolId, date: today });
  let totalPresent = 0;
  let totalRecords = 0;
  attendances.forEach(att => {
    att.records.forEach(r => {
      totalRecords++;
      if (r.status === 'present') totalPresent++;
    });
  });
  const attendanceRate = totalRecords ? (totalPresent / totalRecords) * 100 : 0;

  const smsCount = await SmsLog.countDocuments({ schoolId, sentAt: { $gte: today } });

  res.status(200).json({ success: true, data: { totalStudents, totalTeachers, totalClasses, totalRevenue, attendanceRate, smsCount } });
};

exports.getMonthlyfees = async (req, res, next) => {
  const payments = await Payment.aggregate([
    { $match: { schoolId: req.schoolId, status: 'paid' } },
    { $group: { _id: { $month: "$paidAt" }, total: { $sum: "$amount" } } }
  ]);
  res.status(200).json({ success: true, data: payments });
};

exports.getTopPerformers = async (req, res, next) => {
  const grades = await Grade.aggregate([
    { $match: { schoolId: req.schoolId } },
    { $group: { _id: "$studentId", avgGrade: { $avg: { $divide: ["$marks", "$totalMarks"] } } } },
    { $sort: { avgGrade: -1 } },
    { $limit: 5 }
  ]);
  const studentIds = grades.map(g => g._id);
  const students = await Student.find({ _id: { $in: studentIds } }).populate('userId classId');
  res.status(200).json({ success: true, data: students });
};

exports.getUserManagement = async (req, res, next) => {
  const users = await User.find({ schoolId: req.schoolId });
  res.status(200).json({ success: true, data: users });
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, schoolId: req.schoolId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Assuming there's an isActive field. If not, maybe role or something? Wait, just toggle isActive
    user.isActive = user.isActive === undefined ? false : !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch(err) { next(err); }
};