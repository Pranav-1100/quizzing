const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  }

  async generateContent(prompt) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          prompt: prompt,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to generate content');
    }
  }
}

module.exports = new OpenAIService();