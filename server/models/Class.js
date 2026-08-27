const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String },
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  academicYear: { type: String },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);