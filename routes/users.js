const express = require("express");
const api = express.Router();
const validate = require("../validations/validator");
const { userSchema } = require("../validations");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const db = require('../models');
const jwtAuth = require('../middlewares/auth');

const User = db.User;

// Get all users
api.get("/get_all_users", jwtAuth, async (req, res) => {
  logger.info("get_all_users request received");

  try {
    const users = await User.findAll();
    if (!users) {
      logger.info("get_all_users response: No users found!");
    } else {
      logger.info("get_all_users response: Users retrieved successfully!");
    }
    const usersData = users.map((user) => {
      const { password, ...userData } = user.toJSON();
      return userData;
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: usersData,
      code: 200,
    });
  } catch (error) {
    logger.error(`get_all_users error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Request Failed. Try again Later",
      code: 500,
    });
  }
});

api.post("/create_user", validate(userSchema), async (req, res) => {
    const { password: _, ...sanitazedDate } = req.body;
  logger.info(`create_user request: ${JSON.stringify(sanitazedDate)}`);

  try {
    const exists = await User.findOne({
      where: { username: req.body.username },
    });
    if (exists) {
      const errorResponse = {
        success: false,
        message: "Validation errors",
        errors: "Username is already registered.",
        code: 400,
      };
      logger.info(`create_user response: ${JSON.stringify(errorResponse)}`);
      return res.status(400).json(errorResponse);
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    const user = await User.create({
      first_name: req.body.first_name,
      other_names: req.body.other_names,
      username: req.body.username,
      password: hashedPassword,
    });

    const { password: _, ...userData } = user.toJSON();

    const successResponse = {
      success: true,
      message: "User successfully registered!",
      data: userData,
      code: 201,
    };

    logger.info(`create_user response: ${JSON.stringify(successResponse)}`);
    res.status(201).json({
      success: true,
      message: "User successfully registered!",
      data: userData,
      code: 201,
    });
  } catch (error) {
    logger.error(`create_user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Request Failed. Try again Later",
      code: 500,
    });
  }
});

module.exports = api;
