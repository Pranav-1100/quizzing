const { Quiz, Question } = require('../models');

class QuizService {
  async createQuiz(userId, title, subjectOrTags, questionCount) {
    const questions = await Question.findAll({
      where: {
        userId,
        [Sequelize.Op.or]: [
          { subject: subjectOrTags },
          { tags: { [Sequelize.Op.contains]: [subjectOrTags] } }
        ]
      },
      order: Sequelize.literal('random()'),
      limit: questionCount
    });

    return Quiz.create({
      userId,
      title,
      questions: questions.map(q => q.id)
    });
  }

  async submitQuizAnswers(quizId, answers) {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question, as: 'questions' }]
    });
    if (!quiz) throw new Error('Quiz not found');

    const score = quiz.questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === answers[index] ? 1 : 0);
    }, 0);

    quiz.score = score;
    quiz.completed = true;
    return quiz.save();
  }

  async getQuizResults(quizId) {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question, as: 'questions' }]
    });
    if (!quiz) throw new Error('Quiz not found');

    return {
      title: quiz.title,
      score: quiz.score,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        content: q.content,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.userAnswer === q.correctAnswer
      }))
    };
  }
}

module.exports = new QuizService();