const express = require("express");
const api = express.Router();
const { messagesSchema } = require("../validations")
const validate = require("../validations/validator");
const logger = require("../utils/logger");
const db = require('../models');
const jwtAuth = require('../middlewares/auth');

const Message = db.Message;
const User = db.User;

api.post("/messages", jwtAuth, validate(messagesSchema), async (req, res) => {
  logger.info(`get_chat_messages request: ${JSON.stringify(req.body)}`);

  try {
    const messages = await Message.findAll({
      where: { chat_room: req.body.chat_room },
      order: [['timestamp', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'other_names']
        }
      ]
    });

    const response = messages.map(msg => ({
      user_id: msg.user_id,
      user: `${msg.user?.first_name || ''} ${msg.user?.other_names || ''}`.trim(),
      content: msg.content,
      timestamp: msg.timestamp
    }));

    logger.info(`get_chat_messages response: ${{
        message: "Messages retrieved",
        data: {
            chat_room: req.body.chat_room,
            messages: response
        }
    }}`);

    res.status(200).json({
      success: true,
      message: "Messages retrieved",
      data: response,
      code: 200
    });

  } catch (error) {
    logger.error(`get_chat_messages error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Request Failed. Try again Later",
      code: 500,
    });
  }
});

module.exports = api;
