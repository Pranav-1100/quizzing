const { StudyPlan, User } = require('../models');
const openaiService = require('./openaiService');

class StudyPlanService {
  async generateStudyPlan(userId, examDate, subjects) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const prompt = this.createStudyPlanPrompt(user, examDate, subjects);
    const response = await openaiService.generateContent(prompt);
    const dailyGoals = this.parseStudyPlan(response);

    return StudyPlan.create({
      userId,
      examDate,
      subjects,
      dailyGoals
    });
  }

  createStudyPlanPrompt(user, examDate, subjects) {
    return `Create a study plan for a ${user.examPreparation} exam on ${examDate}. 
    The plan should cover the following subjects: ${subjects.join(', ')}. 
    The user's preferred difficulty is ${user.difficultyPreference}.
    Generate daily goals up to the exam date.`;
  }

  parseStudyPlan(response) {
    return response.split('\n').reduce((acc, line) => {
      const [date, goal] = line.split(': ');
      acc[date] = goal;
      return acc;
    }, {});
  }

  async updateProgress(studyPlanId, progress) {
    const studyPlan = await StudyPlan.findByPk(studyPlanId);
    if (!studyPlan) throw new Error('Study plan not found');
    
    studyPlan.progress = progress;
    return studyPlan.save();
  }
}

module.exports = new StudyPlanService();