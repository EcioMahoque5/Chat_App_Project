const express = require("express");
const api = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, LoginAttempt } = require("../models");
const validate = require("../validations/validator");
const { loginSchema } = require("../validations");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET_KEY || "default_secret";

api.post("/login", validate(loginSchema), async (req, res) => {
  logger.info(`login request: username='${req.body.username}'`);

  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      // Success login
      const accessToken = jwt.sign({ user_id: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      await LoginAttempt.create({ username: req.body.username, success: true });

      const response = {
        success: true,
        message: `Welcome back ${user.first_name} ${user.other_names}!`,
        access_token: accessToken,
        user: {
          user_id: user.id,
          first_name: user.first_name,
          other_names: user.other_names,
        },
        code: 200,
      };

      logger.info(`login success: ${JSON.stringify(req.body.username)}`);
      return res.status(200).json(response);
    }

    // Failed login
    await LoginAttempt.create({ username, success: false });

    logger.info(`login failed: ${JSON.stringify({ username })}`);
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      code: 401,
    });

  } catch (error) {
    logger.error(`login error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Request Failed. Try again Later",
      code: 500,
    });
  }
});

module.exports = api;
