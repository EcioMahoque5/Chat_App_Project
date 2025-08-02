'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: { type: DataTypes.STRING, allowNull: false },
    other_names: { type: DataTypes.STRING, allowNull: false},
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = function(models) {
    User.hasMany(models.Message, {
      foreignKey: 'user_id',
      as: 'messages'
    });
  };

  return User;
};
