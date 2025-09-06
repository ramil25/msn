export class AIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  
  static async summarizeNote(content: string): Promise<string> {
    try {
      // For MVP, we'll create a simple local summarization
      // In production, this would call OpenAI API
      return this.createLocalSummary(content);
    } catch (error) {
      console.error('AI Summarization failed:', error);
      return this.createLocalSummary(content);
    }
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