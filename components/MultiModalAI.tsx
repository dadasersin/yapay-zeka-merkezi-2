import React, { useState, useRef } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface MultiModalInput {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video';
  content: string;
  metadata?: any;
}

interface AIResponse {
  text: string;
  confidence: number;
  analysis: {
    objects?: string[];
    emotions?: string[];
    transcription?: string;
    summary?: string;
  };
}

const MultiModalAI: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [inputs, setInputs] = useState<MultiModalInput[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4-vision');
  const [analysisType, setAnalysisType] = useState<'comprehensive' | 'objects' | 'emotions' | 'transcription'>('comprehensive');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTextInput = (text: string) => {
    const newInput: MultiModalInput = {
      id: Date.now().toString(),
      type: 'text',
      content: text
    };
    setInputs(prev => [...prev, newInput]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('audio/') ? 'audio' : 'video';
        
        const newInput: MultiModalInput = {
          id: Date.now().toString() + Math.random(),
          type,
          content: base64,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type
          }
        };
        
        setInputs(prev => [...prev, newInput]);
      };
      reader.readAsDataURL(file);
    }
  };

  const processMultiModal = async () => {
    if (inputs.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Simüle edilmiş multi-modal AI işlemi
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResponse: AIResponse = {
        text: "Multi-modal analiz tamamlandı. Görselde bir kişi ve manzara tespit edildi. Metin 'merhaba dünya' içeriyor. Ses kaydı temiz ve anlaşılır.",
        confidence: 0.92,
        analysis: {
          objects: ['person', 'landscape', 'tree', 'building'],
          emotions: ['happy', 'neutral', 'calm'],
          transcription: inputs.find(i => i.type === 'audio') ? 
            "Merhaba, bu bir test kaydıdır. AI sistemleri çok gelişmiş." : undefined,
          summary: "Kullanıcı çeşitli medya türleri yüklemiş ve analiz talep etmiş."
        }
      };
      
      setAiResponse(mockResponse);
    } catch (error) {
      console.error('Multi-modal processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generate3DModel = async () => {
    const imageInput = inputs.find(i => i.type === 'image');
    if (!imageInput) return;
    
    setIsProcessing(true);
    
    // 3D model üretimi simülasyonu
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    alert('3D Model üretildi! (Simülasyon)');
    setIsProcessing(false);
  };

  const removeInput = (id: string) => {
    setInputs(prev => prev.filter(input => input.id !== id));
  };

  const models = [
    'gpt-4-vision',
    'claude-3-vision',
    'gemini-pro-vision',
    'llava-v1.5'
  ];

  return (
    <div className="multimodal-ai p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🧠 Multi-Modal AI</h2>
      
      {/* Model Selection */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🤖 Model Seçimi</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {models.map(model => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-3 py-2 rounded ${
                selectedModel === model 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as any)}
            className="bg-gray-700 px-3 py-2 rounded flex-1"
          >
            <option value="comprehensive">Kapsamlı Analiz</option>
            <option value="objects">Nesne Tespiti</option>
            <option value="emotions">Duygu Analizi</option>
            <option value="transcription">Transkripsiyon</option>
          </select>
        </div>
      </div>

      {/* Input Methods */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📥 Girdi Ekle</h3>
        
        {/* Text Input */}
        <div className="mb-4">
          <textarea
            placeholder="Metin girin..."
            className="w-full bg-gray-700 p-3 rounded"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addTextInput(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="text-sm text-gray-400 mt-1">Ctrl+Enter ile ekle</div>
        </div>
        
        {/* File Upload */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            📁 Medya Yükle
          </button>
          <button
            onClick={processMultiModal}
            disabled={inputs.length === 0 || isProcessing}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {isProcessing ? '🔄 İşleniyor...' : '🔍 Analiz Et'}
          </button>
          <button
            onClick={generate3DModel}
            disabled={!inputs.find(i => i.type === 'image') || isProcessing}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50"
          >
            🎨 3D Model Üret
          </button>
        </div>
      </div>

      {/* Inputs Display */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📋 Yüklenen İçerikler</h3>
        <div className="space-y-2">
          {inputs.map(input => (
            <div key={input.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {input.type === 'text' && '📝'}
                  {input.type === 'image' && '🖼️'}
                  {input.type === 'audio' && '🎵'}
                  {input.type === 'video' && '🎬'}
                </span>
                <div>
                  <div className="font-medium">{input.type.toUpperCase()}</div>
                  {input.metadata && (
                    <div className="text-sm text-gray-400">
                      {input.metadata.fileName} ({Math.round(input.metadata.fileSize / 1024)}KB)
                    </div>
                  )}
                  {input.type === 'text' && (
                    <div className="text-sm text-gray-400 truncate max-w-xs">
                      {input.content.substring(0, 50)}...
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeInput(input.id)}
                className="text-red-400 hover:text-red-300"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">🤖 AI Yanıtı</h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Güven Skoru:</span>
              <span className="text-green-400">{(aiResponse.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${aiResponse.confidence * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded mb-4">
            <h4 className="font-medium mb-2">Yanıt:</h4>
            <p>{aiResponse.text}</p>
          </div>
          
          {aiResponse.analysis.objects && (
            <div className="bg-gray-700 p-3 rounded mb-2">
              <h4 className="font-medium mb-2">🔍 Tespit Edilen Nesneler:</h4>
              <div className="flex flex-wrap gap-2">
                {aiResponse.analysis.objects.map((obj, index) => (
                  <span key={index} className="bg-blue-600 px-2 py-1 rounded text-sm">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {aiResponse.analysis.emotions && (
            <div className="bg-gray-700 p-3 rounded mb-2">
              <h4 className="font-medium mb-2">😊 Duygular:</h4>
              <div className="flex flex-wrap gap-2">
                {aiResponse.analysis.emotions.map((emotion, index) => (
                  <span key={index} className="bg-purple-600 px-2 py-1 rounded text-sm">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {aiResponse.analysis.transcription && (
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-medium mb-2">🎤 Transkripsiyon:</h4>
              <p className="italic">{aiResponse.analysis.transcription}</p>
            </div>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Multi-modal AI işleniyor...</p>
            <p className="text-sm text-gray-400 mt-2">Görsel, ses ve metin analiz ediliyor</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiModalAI;
