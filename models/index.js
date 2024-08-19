const sequelize = require('../config/database');
const User = require('./User');
const Analytics = require('./Analytics');

const models = {
  User,
  Analytics
};

Object.values(models).forEach(model => model.init(sequelize));
Object.values(models).forEach(model => model.associate && model.associate(models));

module.exports = models;