import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { ChatMessage, SystemRequest } from '../types';
import { callAI, AIProvider, AVAILABLE_MODELS } from '../aiService';
import AIProviderSelector from './AIProviderSelector';
import { useApiMode } from './ApiModeToggle';
import { callMockAI } from '../mockService';

const ChatView: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // AI Provider State
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [model, setModel] = useState<string>(AVAILABLE_MODELS.gemini[0]);

  // Gemini Specific Options
  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(true);

  const [attachment, setAttachment] = useState<{ file: File, type: 'image' | 'video' | 'audio' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio';
    setAttachment({ file, type });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const getUserLocation = (): Promise<{ latitude: number, longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null)
      );
    });
  };

  const createTaskTool: FunctionDeclaration = {
    name: 'create_task',
    parameters: {
      type: Type.OBJECT,
      description: 'Yeni bir görev veya sistem isteği oluşturur.',
      properties: {
        topic: { type: Type.STRING, description: 'Görevin başlığı veya açıklaması.' },
        priority: { type: Type.STRING, enum: ['low', 'medium', 'high'], description: 'Görevin öncelik seviyesi.' },
      },
      required: ['topic', 'priority'],
    },
  };

  const saveTaskToStorage = (topic: string, priority: 'low' | 'medium' | 'high') => {
    const saved = localStorage.getItem('quantum_tasks');
    const tasks: SystemRequest[] = saved ? JSON.parse(saved) : [];
    const newTask: SystemRequest = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      topic,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      status: 'warning',
      statusText: 'Bekliyor',
      priority
    };
    tasks.unshift(newTask);
    localStorage.setItem('quantum_tasks', JSON.stringify(tasks));
    window.dispatchEvent(new Event('tasksUpdated'));
    return newTask;
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
      attachment: attachment ? {
        url: URL.createObjectURL(attachment.file),
        type: attachment.type,
        mimeType: attachment.file.type
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentAttachment = attachment;
    setInput('');
    setAttachment(null);
    setIsTyping(true);

    try {
      // === GEMINI HANDLER ===
      if (provider === 'gemini') {
        if (isApiMode && import.meta.env.VITE_GEMINI_API_KEY) {
          // API Modu - Gerçek AI
          const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

          let tools: any[] = [{ googleSearch: {} }];

          if (useGrounding) {
            tools.push({ googleMaps: {} });
          } else {
            tools.push({ functionDeclarations: [createTaskTool] });
          }

          let config: any = {
            systemInstruction: "Sen 'Quantum AI Yapay Zeka Merkezi' Master Kontrol Ünitesisin. Kullanıcının görev veya yapılacaklar listesi isteklerini 'create_task' aracını kullanarak yönet. Ayrıca Google Search ve Maps araçlarını aktif kullanarak en güncel bilgileri sağla.",
            tools
          };

          if (useGrounding) {
            const location = await getUserLocation();
            if (location) {
              config.toolConfig = {
                retrievalConfig: { latLng: { latitude: location.latitude, longitude: location.longitude } }
              };
            }
          } else if (useThinking) {
            config.thinkingConfig = { thinkingBudget: 16000 };
          }

          const contents: any[] = [{ parts: [{ text: currentInput || "İçeriği analiz et." }] }];
          if (currentAttachment) {
            const b64Data = await fileToBase64(currentAttachment.file);
            contents[0].parts.push({
              inlineData: { data: b64Data, mimeType: currentAttachment.file.type }
            });
          }

          // Use selected model from state, default to gemini-3-pro-preview logic if needed
          let targetModel = model;
          if (useThinking && targetModel.includes('flash')) targetModel = 'gemini-3-pro-preview';

          let response = await ai.models.generateContent({
            model: targetModel,
            contents,
            config
          });

        const grounding: Array<{ uri: string; title: string }> = [];
        const candidate = response.candidates?.[0];
        const chunks = candidate?.groundingMetadata?.groundingChunks;

        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.web) grounding.push({ uri: chunk.web.uri, title: chunk.web.title });
            if (chunk.maps) grounding.push({ uri: chunk.maps.uri, title: chunk.maps.title || "Harita Konumu" });
          });
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text || 'İşlem tamamlandı.',
          timestamp: new Date(),
          groundingUrls: grounding.length > 0 ? Array.from(new Set(grounding.map(g => JSON.stringify(g)))).map(s => JSON.parse(s)) : undefined
        };

        setMessages(prev => [...prev, aiMsg]);

      } else {
        // === OTHER PROVIDERS (OpenAI, Anthropic, Groq) HANDLER ===

        // Convert existing chat history context
        // Limit context to last 10 messages to save tokens and avoid errors
        const history = messages.slice(-10).map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user' as const,
          content: m.text
        }));

        history.push({ role: 'user', content: currentInput });

        // Add system message
        history.unshift({
          role: 'system',
          content: "Sen 'Quantum AI Yapay Zeka Merkezi' Master Kontrol Ünitesisin. Yardımcı, zeki ve profesyonel bir asistansın."
        });

        const response = await callAI(history, provider, model);

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'model',
        text: "Sistem Hatası: " + (error.message || "Bağlantı koptu."),
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto">

      {/* Provider & Helper Settings Controls */}
      <div className="mb-4">
        <AIProviderSelector
          selectedProvider={provider}
          selectedModel={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
        />

        {provider === 'gemini' && (
          <div className="flex gap-4 mt-4 justify-center animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setUseThinking(!useThinking);
                if (!useThinking) setUseGrounding(false);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${useThinking ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
            >
              <i className="fas fa-brain mr-2"></i> Derin Düşünme {useThinking ? 'Açık' : 'Kapalı'}
            </button>
            <button
              onClick={() => {
                setUseGrounding(!useGrounding);
                if (!useGrounding) setUseThinking(false);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${useGrounding ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
            >
              <i className="fas fa-globe mr-2"></i> Harita & Grounding {useGrounding ? 'Aktif' : 'Pasif'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-10 pr-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
            <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center mb-6 animate-spin-slow ${provider === 'gemini' ? 'border-cyan-500 text-cyan-500' :
                provider === 'openai' ? 'border-green-500 text-green-500' :
                  provider === 'anthropic' ? 'border-purple-500 text-purple-500' : 'border-orange-500 text-orange-500'
              }`}>
              <i className="fas fa-terminal text-3xl"></i>
            </div>
            <p className="font-black uppercase tracking-[0.3em] text-sm text-center">
              System Online: {provider.toUpperCase()}<br />
              Master Kontrol Hazır.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-[32px] px-8 py-6 shadow-2xl transition-all duration-300 ${msg.role === 'user'
                ? 'bg-cyan-600 border border-white/20 text-white rounded-tr-none'
                : 'bg-white/5 backdrop-blur-md border border-white/10 text-gray-100 rounded-tl-none'
              }`}>
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-[0.2em]">
                <span>{msg.role === 'user' ? 'Operatör' : `Node: ${provider.toUpperCase()}`}</span>
                <span>//</span>
                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {msg.attachment && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 bg-black/40 max-w-sm shadow-xl">
                  {msg.attachment.type === 'image' && <img src={msg.attachment.url} className="w-full h-auto" />}
                  {msg.attachment.type === 'video' && <video src={msg.attachment.url} controls className="w-full" />}
                  {msg.attachment.type === 'audio' && <audio src={msg.attachment.url} controls className="w-full" />}
                </div>
              )}

              <p className="whitespace-pre-wrap leading-relaxed text-[16px] selection:bg-cyan-500/30 font-medium">{msg.text}</p>

              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-link"></i> Kaynak Referansları:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all flex items-center gap-2 max-w-[200px]"
                      >
                        <i className={`fas ${url.uri.includes('maps') ? 'fa-map-marker-alt' : 'fa-globe'} text-[8px]`}></i>
                        <span className="truncate">{url.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-[32px] rounded-tl-none px-8 py-6 flex items-center gap-3">
              <div className={`flex gap-1 ${provider === 'gemini' ? 'text-cyan-500' :
                  provider === 'openai' ? 'text-green-500' :
                    provider === 'anthropic' ? 'text-purple-500' : 'text-orange-500'
                }`}>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${provider === 'gemini' ? 'text-cyan-500/60' :
                  provider === 'openai' ? 'text-green-500/60' :
                    provider === 'anthropic' ? 'text-purple-500/60' : 'text-orange-500/60'
                }`}>
                {provider} işliyor...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 relative group">
        {attachment && (
          <div className="absolute -top-16 left-0 right-0 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2 backdrop-blur-md">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest px-4 truncate flex items-center gap-2">
              <i className={`fas ${attachment.type === 'image' ? 'fa-image' : attachment.type === 'video' ? 'fa-video' : 'fa-microphone'}`}></i>
              {attachment.file.name}
            </span>
            <button
              onClick={() => {
                setAttachment(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        <div className={`relative flex items-center gap-3 bg-black border border-white/10 rounded-[32px] p-3 shadow-2xl transition-all focus-within:border-${provider === 'gemini' ? 'cyan' : provider === 'openai' ? 'green' : provider === 'anthropic' ? 'purple' : 'orange'
          }-500/50`}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all"
            title="Dosya Ekle"
          >
            <i className="fas fa-paperclip text-lg"></i>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`${provider.toUpperCase()} sistemine komut girin...`}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-2 py-4 font-bold tracking-widest uppercase text-sm placeholder:text-gray-800"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || (!input.trim() && !attachment)}
            className={`px-10 py-4 text-black font-black uppercase tracking-tighter rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-lg disabled:bg-gray-900 disabled:text-gray-700 ${provider === 'gemini' ? 'bg-cyan-500 hover:bg-cyan-400' :
                provider === 'openai' ? 'bg-green-500 hover:bg-green-400' :
                  provider === 'anthropic' ? 'bg-purple-500 hover:bg-purple-400' :
                    'bg-orange-500 hover:bg-orange-400'
              }`}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
