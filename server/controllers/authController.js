const User = require('../models/User');
const jwtUtil = require('../utils/jwt');
const emailUtil = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
  const { name, email, password, role, schoolId } = req.body;
  const user = await User.create({ name, email, password, role, schoolId });
  
  emailUtil.sendEmail({
    to: email,
    subject: 'Welcome to School Management',
    templateName: 'welcome',
    replacements: { name }
  });

  const token = jwtUtil.generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = jwtUtil.generateRefreshToken({ id: user._id });
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

  await user.populate('schoolId', 'name logo slug');
  res.status(201).json({ success: true, data: user });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.isActive === false) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
  }

  const token = jwtUtil.generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = jwtUtil.generateRefreshToken({ id: user._id });
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

  await user.populate('schoolId', 'name logo slug');
  res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save({ validateBeforeSave: false });
    }
  } catch (_) {  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.status(200).json({ success: true, message: 'Logged out' });
};

exports.refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
  
  const decoded = jwtUtil.verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) return res.status(401).json({ success: false, message: 'Invalid token' });
  
  const accessToken = jwtUtil.generateAccessToken({ id: user._id, role: user.role });
  res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
  res.status(200).json({ success: true });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  emailUtil.sendEmail({
    to: user.email,
    subject: 'Password Reset',
    templateName: 'resetPassword',
    replacements: { link: resetUrl }
  });

  res.status(200).json({ success: true, message: 'Email sent' });
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  
  if (!user) return res.status(400).json({ success: false, message: 'Invalid token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated' });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken').populate('schoolId', 'name logo slug');
    res.json({ success: true, data: user });
  } catch(err){ next(err); }
};