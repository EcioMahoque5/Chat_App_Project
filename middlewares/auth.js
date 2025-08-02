const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "default_secret";

const jwtAuth = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token missing!',
      code: 401
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user.id to request
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token!',
      code: 403
    });
  }
};

module.exports = jwtAuth;
