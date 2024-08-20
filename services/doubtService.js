const { Doubt, DoubtComment, User } = require('../models');

class DoubtService {
  async createDoubt(userId, title, content, subject) {
    return Doubt.create({
      userId,
      title,
      content,
      subject
    });
  }

  async getAllDoubts(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return Doubt.findAndCountAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: DoubtComment, as: 'comments', separate: true, limit: 1, order: [['createdAt', 'DESC']] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
  }

  async getDoubtById(doubtId) {
    return Doubt.findByPk(doubtId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { 
          model: DoubtComment, 
          as: 'comments', 
          include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
  }

  async addComment(userId, doubtId, content, isResolution = false) {
    const comment = await DoubtComment.create({
      userId,
      doubtId,
      content,
      isResolution
    });

    if (isResolution) {
      await Doubt.update({ isResolved: true }, { where: { id: doubtId } });
    }

    return comment;
  }

  async markAsResolved(doubtId) {
    return Doubt.update({ isResolved: true }, { where: { id: doubtId } });
  }
}

module.exports = new DoubtService();