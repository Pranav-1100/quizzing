const { DataTypes, Model } = require('sequelize');

class Quiz extends Model {
  static init(sequelize) {
    super.init({
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
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      questions: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'Quiz',
      tableName: 'quizzes'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Quiz;