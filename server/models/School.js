const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  logo: { type: String },
  plan: { type: String, enum: ['basic', 'pro'], default: 'basic' },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);