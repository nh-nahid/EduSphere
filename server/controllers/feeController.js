const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const Student = require('../models/Student');

exports.createFee = async (req, res, next) => {
  req.body.schoolId = req.schoolId;
  const fee = await Fee.create(req.body);
  res.status(201).json({ success: true, data: fee });
};

exports.getFees = async (req, res, next) => {
  let query = { schoolId: req.schoolId };
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    query.classId = student.classId;
  }
  const fees = await Fee.find(query);
  res.status(200).json({ success: true, data: fees });
};

exports.getStudentFees = async (req, res, next) => {
  const student = await Student.findOne({ userId: req.user._id, schoolId: req.schoolId });
  const fees = await Fee.find({ schoolId: req.schoolId, classId: student.classId });
  const payments = await Payment.find({ studentId: student._id, schoolId: req.schoolId });
  
  const studentFees = fees.map(fee => {
    const payment = payments.find(p => p.feeId.toString() === fee._id.toString());
    return { fee, paymentStatus: payment ? payment.status : 'pending', payment };
  });

  res.status(200).json({ success: true, data: studentFees });
};

exports.getFeesByStudentId = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.studentId, schoolId: req.schoolId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const fees = await Fee.find({ schoolId: req.schoolId, classId: student.classId });
    const payments = await Payment.find({ studentId: student._id, schoolId: req.schoolId });
    
    const studentFees = fees.map(fee => {
      const payment = payments.find(p => p.feeId.toString() === fee._id.toString());
      return { fee, paymentStatus: payment ? payment.status : 'pending', payment };
    });
    res.json({ success: true, data: studentFees });
  } catch(err) { next(err); }
};