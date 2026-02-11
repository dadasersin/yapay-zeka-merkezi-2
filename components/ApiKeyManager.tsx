import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  onApiKeyChange?: (apiKey: string) => void;
  provider?: 'gemini' | 'openai' | 'anthropic' | 'groq';
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ 
  onApiKeyChange, 
  provider = 'gemini' 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    // localStorage'dan kayıtlı anahtarları yükle
    const saved = localStorage.getItem('api_keys');
    if (saved) {
      const keys = JSON.parse(saved);
      setSavedKeys(keys);
      setApiKey(keys[provider] || '');
    }
  }, [provider]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    
    const newKeys = { ...savedKeys, [provider]: apiKey };
    setSavedKeys(newKeys);
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
    
    // Environment variable'ı güncelle (sadece simülasyon için)
    if (provider === 'gemini') {
      (window as any).VITE_GEMINI_API_KEY = apiKey;
    }
    
    onApiKeyChange?.(apiKey);
    setIsVisible(false);
  };

  const handleRemoveKey = () => {
    const newKeys = { ...savedKeys };
    delete newKeys[provider];
    setSavedKeys(newKeys);
    setApiKey('');
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
    
    if (provider === 'gemini') {
      delete (window as any).VITE_GEMINI_API_KEY;
    }
    
    onApiKeyChange?.('');
  };

  const providerNames = {
    gemini: 'Google Gemini',
    openai: 'OpenAI',
    anthropic: 'Anthropic Claude',
    groq: 'Groq'
  };

  const providerColors = {
    gemini: 'bg-blue-500',
    openai: 'bg-green-500',
    anthropic: 'bg-purple-500',
    groq: 'bg-orange-500'
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-black/80 backdrop-blur-lg border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-800 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${savedKeys[provider] ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">🔑 API Anahtarları</span>
          </div>
        </button>
      ) : (
        <div className="bg-black/90 backdrop-blur-xl border border-gray-600 rounded-lg p-6 w-96 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">API Anahtar Yönetimi</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                {providerNames[provider]} API Anahtarı
              </label>
              <div className="flex gap-2">
                <input
                  type={isVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`API anahtarınızı girin...`}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                >
                  {isVisible ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="flex-1 bg-cyan-500 text-black px-4 py-2 rounded font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                💾 Kaydet
              </button>
              {savedKeys[provider] && (
                <button
                  onClick={handleRemoveKey}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  🗑️ Sil
                </button>
              )}
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>• API anahtarları sadece tarayıcınızda saklanır</p>
              <p>• Asla sunuculara gönderilmez</p>
              <p>• İstediğiniz zaman değiştirebilirsiniz</p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <div className="text-xs text-gray-400 mb-2">Durum:</div>
              <div className="space-y-1">
                {Object.entries(providerNames).map(([key, name]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${savedKeys[key] ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-gray-300">{name}</span>
                    <span className="text-gray-500">
                      {savedKeys[key] ? '✓ Yapılandırıldı' : '✗ Boş'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
