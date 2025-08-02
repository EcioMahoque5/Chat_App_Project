const Joi = require("joi");

const userSchema = Joi.object({
  first_name: Joi.string().min(3).max(150).required().messages({
    "string.base": "First Name must be a string!",
    "string.empty": "First Name is required!",
    "string.min": "First Name must be at least 3 characters!",
    "string.max": "First Name must be at most 150 characters!",
    "any.required": "First Name is required!",
  }),

  other_names: Joi.string().min(3).max(150).required().messages({
    "string.base": "Other Names must be a string!",
    "string.empty": "Other Names is required!",
    "string.min": "Other Names must be at least 3 characters!",
    "string.max": "Other Names must be at most 150 characters!",
    "any.required": "Other Names is required!",
  }),

  username: Joi.string().min(3).max(150).required().messages({
    "string.base": "Username must be a string!",
    "string.empty": "Username is required!",
    "string.min": "Username must be at least 3 characters!",
    "string.max": "Username must be at most 150 characters!",
    "any.required": "Username is required!",
  }),

  password: Joi.string()
    .pattern(
      new RegExp(
        '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=`~{}|;:",.<>?/]).{8,32}$'
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character, and be between 8 and 32 characters long",
      "string.empty": "Password is required!",
      "any.required": "Password is required!",
    }),
});

const messagesSchema = Joi.object({
  chat_room: Joi.string().required().messages({
    "string.base": "Chat room must be a string!",
    "string.empty": "Chat room not specified!",
    "any.required": "Chat room not specified!",
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(150).required().messages({
    "string.base": "Username must be a string!",
    "string.empty": "Username is required!",
    "string.min": "Username must be at least 3 characters!",
    "string.max": "Username must be at most 150 characters!",
    "any.required": "Username is required!",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required!",
    "any.required": "Password is required!",
  }),

  chatRoom: Joi.string().min(1).max(150).required().messages({
    "string.base": "Chat room must be a string!",
    "string.empty": "Chat room is required!",
    "string.min": "Chat room must be at least 1 characters!",
    "string.max": "Chat room must be at most 150 characters!",
    "any.required": "Chat room is required!",
  }),
});
module.exports = { userSchema, messagesSchema, loginSchema };
