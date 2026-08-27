const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  roll: { type: String },
  section: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
  admissionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);