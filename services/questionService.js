const { Question } = require('../models');
const openaiService = require('./openaiService');

class QuestionService {
  async generateQuestions(userId, topic, difficulty, examType, count, type = 'open-ended') {
    try {
      const prompt = this.createPrompt(topic, difficulty, examType, count, type);
      const response = await openaiService.generateContent(prompt);
      const questions = this.parseResponse(response, type);
      
      const createdQuestions = await Promise.all(questions.map(async (q) => {
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
    return `Generate ${count} ${difficulty} level ${type} questions about ${topic} for ${examType} exam. Include 4 options for each question and indicate the correct answer.`;
  }

  parseResponse(response, type) {
    console.log('Raw response:', response); // Add this line for debugging

    if (typeof response !== 'string' || response.trim() === '') {
      console.error('Invalid response from OpenAI:', response);
      return [];
    }

    const questions = response.split('\n\n').filter(q => q.trim() !== '');
    
    return questions.map(q => {
      const lines = q.split('\n');
      const content = lines[0].trim();
      let options = [];
      let correctAnswer = '';

      if (type === 'multiple-choice' && lines.length > 1) {
        options = lines.slice(1, -1).map(line => line.trim());
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine.startsWith('Correct Answer:')) {
          correctAnswer = lastLine.replace('Correct Answer:', '').trim();
        } else {
          options.push(lastLine);
        }
      }

      return { content, options, correctAnswer };
    });
  }
}

module.exports = new QuestionService();