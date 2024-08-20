const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generateContent(prompt) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
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

      if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
        return response.data.choices[0].message.content.trim();
      } else {
        console.error('Unexpected response structure from OpenAI API:', response.data);
        throw new Error('Unexpected response structure from OpenAI API');
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
      throw new Error('Failed to generate content');
    }
  }
}

module.exports = new OpenAIService();