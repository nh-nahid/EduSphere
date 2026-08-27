const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'teacher', 'student'], required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null },
  avatar: { type: String },
  phone: { type: String },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);