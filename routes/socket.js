const { Server } = require("socket.io");
const { Message, User } = require("../models");
const logger = require("../utils/logger");
const socketAuthMiddleware = require("../middlewares/socket"); // your JWT middleware

function formatLog(message) {
  const separator = "\n" + "=".repeat(80) + "\n";
  return `${separator}${message}${separator}`;
}

const env = process.env.NODE_ENV || 'development';
let allowedOrigins = null;

if (env == 'development'){
    allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ]
} else {
    allowedOrigins = env;
}

module.exports = function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  // Apply socket-level middleware (JWT auth)
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const clientIp = socket.handshake.address;
    const user = socket.user; // populated by JWT middleware

    logger.info(formatLog(`Client connected with IP: ${clientIp}, User ID: ${user.user_id}`));

    socket.on("join", ({ chatRoom, userFullName }) => {
      if (chatRoom) {
        socket.join(chatRoom);
        logger.info(formatLog(`User ${userFullName} joined room: ${chatRoom}`));
      }
    });

    socket.on("leave", ({ chatRoom, userFullName }) => {
      if (chatRoom) {
        socket.leave(chatRoom);
        logger.info(formatLog(`User ${userFullName} left room: ${chatRoom}`));
      }
    });

    socket.on("message", async (msg) => {
      logger.info(formatLog(`Received message: ${JSON.stringify(msg)}`));

      const { chatRoom, message: content } = msg;
      const user_id = user.user_id;

      if (chatRoom && user_id && content) {
        try {
          // Save message to DB
          const saved = await Message.create({
            chat_room: chatRoom,
            user_id,
            content,
            timestamp: new Date(),
          });

          // Emit enriched message with user name
          const sender = await User.findByPk(user_id);
          const fullMessage = {
            chatRoom,
            user_id,
            user: `${sender.first_name} ${sender.other_names}`,
            content,
            timestamp: saved.timestamp,
          };

          io.to(chatRoom).emit("message", fullMessage);
        } catch (error) {
          logger.error(`DB Save Error: ${error.message}`);
          socket.emit("error", { message: "Could not send message." });
        }
      } else {
        logger.info(formatLog("Message broadcasted to all rooms (missing fields)"));
        io.emit("message", msg);
      }
    });

    socket.on("disconnect", () => {
      logger.info(formatLog(`Client disconnected: ${clientIp}, User ID: ${user.user_id}`));
    });
  });
};
