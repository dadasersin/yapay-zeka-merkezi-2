import React from 'react';
import { AIProvider, AVAILABLE_MODELS } from '../aiService';

interface AIProviderSelectorProps {
    selectedProvider: AIProvider;
    selectedModel: string;
    onProviderChange: (provider: AIProvider) => void;
    onModelChange: (model: string) => void;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
    selectedProvider,
    selectedModel,
    onProviderChange,
    onModelChange
}) => {
    const providers: { id: AIProvider; name: string; icon: string; color: string }[] = [
        { id: 'gemini', name: 'Gemini', icon: 'fa-gem', color: 'cyan' },
        { id: 'openai', name: 'GPT-4', icon: 'fa-robot', color: 'green' },
        { id: 'anthropic', name: 'Claude', icon: 'fa-brain', color: 'purple' },
        { id: 'groq', name: 'Groq', icon: 'fa-bolt', color: 'orange' }
    ];

    return (
        <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
                {providers.map((provider) => (
                    <button
                        key={provider.id}
                        onClick={() => {
                            onProviderChange(provider.id);
                            // Set default model for the provider
                            const defaultModel = AVAILABLE_MODELS[provider.id][0];
                            onModelChange(defaultModel);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${selectedProvider === provider.id
                                ? `bg-${provider.color}-500/20 border-${provider.color}-500 text-${provider.color}-400`
                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                            }`}
                    >
                        <i className={`fas ${provider.icon} mr-2`}></i>
                        {provider.name}
                    </button>
                ))}
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Model:
                </label>
                <select
                    value={selectedModel}
                    onChange={(e) => onModelChange(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-medium focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                    {AVAILABLE_MODELS[selectedProvider].map((model) => (
                        <option key={model} value={model} className="bg-black">
                            {model}
                        </option>
                    ))}
                </select>
            </div>

            {/* API Status Indicator */}
            <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full animate-pulse ${selectedProvider === 'gemini' ? 'bg-cyan-400' :
                        selectedProvider === 'openai' ? 'bg-green-400' :
                            selectedProvider === 'anthropic' ? 'bg-purple-400' :
                                'bg-orange-400'
                    }`}></div>
                <span className="text-gray-500 font-bold uppercase tracking-wider">
                    {selectedProvider === 'gemini' && 'Google Gemini'}
                    {selectedProvider === 'openai' && 'OpenAI GPT'}
                    {selectedProvider === 'anthropic' && 'Anthropic Claude'}
                    {selectedProvider === 'groq' && 'Groq (Llama/Mixtral)'}
                    {' '}• {selectedModel}
                </span>
            </div>
        </div>
    );
};

export default AIProviderSelector;
