const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  qualification: { type: String },
  joiningDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);