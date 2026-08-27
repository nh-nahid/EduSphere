const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const smsUtil = require('../utils/sms');

exports.markAttendance = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  req.body.takenBy = req.user._id;
  const attendance = await Attendance.create(req.body);
  
  const absents = req.body.records.filter(r => r.status === 'absent');
  for (let record of absents) {
    const student = await Student.findOne({ _id: record.studentId, schoolId: req.schoolId });
    if (student && student.guardianPhone) {
      smsUtil.sendSms(student.guardianPhone, `Your child ${student.guardianName || ''} was absent on ${new Date(req.body.date).toDateString()}.`, { event: 'absence', studentId: student._id, schoolId: req.schoolId });
    }
  }

  res.status(201).json({ success: true, data: attendance });
};

exports.getAttendanceByClass = async (req, res, next) => {
  const { classId, startDate, endDate } = req.query;
  const query = { schoolId: req.schoolId, classId };
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  const attendance = await Attendance.find(query).populate('records.studentId');
  res.status(200).json({ success: true, data: attendance });
};

exports.getMyAttendance = async (req, res, next) => {
  const student = await Student.findOne({ userId: req.user._id, schoolId: req.schoolId });
  const records = await Attendance.find({ schoolId: req.schoolId, 'records.studentId': student._id });
  const myRecords = records.map(att => ({
    date: att.date,
    status: att.records.find(r => r.studentId.toString() === student._id.toString()).status
  }));
  res.status(200).json({ success: true, data: myRecords });
};

exports.getMonthlyAttendanceSummary = async (req, res, next) => {
  const { classId, month, year } = req.query;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const records = await Attendance.find({ schoolId: req.schoolId, classId, date: { $gte: start, $lte: end } });
  res.status(200).json({ success: true, data: records });
};