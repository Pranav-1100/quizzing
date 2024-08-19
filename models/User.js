const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'teacher', 'student'),
        defaultValue: 'student'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      preferredSubjects: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      examPreparation: {
        type: DataTypes.STRING,
        allowNull: true
      },
      difficultyPreference: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'intermediate'
      },
      questionsGenerated: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      notesGenerated: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    });
  }

  generateAuthToken() {
    const token = jwt.sign(
      { 
        userId: this.id,
        email: this.email,
        role: this.role,
        preferredSubjects: this.preferredSubjects,
        examPreparation: this.examPreparation
      }, 
      process.env.JWT_SECRET || 'your_default_secret_key', 
      { expiresIn: '24h' }
    );
    return token;
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

module.exports = User;