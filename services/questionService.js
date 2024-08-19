const openaiService = require('./openaiService');

class QuestionService {
  async generateQuestions(topic, difficulty, examType, count) {
    const prompt = this.createPrompt(topic, difficulty, examType, count);
    const response = await openaiService.generateContent(prompt);
    return this.parseResponse(response);
  }

  createPrompt(topic, difficulty, examType, count) {
    return `Generate ${count} ${difficulty} level questions about ${topic} for ${examType} exam.`;
  }

  parseResponse(response) {
    return response.split('\n').filter(q => q.trim() !== '');
  }
}

module.exports = new QuestionService();