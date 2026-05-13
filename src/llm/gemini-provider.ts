import type { LLMProvider, Message } from './types';

export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model || 'gemini-2.0-flash';
  }

  getCurrentModel(): string {
    return this.model;
  }

  async testConnection(): Promise<{ success: boolean; error?: string; response?: string }> {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "connection successful" in Arabic.' }] }],
        }),
      });
      const data = await res.json();
      if (data.error) {
        return { success: false, error: data.error.message };
      }
      return { success: true, response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'OK' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async chat(messages: Message[]): Promise<string> {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
