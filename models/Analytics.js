const { DataTypes, Model } = require('sequelize');

class Analytics extends Model {
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
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'Analytics',
      tableName: 'analytics',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Analytics;