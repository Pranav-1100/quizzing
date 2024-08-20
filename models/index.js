const sequelize = require('../config/database');
const User = require('./User');
const Analytics = require('./Analytics');
const Question = require('./Question');
const Note = require('./Note');
const StudyPlan = require('./StudyPlan');
const Quiz = require('./Quiz');
const StudyGroup = require('./StudyGroup');
const Doubt = require('./Doubt');
const DoubtComment = require('./DoubtComment');

const models = {
  User,
  Analytics,
  Question,
  Note,
  StudyPlan,
  Quiz,
  StudyGroup,
  Doubt,
  DoubtComment
};

// Initialize models
Object.values(models).forEach(model => {
  if (typeof model.init === 'function') {
    model.init(sequelize);
  }
});

// Set up associations
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};