const openaiService = require('./openaiService');
const { Note } = require('../models');

class NoteService {
  async generateNotes(userId, topic, examType, format = 'bullet-points') {
    const prompt = this.createPrompt(topic, examType, format);
    const response = await openaiService.generateContent(prompt);
    const content = this.parseResponse(response, format);
    
    return Note.create({
      userId,
      content,
      subject: topic,
      format
    });
  }

  createPrompt(topic, examType, format) {
    return `Generate ${format} study notes on ${topic} for ${examType} exam preparation.`;
  }

  parseResponse(response, format) {
    return response;
  }

  async shareNote(noteId) {
    const note = await Note.findByPk(noteId);
    if (!note) throw new Error('Note not found');
    note.isShared = true;
    return note.save();
  }

  async generateFlashcards(noteId) {
    const note = await Note.findByPk(noteId);
    if (!note) throw new Error('Note not found');
    
    const prompt = `Generate flashcards from the following notes:\n${note.content}`;
    const response = await openaiService.generateContent(prompt);
    
    const flashcards = this.parseFlashcards(response);
    
    return flashcards;
  }

  parseFlashcards(response) {
    return response.split('\n\n').map(card => {
      const [question, answer] = card.split('\nAnswer: ');
      return { question, answer };
    });
  }
}

module.exports = new NoteService();