import type { LLMProvider } from './types';
import { ClaudeProvider } from './claude-provider';
import { OpenAIProvider } from './openai-provider';
import { GeminiProvider } from './gemini-provider';
import { GroqProvider } from './groq-provider';

export type ProviderType = 'claude' | 'openai' | 'custom' | 'gemini' | 'groq';

export interface CreateProviderOptions {
  provider: ProviderType;
  apiKey: string;
  model: string;
  customBaseUrl?: string;
}

export function createLLMProvider(options: CreateProviderOptions): LLMProvider {
  const { provider, apiKey, model, customBaseUrl } = options;

  switch (provider) {
    case 'claude':
      return new ClaudeProvider(apiKey, model);

    case 'gemini':
      return new GeminiProvider(apiKey, model);

    case 'groq':
      return new GroqProvider(apiKey, model);

    case 'custom':
      if (!customBaseUrl) {
        throw new Error('customBaseUrl is required for custom provider');
      }
      return new OpenAIProvider(apiKey, model, customBaseUrl);

    case 'openai':
    default:
      return new OpenAIProvider(apiKey, model);
  }
}
