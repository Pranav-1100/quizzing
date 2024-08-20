const openaiService = require('./openaiService');
const { Question } = require('../models');

class QuestionService {
  async generateQuestions(userId, topic, difficulty, examType, count, type = 'open-ended') {
    try {
      const prompt = this.createPrompt(topic, difficulty, examType, count, type);
      const response = await openaiService.generateContent(prompt);
      const questions = this.parseResponse(response, type);
      
      // Create questions in the database
      const createdQuestions = await Promise.all(questions.map(async (q) => {
        if (!Question || typeof Question.create !== 'function') {
          console.error('Question model is not properly defined or imported');
          throw new Error('Database error: Unable to create question');
        }
        return await Question.create({
          userId,
          content: q.content,
          type,
          difficulty,
          subject: topic,
          tags: [examType],
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      }));

      return createdQuestions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  createPrompt(topic, difficulty, examType, count, type) {
    let prompt = `Generate ${count} ${difficulty} level ${type} questions about ${topic} for ${examType} exam.`;
    if (type === 'multiple-choice') {
      prompt += ' Include 4 options for each question and indicate the correct answer.';
    }
    return prompt;
  }

  parseResponse(response, type) {
    if (typeof response !== 'string') {
      console.error('Invalid response type:', typeof response);
      return [];
    }
    const questions = response.split('\n\n').filter(q => q.trim() !== '');
    return questions.map(q => {
      if (type === 'multiple-choice') {
        const [content, ...options] = q.split('\n');
        const correctAnswer = options.pop().replace('Correct Answer: ', '');
        return { content, options, correctAnswer };
      }
      return { content: q };
    });
  }

  async getQuestionsByDifficulty(userId, difficulty) {
    return Question.findAll({ where: { userId, difficulty } });
  }
}

module.exports = new QuestionService();