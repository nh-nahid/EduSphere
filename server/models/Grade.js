const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examType: { type: String, enum: ['first_term', 'second_term', 'final', 'unit_test'], required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);