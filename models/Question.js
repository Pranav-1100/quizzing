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
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('tags');
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue('tags', JSON.stringify(value));
        }
      },
      options: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('options');
          return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
          this.setDataValue('options', JSON.stringify(value));
        }
      },
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Question',
      tableName: 'questions',
      timestamps: true,
      paranoid: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Question;