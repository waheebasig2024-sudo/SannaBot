import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ApiKeyInput } from '../components/ApiKeyInput';
import { ModelPicker } from '../components/ModelPicker';
import { ProviderToggle } from '../components/ProviderToggle';
import {
  fetchClaudeModels,
  fetchCustomModels,
  fetchOpenAIModels,
  fetchGeminiModels,
  fetchGroqModels,
} from '../../../llm/model-list';
import { t } from '../../../i18n';

interface ProviderSectionProps {
  selectedProvider: 'claude' | 'openai' | 'custom' | 'gemini' | 'groq';
  onProviderChange: (provider: 'claude' | 'openai' | 'custom' | 'gemini' | 'groq') => void;
  claudeApiKey: string;
  onClaudeApiKeyChange: (key: string) => void;
  openAIApiKey: string;
  onOpenAIApiKeyChange: (key: string) => void;
  selectedOpenAIModel: string;
  onOpenAIModelChange: (model: string) => void;
  selectedClaudeModel: string;
  onClaudeModelChange: (model: string) => void;
  customApiKey: string;
  onCustomApiKeyChange: (key: string) => void;
  customModelUrl: string;
  onCustomModelUrlChange: (url: string) => void;
  customModelName: string;
  onCustomModelNameChange: (name: string) => void;
  geminiApiKey: string;
  onGeminiApiKeyChange: (key: string) => void;
  selectedGeminiModel: string;
  onGeminiModelChange: (model: string) => void;
  groqApiKey: string;
  onGroqApiKeyChange: (key: string) => void;
  selectedGroqModel: string;
  onGroqModelChange: (model: string) => void;
  onTestConnection?: () => void;
}

export function ProviderSection({
  selectedProvider,
  onProviderChange,
  claudeApiKey,
  onClaudeApiKeyChange,
  openAIApiKey,
  onOpenAIApiKeyChange,
  selectedOpenAIModel,
  onOpenAIModelChange,
  selectedClaudeModel,
  onClaudeModelChange,
  customApiKey,
  onCustomApiKeyChange,
  customModelUrl,
  onCustomModelUrlChange,
  customModelName,
  onCustomModelNameChange,
  geminiApiKey,
  onGeminiApiKeyChange,
  selectedGeminiModel,
  onGeminiModelChange,
  groqApiKey,
  onGroqApiKeyChange,
  selectedGroqModel,
  onGroqModelChange,
  onTestConnection,
}: ProviderSectionProps): React.JSX.Element {
  return (
    <>
      <ProviderToggle selected={selectedProvider} onChange={onProviderChange} />

      {selectedProvider === 'claude' && (
        <>
          <ApiKeyInput label="Claude API Key" value={claudeApiKey} onChange={onClaudeApiKeyChange} placeholder="sk-ant-..." visible />
          <ModelPicker label={t('settings.provider.claudeModel')} apiKey={claudeApiKey} selectedModel={selectedClaudeModel} onModelChange={onClaudeModelChange} fetchModels={fetchClaudeModels} defaultModel="claude-3-5-sonnet-20241022" />
          <View className="mt-3 mx-4 mb-4"><ConnectionTest onTest={onTestConnection} apiKey={claudeApiKey} modelName={selectedClaudeModel} /></View>
        </>
      )}

      {selectedProvider === 'openai' && (
        <>
          <ApiKeyInput label="OpenAI API Key" value={openAIApiKey} onChange={onOpenAIApiKeyChange} placeholder="sk-..." visible />
          <ModelPicker label={t('settings.provider.openaiModel')} apiKey={openAIApiKey} selectedModel={selectedOpenAIModel} onModelChange={onOpenAIModelChange} fetchModels={fetchOpenAIModels} defaultModel="gpt-5.2" />
          <View className="mt-3 mx-4 mb-4"><ConnectionTest onTest={onTestConnection} apiKey={openAIApiKey} modelName={selectedOpenAIModel} /></View>
        </>
      )}

      {selectedProvider === 'gemini' && (
        <>
          <ApiKeyInput label="Gemini API Key" value={geminiApiKey} onChange={onGeminiApiKeyChange} placeholder="AIza..." visible />
          <ModelPicker label="Gemini Model" apiKey={geminiApiKey} selectedModel={selectedGeminiModel} onModelChange={onGeminiModelChange} fetchModels={fetchGeminiModels} defaultModel="gemini-2.0-flash" />
          <View className="mt-3 mx-4 mb-4"><ConnectionTest onTest={onTestConnection} apiKey={geminiApiKey} modelName={selectedGeminiModel} /></View>
        </>
      )}

      {selectedProvider === 'groq' && (
        <>
          <ApiKeyInput label="Groq API Key" value={groqApiKey} onChange={onGroqApiKeyChange} placeholder="gsk_..." visible />
          <ModelPicker label="Groq Model" apiKey={groqApiKey} selectedModel={selectedGroqModel} onModelChange={onGroqModelChange} fetchModels={fetchGroqModels} defaultModel="llama-3.3-70b-versatile" />
          <View className="mt-3 mx-4 mb-4"><ConnectionTest onTest={onTestConnection} apiKey={groqApiKey} modelName={selectedGroqModel} /></View>
        </>
      )}

      {selectedProvider === 'custom' && (
        <>
          <ApiKeyInput label={t('settings.provider.customApiKey')} value={customApiKey} onChange={onCustomApiKeyChange} placeholder="sk-..." visible />
          <ApiKeyInput label={t('settings.provider.customBaseUrl')} value={customModelUrl} onChange={onCustomModelUrlChange} placeholder="https://your-server.com/v1" visible secureTextEntry={false} />
          <ModelPicker label={t('settings.provider.customModel')} apiKey={customApiKey} selectedModel={customModelName} onModelChange={onCustomModelNameChange} fetchModels={fetchCustomModels} defaultModel="custom-model" allowManualInput baseUrl={customModelUrl} />
          <View className="mt-3 mx-4 mb-4"><ConnectionTest onTest={onTestConnection} apiKey={customApiKey} modelName={customModelName} url={customModelUrl} /></View>
        </>
      )}
    </>
  );
}

interface ConnectionTestProps {
  onTest?: () => void;
  apiKey: string;
  modelName: string;
  url?: string;
}

function ConnectionTest({ onTest, apiKey, modelName, url }: ConnectionTestProps): React.JSX.Element | null {
  const [testing, setTesting] = useState(false);
  const canTest = apiKey.trim() !== '' && modelName.trim() !== '' && (url === undefined || url.trim() !== '') && onTest !== undefined;

  const handleTest = async () => {
    if (!canTest || !onTest) return;
    setTesting(true);
    try { await onTest(); } finally { setTesting(false); }
  };

  if (onTest === undefined) return null;

  return (
    <TouchableOpacity onPress={handleTest} disabled={!canTest || testing} className={`rounded-lg px-3 py-2 ${canTest && !testing ? 'bg-accent' : 'bg-surface-tertiary opacity-50'}`}>
      {testing ? (
        <View className="flex-row items-center justify-center gap-2"><ActivityIndicator size="small" color="#fff" /><Text className="text-label-primary text-sm font-medium">{t('settings.provider.testingConnection')}</Text></View>
      ) : (
        <View className="flex-row items-center justify-center gap-2"><Text className="text-label-primary text-base">✓</Text><Text className="text-label-primary text-sm font-medium">{t('settings.provider.testConnection')}</Text></View>
      )}
    </TouchableOpacity>
  );
}
