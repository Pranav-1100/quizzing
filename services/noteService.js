const openaiService = require('./openaiService');

class NoteService {
  async generateNotes(topic, examType) {
    const prompt = this.createPrompt(topic, examType);
    const response = await openaiService.generateContent(prompt);
    return this.parseResponse(response);
  }

  createPrompt(topic, examType) {
    return `Generate concise study notes on ${topic} for ${examType} exam preparation.`;
  }

  parseResponse(response) {
    return response;
  }
}

module.exports = new NoteService();