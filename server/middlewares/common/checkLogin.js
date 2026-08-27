const jwtUtil = require('../../utils/jwt');
const User = require('../../models/User');

module.exports = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'accessToken';
    const token = req.cookies[cookieName];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const decoded = jwtUtil.verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};