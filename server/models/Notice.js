const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRole: { type: String, enum: ['all', 'teacher', 'student', 'admin'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);