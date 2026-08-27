const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  amount: { type: Number, required: true },
  gatewayTxnId: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  invoiceUrl: { type: String },
  paidAt: { type: Date },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);