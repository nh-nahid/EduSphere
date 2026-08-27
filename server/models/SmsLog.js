const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  event: { type: String, enum: ['absence', 'fee_due', 'fee_paid', 'grade', 'notice', 'admission', 'general'], default: 'general' },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SmsLog', smsLogSchema);