const { StudyGroup, User } = require('../models');

class StudyGroupService {
  async createGroup(name, description, creatorId) {
    return StudyGroup.create({
      name,
      description,
      members: [creatorId]
    });
  }

  async addMember(groupId, userId) {
    const group = await StudyGroup.findByPk(groupId);
    if (!group) throw new Error('Study group not found');

    if (!group.members.includes(userId)) {
      group.members = [...group.members, userId];
      await group.save();
    }
    return group;
  }

  async shareContent(groupId, userId, contentType, contentId) {
    const group = await StudyGroup.findByPk(groupId);
    if (!group) throw new Error('Study group not found');

    if (!group.members.includes(userId)) {
      throw new Error('User is not a member of this group');
    }

    if (!group.sharedContent[contentType]) {
      group.sharedContent[contentType] = [];
    }
    
    if (!group.sharedContent[contentType].includes(contentId)) {
      group.sharedContent[contentType].push(contentId);
      await group.save();
    }
    
    return group;
  }

  async getSharedContent(groupId) {
    const group = await StudyGroup.findByPk(groupId, {
      include: [
        { model: User, attributes: ['id', 'username'] }
      ]
    });
    if (!group) throw new Error('Study group not found');

    return {
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        members: group.Users
      },
      sharedContent: group.sharedContent
    };
  }
}

module.exports = new StudyGroupService();