'use strict';

module.exports = (sequelize, DataTypes) => {
  const LoginAttempt = sequelize.define('LoginAttempt', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'login_attempts',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false
  });

  return LoginAttempt;
};
