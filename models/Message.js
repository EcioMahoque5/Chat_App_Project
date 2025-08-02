'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    chat_room: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Message;
};
