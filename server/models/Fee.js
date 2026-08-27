const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  academicYear: { type: String },
  type: { type: String, enum: ['tuition', 'exam', 'transport', 'other'], required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);