const { DataTypes, Model } = require('sequelize');

class StudyPlan extends Model {
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
      examDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      subjects: {
        type: DataTypes.JSON,
        allowNull: false
      },
      dailyGoals: {
        type: DataTypes.JSON,
        allowNull: false
      },
      progress: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'StudyPlan',
      tableName: 'study_plans'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = StudyPlan;