import type { LLMProvider, Message } from './types';

export class GroqProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model || 'llama-3.3-70b-versatile';
  }

  getCurrentModel(): string {
    return this.model;
  }

  async testConnection(): Promise<{ success: boolean; error?: string; response?: string }> {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'Say "connection successful" in Arabic.' }],
        }),
      });
      const data = await res.json();
      if (data.error) {
        return { success: false, error: data.error.message };
      }
      return { success: true, response: data.choices?.[0]?.message?.content || 'OK' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async chat(messages: Message[]): Promise<string> {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || '';
  }
}
