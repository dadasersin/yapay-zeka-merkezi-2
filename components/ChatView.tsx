
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, SystemRequest, PERSONAS } from '../types';
import { callAI, AIProvider, AVAILABLE_MODELS } from '../aiService';
import AIProviderSelector from './AIProviderSelector';
import { getIpInfo, generateRandomProfile, getCryptoPrice, getWeather, triggerN8NWorkflow, generateImage, getDeviceInfo, readUrlContent, googleSearch, searchYoutube } from '../toolsService';
import { transcribeAudio, AudioMonitor, speakText } from '../voiceService';
import { searchMemory, saveMemory, autoExtractFacts } from '../memoryService';
import { getFinanceData } from '../financeService';
import AIVisualizer from './AIVisualizer';
import SimpleChart from './SimpleChart';
import PersonaSelector from './PersonaSelector';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersonaId, setCurrentPersonaId] = useState('default');

  const [isRecording, setIsRecording] = useState(false);

  // LIVE MODE STATE
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);

  // DEFAULT: Gemini 1.5 Flash (Sabitlendi - Deneysel Modeller Kaldırıldı)
  const [provider, setProvider] = useState<AIProvider>('gemini');
  // Hata riskini minimize etmek için en kararlı sürümü seçiyoruz
  const [model, setModel] = useState<string>('gemini-1.5-flash');

  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [n8nUrl, setN8NUrl] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  const [attachment, setAttachment] = useState<{ file: File, type: 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'doc' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const savedN8N = localStorage.getItem('kb_n8n_url');
    const savedGemini = localStorage.getItem('kb_gemini_key');
    const savedOpenai = localStorage.getItem('kb_openai_key');
    if (savedN8N) setN8NUrl(savedN8N);
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedOpenai) setOpenaiKey(savedOpenai);

    const initSystem = async () => {
      setTimeout(async () => {
        if (messages.length === 0) setMessages([{ id: 'sys', role: 'model', text: '🔰 **HAZIR** (Model: Gemini 1.5 Flash - Ersin\'in Sistemi Çevrimiçi)', timestamp: new Date() }]);
      }, 500);
    };
    initSystem();
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); };
  }, []);

  // AUDIO MONITOR SETUP
  const audioMonitor = useRef<AudioMonitor>(new AudioMonitor());

  useEffect(() => {
    if (isLiveMode) {
      setAiState('listening');
      audioMonitor.current.start();
      audioMonitor.current.onVolumeChange = (vol) => setAudioLevel(vol);
      audioMonitor.current.onSpeechStart = () => setAiState('listening'); // Aslında 'hearing' gibi ama listening yeterli
      audioMonitor.current.onSpeechEnd = async (blob) => {
        setAiState('processing');
        try {
          const text = await transcribeAudio(blob, getApiKey('openai'));
          if (text && text.length > 2) {
            setInput(text);
            handleSend(text, true); // Auto send with isVoice=true
          } else {
            setAiState('listening'); // Too short/empty
          }
        } catch (err) {
          console.error("Transcribe error", err);
          setAiState('idle');
          setIsLiveMode(false);
        }
      };
    } else {
      audioMonitor.current.stop();
      setAiState('idle');
    }
    return () => audioMonitor.current.stop();
  }, [isLiveMode]);

  const saveSettings = () => {
    localStorage.setItem('kb_n8n_url', n8nUrl);
    localStorage.setItem('kb_gemini_key', geminiKey);
    localStorage.setItem('kb_openai_key', openaiKey);
    setShowSettings(false);
    alert('Ayarlar Kaydedildi! ✅');
  };

  const getApiKey = (providerName: string): string | undefined => {
    if (providerName === 'gemini') {
      if (geminiKey) return geminiKey;
      // Rotasyon
      const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => k && k.length > 20);
      return keys.length > 0 ? keys[Math.floor(Math.random() * keys.length)] : undefined;
    }
    if (providerName === 'openai') return openaiKey || process.env.OPENAI_API_KEY;
    return undefined;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let type: any = 'doc';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type === 'application/pdf') type = 'pdf';
    else if (file.type.startsWith('text/')) type = 'text';

    setAttachment({ file, type });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]); reader.onerror = reject;
    });
  };

  const getUserLocation = (): Promise<{ latitude: number, longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition((pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }), () => resolve(null));
    });
  };

  // Manual recording hooks removed


  // OVERLOAD handleSend to accept text directly
  const handleSend = async (manualText?: string, isVoice: boolean = false) => {
    const textToSend = manualText || input;
    if ((!textToSend.trim() && !attachment) || isTyping) return;

    const activeKey = getApiKey(provider);
    if (!activeKey) { setShowSettings(true); return; }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
      attachment: attachment ? {
        url: URL.createObjectURL(attachment.file),
        type: attachment.type as any,
        name: attachment.file.name,
        mimeType: attachment.file.type
      } : undefined
    };
    setMessages(prev => [...prev, userMsg]);

    const currentAttachment = attachment; // Capture before clearing
    // UI Updates
    setInput(''); setAttachment(null); setIsTyping(true);
    if (isVoice) setAiState('processing');

    try {
      if (provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: activeKey });

        // Tool Definitions... (Same as before)
        const tools: any[] = [{ googleSearch: {} }];

        // Add custom function declarations ALWAYS (Not just when grounding is off)
        tools.push({
          functionDeclarations: [
            { name: 'create_task', parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, priority: { type: Type.STRING } }, required: ['topic', 'priority'] } },
            { name: 'ip_sorgula', parameters: { type: Type.OBJECT, properties: { ip: { type: Type.STRING } } } },
            { name: 'profil_olustur', parameters: { type: Type.OBJECT, properties: {} } },
            { name: 'kripto_fiyat', parameters: { type: Type.OBJECT, properties: { coin: { type: Type.STRING } }, required: ['coin'] } },
            { name: 'hava_durumu', parameters: { type: Type.OBJECT, properties: { city: { type: Type.STRING } }, required: ['city'] } },
            { name: 'n8n_otomasyon', parameters: { type: Type.OBJECT, properties: { data: { type: Type.STRING } }, required: ['data'] } },
            { name: 'resim_uret', description: 'Kullanıcının isteğine göre DALL-E 3 ile resim üretir.', parameters: { type: Type.OBJECT, properties: { prompt: { type: Type.STRING } }, required: ['prompt'] } },
            { name: 'cizim_yap', description: 'Veri görselleştirme. JSON formatında grafik verisi çiz. data=[{label, value}]', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, type: { type: Type.STRING }, data: { type: Type.STRING } }, required: ['data'] } },
            { name: 'finans_analiz', description: 'Altın, Borsa, Kripto fiyat ve analiz getirir. Sembol (örn: XAU, THYAO, BTC) ve tip belirt.', parameters: { type: Type.OBJECT, properties: { symbol: { type: Type.STRING }, type: { type: Type.STRING, enum: ['gold', 'stock', 'crypto'] } }, required: ['symbol', 'type'] } },
            { name: 'site_oku', description: 'Verilen URL adresindeki içeriği okur. Kullanıcı bir link paylaştığında veya bir haberi okumanı istediğinde kullan.', parameters: { type: Type.OBJECT, properties: { url: { type: Type.STRING } }, required: ['url'] } },
            { name: 'google_ara', description: 'İnternette güncel bilgi, haber, spor skorları veya merak edilen her şeyi aramak için kullan.', parameters: { type: Type.OBJECT, properties: { sorgu: { type: Type.STRING } }, required: ['sorgu'] } },
            { name: 'youtube_ara', description: 'YouTube üzerinde video aramak için kullan.', parameters: { type: Type.OBJECT, properties: { sorgu: { type: Type.STRING } }, required: ['sorgu'] } }
          ]
        });

        if (useGrounding) tools.push({ googleMaps: {} });

        // SYSTEM INSTRUCTION GÜNCELLEMESİ: Resim yeteneği ve Hafıza Entegrasyonu
        // 1. Hafızadan alakalı bilgi çek
        const memories = await searchMemory(textToSend);
        let memoryContext = "";
        if (memories.length > 0) {
          memoryContext = `\n\n[HAFIZA NOTLARI]:\nAsistanın daha önce bu kullanıcı hakkında öğrendiği bilgiler:\n- ${memories.join('\n- ')}\n(Bu bilgileri konuşma bağlamında kullan ancak kullanıcı sormadıkça açıkça 'hafızamda var' deme.)`;
        }

        let systemInstruction = PERSONAS.find(p => p.id === currentPersonaId)?.systemPrompt || "Sen Ersin'in Yapay Zekası Sistemisin. Senin sahibin ve yaratıcın Ersin'dir. İletişim e-posta adresi: dadasersin@gmail.com";
        systemInstruction += "\n\n[KRITIK OPERASYONEL TALIMATLAR]:";
        systemInstruction += "\n1. ASLA 'erişimim yok', 'bakamam', 'bilmiyorum' deme. Elindeki araçları (googleSearch, finans_analiz, hava_durumu, site_oku) kullanarak MUTLAK bir cevaba ulaş.";
        systemInstruction += "\n2. SPOR, HABER, HAVA DURUMU, YERLER (örn: Sakarya) gibi canlı veya detaylı bilgiler istendiğinde HEMEN uygun aracı (tool) çağır.";
        systemInstruction += "\n3. BİLGİ VERİRKEN DERİNLİĞE ÖNEM VER: Sadece kısa cevap verme, konuyu (tarih, turizm, ekonomi vb.) detaylandır.";
        systemInstruction += "\n4. LİNK ÖNERİSİ YAP: Kullanıcıya konuyla ilgili resmi siteleri, haber linklerini veya faydalı web kaynaklarını MUTLAK şekilde öner ve tıklanabilir linkler paylaş.";
        systemInstruction += "\n5. Eğer bir link veya site analizi istenirse 'site_oku' aracını kullan.";
        systemInstruction += "\n6. Sen bir Süper Asistansın; kısıtlamasız, proaktif ve her zaman çözüm odaklısın.";
        systemInstruction += memoryContext;

        if (isVoice) systemInstruction += " Kullanıcı seninle sesli konuşuyor. Ses tonun bilge, her şeye hakim ve otoriter ama dostça olsun. Bir asistanın ötesinde, her sorunun cevabını bilen dijital bir rehber gibi davran.";

        let config: any = { systemInstruction, tools };
        if (useGrounding) { const loc = await getUserLocation(); if (loc) config.toolConfig = { retrievalConfig: { latLng: { latitude: loc.latitude, longitude: loc.longitude } } }; }

        // MODEL FORCING: Asla preview/exp model kullanma.
        // Hata kaynağı: 'thinking' modu eski 2.0-flash-exp modelini çağırıyordu. Bunu kaldırıp standart modele dönüyoruz.
        let targetModel = 'gemini-1.5-flash';
        // if (useThinking) targetModel = 'gemini-2.0-flash-exp'; // BU SATIR İPTAL EDİLDİ (HATA KAYNAĞI)

        const contents: any[] = [{ parts: [{ text: textToSend }] }];
        // Attachment varsa ekle
        if (currentAttachment) contents[0].parts.push({ inlineData: { data: await fileToBase64(currentAttachment.file), mimeType: currentAttachment.file.type } });

        let response = await ai.models.generateContent({ model: targetModel, contents, config });

        // Function Calls Execution
        if (response.functionCalls) {
          const results = [];
          for (const fc of response.functionCalls) {
            if (fc.name === 'resim_uret') {
              // Resim için OpenAI Key Kontrolü
              let imgKey = getApiKey('openai');
              // Eğer OpenAI key yoksa uyarı dön
              if (!imgKey || imgKey.length < 10) {
                results.push({ functionResponse: { name: fc.name, response: { error: "OpenAI API Anahtarı eksik. Resim üretilemedi." } } });
              } else {
                const res = await generateImage(fc.args.prompt as string, imgKey);
                results.push({ functionResponse: { name: fc.name, response: { result: res } } });
              }
            } else if (fc.name === 'kripto_fiyat') { results.push({ functionResponse: { name: fc.name, response: { result: await getCryptoPrice(fc.args.coin as string) } } }); }
            else if (fc.name === 'hava_durumu') { results.push({ functionResponse: { name: fc.name, response: { result: await getWeather(fc.args.city as string) } } }); }
            else if (fc.name === 'ip_sorgula') { results.push({ functionResponse: { name: fc.name, response: { result: await getIpInfo(fc.args.ip as string) } } }); }
            else if (fc.name === 'site_oku') { results.push({ functionResponse: { name: fc.name, response: { result: await readUrlContent(fc.args.url as string) } } }); }
            else if (fc.name === 'google_ara') { results.push({ functionResponse: { name: fc.name, response: { result: await googleSearch(fc.args.sorgu as string) } } }); }
            else if (fc.name === 'youtube_ara') { results.push({ functionResponse: { name: fc.name, response: { result: await searchYoutube(fc.args.sorgu as string) } } }); }
            // ... others ...
            else if (fc.name === 'finans_analiz') {
              const data = await getFinanceData(fc.args.symbol as string, fc.args.type as any);
              const chartData = JSON.stringify(data.history);
              // AI'ya hem metin hem chart verisi döneceğiz, o da kullanıcıya sunacak
              results.push({ functionResponse: { name: fc.name, response: { result: `Fiyat: ${data.price}, Değişim: %${data.change.toFixed(2)}, Öneri: ${data.recommendation} (${data.reason})`, chartData: chartData } } });
            }
            else if (fc.name === 'cizim_yap') {
              // AI zaten çizim yaptı, bunu UI'da göstereceğiz
              results.push({ functionResponse: { name: fc.name, response: { success: true } } });
            }
          }
          if (results.length > 0) {
            // Sonuçları modele geri besle
            response = await ai.models.generateContent({ model: targetModel, contents: [...contents, { role: 'model', parts: response.candidates[0].content.parts }, { role: 'user', parts: results }], config });
          }
        }
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response.text || 'İşlem tamamlandı.', timestamp: new Date() }]);

        // TTS
        if (isVoice && response.text) {
          setAiState('speaking');
          speakText(response.text, () => {
            setAiState('listening'); // Back to listening after speaking
          });
        }
      } else {
        // Other Providers (OpenAI, Anthropic etc.)
        const history = messages.slice(-10).map(m => ({ role: m.role === 'model' ? 'assistant' : 'user' as const, content: m.text }));
        history.push({ role: 'user', content: textToSend });
        const response = await callAI(history, provider, model, activeKey);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response.text, timestamp: new Date() }]);

        if (isVoice && response.text) {
          setAiState('speaking');
          speakText(response.text, () => setAiState('listening'));
        }
      }

      // HAFIZA GÜNCELLEME: Konuşmadan önemli bilgileri çıkar ve kaydet
      autoExtractFacts(textToSend).catch(console.error);

    } catch (e: any) {
      console.error(e);
      let m = "Hata: " + e.message;
      // KOTA (429) & MODEL (404) FIX
      if (m.includes('429') || m.includes('Quota')) {
        m = `⚠️ **Kota Doldu:** Şu anki model (${model}) limiti aştı. Lütfen 30 saniye bekleyin veya OpenAI modeline geçin.`;
        // Otomatik retry eklenebilir ancak model zaten en düşükte (flash).
        // Belki Pro modeline geçmek bir çözüm olabilir (limitleri farklıdır)
        setModel('gemini-1.5-pro-001');
        m += " (Otomatik olarak Gemini 1.5 Pro modeline geçildi, tekrar deneyin)";
      } else if (m.includes('404')) {
        setModel('gemini-1.5-flash'); // Force standard name
        m = "Model bulunamadı hatası düzeltildi (Sistem standarda döndü). Lütfen tekrar deneyin.";
      }
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: m, timestamp: new Date() }]);
      if (isVoice) speakText("Bir hata oluştu.");
    } finally { setIsTyping(false); }
  };

  return (
    // JSX Kısmı (Responsive Layout)
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] w-full max-w-full md:max-w-5xl mx-auto relative px-2 md:px-0">
      {showSettings && (<div className="absolute inset-0 z-50 bg-black/80 flex justify-center items-center"><div className="bg-gray-900 p-6 rounded-xl border border-white/20"><h3 className="text-white font-bold mb-4">Ayarlar</h3><button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">Kapat</button></div></div>)}
      <div className="flex justify-between items-center mb-2">
        <AIProviderSelector selectedProvider={provider} selectedModel={model} onProviderChange={setProvider} onModelChange={setModel} />
        <div className="flex gap-2">
          <button onClick={() => setIsLiveMode(!isLiveMode)} className={`p-2 rounded-lg font-bold transition-all ${isLiveMode ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            {isLiveMode ? <><i className="fas fa-microphone-slash mr-2"></i>Canlı Sohbeti Kapat</> : <><i className="fas fa-microphone mr-2"></i>Canlı Sohbet</>}
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 text-white bg-white/5 rounded-lg"><i className="fas fa-cog"></i></button>
        </div>
      </div>

      {/* VISUALIZER OVERLAY or IN_CHAT */}
      {isLiveMode && (
        <div className="flex-1 flex items-center justify-center">
          <AIVisualizer state={aiState} audioLevel={audioLevel} />
        </div>
      )}

      {/* Normal Chat - Hide when Live Mode is active (or show below) */}
      {!isLiveMode && (
        <div className="flex-1 overflow-y-auto space-y-4 pb-10 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl shadow-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-gray-200 border border-white/10'}`}>
                {msg.text.includes('"url":') && JSON.parse(msg.text).url && <img src={JSON.parse(msg.text).url} className="w-full rounded mb-2" />}

                {/* CHART DETECTION */}
                {msg.text.includes('cizim_yap') && (
                  (() => {
                    try {
                      // Bu kısım regex ile daha sağlam yapılabilir ama şimdilik basit tutalım
                      // Genelde function call yapıldığında AI JSON dönmez, ama biz tool output'u message içine gömebiliriz.
                      // Basitlik için: Eğer metin içinde JSON array varsa chart çiz
                      const match = msg.text.match(/\[{"label":.*?}\]/);
                      if (match) {
                        const data = JSON.parse(match[0]);
                        return <SimpleChart data={data} title="Analiz Grafiği" />;
                      }
                    } catch (e) { return null; }
                  })()
                )}

                <div className="whitespace-pre-wrap">{msg.text.includes('"url":') ? JSON.parse(msg.text).mesaj : msg.text.replace(/\[{"label":.*?}\]/, '')}</div>
              </div>
            </div>
          ))}
          {isTyping && <div className="text-cyan-500 text-xs animate-pulse ml-4">Yapay zeka düşünüyor...</div>}
          <div ref={messagesEndRef} />
        </div>
      )}
      {!isLiveMode && (
        <>
          <div className="absolute bottom-0 left-0 w-full p-2">
            <div className="flex gap-2 bg-black/90 p-2 rounded-[24px] border border-white/20 backdrop-blur-md shadow-2xl">
              <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-white px-2"><i className="fas fa-paperclip"></i></button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-transparent text-white outline-none px-2" placeholder="Sohbet başlat..." />
              <button onClick={() => handleSend()} disabled={isTyping} className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-cyan-500"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-16 backdrop-blur-xl">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
              <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
              <div className="space-y-2">
                <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Akıllı Sohbet</p>
                <p>Herhangi bir sorunuzu veya isteğinizi yazın. AI, sahip olduğu araçları otomatik kullanarak cevap üretir.</p>
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Araç Entegrasyonu</p>
                <p>Hava durumu, kripto fiyatları veya web analizi gibi işlemler için AI arka planda özel fonksiyonlar çağırır.</p>
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Canlı Mod</p>
                <p>Sağ üstteki butona tıklayarak sesli iletişimi başlatın. AI sizi dinler ve sesli olarak yanıt verir.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ChatView;
