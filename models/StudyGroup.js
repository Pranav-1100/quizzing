const { DataTypes, Model } = require('sequelize');

class StudyGroup extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      members: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false
      },
      sharedContent: {
        type: DataTypes.JSON,
        defaultValue: {}
      }
    }, {
      sequelize,
      modelName: 'StudyGroup',
      tableName: 'study_groups'
    });
  }

  static associate(models) {
    this.belongsToMany(models.User, { through: 'UserStudyGroups' });
  }
}

module.exports = StudyGroup;