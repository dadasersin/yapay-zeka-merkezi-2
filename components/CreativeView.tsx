
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MediaAsset } from '../types';

interface CreativeViewProps {
  apiKeyReady: boolean;
  onOpenKeyPicker: () => void;
}

const CreativeView: React.FC<CreativeViewProps> = ({ apiKeyReady, onOpenKeyPicker }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ratios = ['1:1', '4:3', '3:4', '16:9', '9:16'];
  const sizes = ['1K', '2K', '4K'];

  // Galeri verilerini yükle
  useEffect(() => {
    const saved = localStorage.getItem('quantum_ai_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAssets(parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) })));
        if (parsed.length > 0) setSelectedAsset({ ...parsed[0], timestamp: new Date(parsed[0].timestamp) });
      } catch (e) {
        console.error("Galeri yükleme hatası:", e);
      }
    }
  }, []);

  // Galeri verilerini kaydet
  useEffect(() => {
    localStorage.setItem('quantum_ai_gallery', JSON.stringify(assets));
  }, [assets]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBaseImage((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
    setMode('edit');
  };

  const handleAction = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    // High Quality (Pro model) için API anahtarı kontrolü
    if (quality === 'high' && !apiKeyReady) {
      onOpenKeyPicker();
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      let response;

      if (mode === 'generate') {
        // High Quality: gemini-3-pro-image-preview
        // Standard Quality: gemini-2.5-flash-image
        const modelName = quality === 'high' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
        
        const config: any = {
          imageConfig: { 
            aspectRatio: aspectRatio as any
          }
        };

        // imageSize sadece gemini-3-pro-image-preview için geçerli
        if (quality === 'high') {
          config.imageConfig.imageSize = imageSize as any;
        }

        response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: [{ text: prompt }] },
          config
        });
      } else {
        // Düzenleme: gemini-2.5-flash-image
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [
            { inlineData: { data: baseImage!, mimeType: 'image/png' } },
            { text: prompt }
          ] }
        });
      }

      let imageUrl = '';
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        const newAsset: MediaAsset = { 
          id: Date.now().toString(), 
          type: 'image', 
          url: imageUrl, 
          prompt, 
          timestamp: new Date() 
        };
        setAssets(prev => [newAsset, ...prev]);
        setSelectedAsset(newAsset);
      } else {
        setErrorMsg("Modelden görsel yanıtı alınamadı. Lütfen direktifinizi kontrol edin.");
      }
    } catch (error: any) {
      console.error("Görsel Hatası:", error);
      const msg = error.message || "";
      if (msg.includes("403") || msg.includes("permission") || msg.includes("not found")) {
        setErrorMsg("Erişim Engellendi. 'High Quality' için ücretli bir GCP projesi anahtarı gereklidir.");
        if (quality === 'high') onOpenKeyPicker();
      } else {
        setErrorMsg("Hata: " + msg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssets(prev => prev.filter(a => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Kontrol Paneli */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl h-full flex flex-col">
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <i className="fas fa-magic text-cyan-400"></i> Sentez Laboratuvarı
            </h3>

            <div className="flex gap-2 mb-6">
              <button onClick={() => setMode('generate')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'generate' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}>Üretim</button>
              <button onClick={() => setMode('edit')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'edit' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}>Düzenleme</button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {mode === 'edit' && (
                <div className="p-4 border-2 border-dashed border-white/10 rounded-3xl text-center group hover:border-cyan-500/50 transition-colors">
                  <input type="file" onChange={handleFileUpload} className="hidden" id="edit-upload" accept="image/*" />
                  <label htmlFor="edit-upload" className="cursor-pointer text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-cyan-400">
                    <i className="fas fa-upload mb-2 text-xl block"></i>
                    {baseImage ? 'Görsel Analiz Ediliyor' : 'Baz Görsel Yükle'}
                  </label>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Model Kalitesi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setQuality('standard')} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-1 ${quality === 'standard' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-600'}`}
                  >
                    <span className="text-[10px] font-black uppercase">Flash</span>
                    <span className="text-[8px] font-bold opacity-60">Hızlı & Standart</span>
                  </button>
                  <button 
                    onClick={() => setQuality('high')} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-1 ${quality === 'high' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-gray-600'}`}
                  >
                    <span className="text-[10px] font-black uppercase">Pro</span>
                    <span className="text-[8px] font-bold opacity-60">Yüksek Kalite</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Direktif (Prompt)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'generate' ? "Hayalindeki görseli betimle..." : "Görsel üzerinde yapılacak değişiklikleri yaz..."}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-gray-200 focus:border-cyan-500 transition-all min-h-[140px] resize-none outline-none placeholder:text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">En-Boy Oranı</label>
                  <div className="flex flex-wrap gap-2">
                    {ratios.map(r => (
                      <button key={r} onClick={() => setAspectRatio(r)} className={`px-3 py-2 rounded-xl text-[9px] font-black border transition-all ${aspectRatio === r ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-600'}`}>{r}</button>
                    ))}
                  </div>
                </div>
                {quality === 'high' && (
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Çözünürlük</label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(s => (
                        <button key={s} onClick={() => setImageSize(s)} className={`px-3 py-2 rounded-xl text-[9px] font-black border transition-all ${imageSize === s ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-gray-600'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-[10px] text-red-400 font-bold uppercase tracking-widest leading-relaxed animate-in slide-in-from-bottom-2">
                <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
              </div>
            )}

            <button
              onClick={handleAction}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full mt-6 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all shadow-xl ${isGenerating ? 'bg-gray-800 text-gray-600' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'}`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <i className="fas fa-atom animate-spin"></i> Sentezleniyor...
                </span>
              ) : mode === 'generate' ? "Varlığı Oluştur" : "Sürümü Güncelle"}
            </button>
          </div>
        </div>

        {/* Ana Görüntüleme ve Galeri */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Ana Görüntüleme Alanı */}
          <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 flex-1 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent)]"></div>
            
            {selectedAsset ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-700">
                <div className="relative max-h-[85%] group">
                  <img 
                    src={selectedAsset.url} 
                    className="max-h-full max-w-full object-contain rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.2)] border border-white/10" 
                    alt={selectedAsset.prompt}
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <a 
                      href={selectedAsset.url} 
                      download={`quantum-art-${selectedAsset.id}.png`}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black transition-all"
                    >
                      <i className="fas fa-download"></i>
                    </a>
                  </div>
                </div>
                <div className="bg-black/80 backdrop-blur-xl px-10 py-5 rounded-3xl border border-white/10 max-w-2xl text-center">
                  <p className="text-gray-300 text-sm font-medium leading-relaxed italic">"{selectedAsset.prompt}"</p>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-3">
                    {selectedAsset.timestamp.toLocaleDateString()} // {selectedAsset.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-20">
                <i className="fas fa-sparkles text-8xl text-cyan-400"></i>
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-[0.4em] text-lg">Quantum Sentez</p>
                  <p className="text-xs uppercase tracking-widest">Görsel çıktı burada belirecek</p>
                </div>
              </div>
            )}
          </div>

          {/* Galeri Alt Grid */}
          <div className="h-48 bg-white/5 border border-white/10 rounded-[40px] p-6 backdrop-blur-xl">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-3">
              <i className="fas fa-images"></i> Galeri Arşivi ({assets.length})
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {assets.length === 0 ? (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl opacity-30">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Arşiv Henüz Boş</span>
                </div>
              ) : (
                assets.map((asset) => (
                  <div 
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`shrink-0 w-32 h-32 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer relative group ${selectedAsset?.id === asset.id ? 'border-cyan-500 scale-105 shadow-lg shadow-cyan-500/20' : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
                  >
                    <img src={asset.url} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => deleteAsset(asset.id, e)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-red-500/80 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreativeView;
