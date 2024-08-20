const { DataTypes, Model } = require('sequelize');

class DoubtComment extends Model {
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
      doubtId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'doubts',
          key: 'id'
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isResolution: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'DoubtComment',
      tableName: 'doubt_comments',
      timestamps: true,
      paranoid: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Doubt, { foreignKey: 'doubtId', as: 'doubt' });
  }
}

module.exports = DoubtComment;