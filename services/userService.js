const { User } = require('../models');

class UserService {
  async createUser(userData) {
    return User.create(userData);
  }

  async getUserById(userId) {
    return User.findByPk(userId);
  }

  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    return user.update(updateData);
  }

  async getUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async updateUserPreferences(userId, preferences) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    return user.update(preferences);
  }
}

module.exports = new UserService();