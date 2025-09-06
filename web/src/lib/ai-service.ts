export class AIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  
  static async summarizeNote(content: string): Promise<string> {
    // For MVP, we'll create a simple local summarization
    // In production, this would call OpenAI API
    try {
      // Check if OpenAI API key is available
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (apiKey && content.length > 100) {
        return await this.callOpenAI(content, apiKey);
      } else {
        // Fallback to simple local summarization
        return this.createLocalSummary(content);
      }
    } catch (error) {
      console.error('AI Summarization failed:', error);
      return this.createLocalSummary(content);
    }
  }

  private static async callOpenAI(content: string, apiKey: string): Promise<string> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Summarize this note in 1 sentence:\n\n${content}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || this.createLocalSummary(content);
  }

  private static createLocalSummary(content: string): string {
    // Simple local summarization logic
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return 'Empty note';
    if (sentences.length === 1) return sentences[0].trim();
    
    // Take first sentence or create a summary
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 100) {
      return firstSentence.substring(0, 97) + '...';
    }
    
    return firstSentence;
  }
}