const User = require('../models/User');

// GET /users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpire');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// PUT /users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = { name, phone };
    if (req.file) updates.avatar = `/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpire');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// PUT /users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { next(err); }
};