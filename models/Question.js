const { DataTypes, Model } = require('sequelize');

class Question extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('open-ended', 'multiple-choice'),
        allowNull: false
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      options: {
        type: DataTypes.JSON,
        allowNull: true
      },
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Question',
      tableName: 'questions',
      timestamps: true, // Adds createdAt and updatedAt fields
      paranoid: true, // Adds deletedAt field for soft deletes
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Question;