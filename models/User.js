const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
      type: DataTypes.ARRAY(DataTypes.STRING),
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

  User.prototype.generateAuthToken = function() {
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
  };

  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};