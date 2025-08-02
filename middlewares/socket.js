const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')

const JWT_SECRET = process.env.JWT_SECRET_KEY || "default_secret";

const socketAuthMiddleware  = ((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    logger.info("Socket connection rejected: Token missing");
    return next(new Error("Authentication error: Token required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    logger.info("Socket authenticated:", decoded);
    next();
  } catch (err) {
    logger.info("Socket connection rejected: Invalid token");
    return next(new Error("Authentication error: Invalid token"));
  }
});

module.exports = socketAuthMiddleware;