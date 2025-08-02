const logger = require("../utils/logger");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((err) => err.message);
      const response = {
        success: false,
        message: "Validation errors",
        errors: details,
        code: 400,
      };

      logger.info(`validate errors: ${JSON.stringify(response)}`);
      return res.status(400).json(response);
    }

    next();
  };
};

module.exports = validate;
