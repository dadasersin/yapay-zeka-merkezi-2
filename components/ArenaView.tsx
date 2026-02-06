import React, { useState } from 'react';
import { ChatMessage, WorkspaceView } from '../types';
import { callAI, AIProvider, AVAILABLE_MODELS } from '../aiService';

const ArenaView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<{ provider: string, model: string, text: string, time: number }[]>([]);

    const providers: AIProvider[] = ['gemini', 'openai', 'groq', 'deepseek'];

    const handleCompare = async () => {
        if (!prompt.trim() || isProcessing) return;
        setIsProcessing(true);
        setResults([]);

        const tasks = providers.map(async (p) => {
            const start = Date.now();
            try {
                // We use standard callAI. Note: Gemini calls might need handling if not via aiService normally
                // but aiService has a fallback for it or handles it via fetch if keys are there.
                const response = await callAI([{ role: 'user', content: prompt }], p);
                return {
                    provider: p,
                    model: response.model,
                    text: response.text,
                    time: (Date.now() - start) / 1000
                };
            } catch (e: any) {
                return {
                    provider: p,
                    model: 'Error',
                    text: `Hata: ${e.message}`,
                    time: (Date.now() - start) / 1000
                };
            }
        });

        const responses = await Promise.all(tasks);
        setResults(responses);
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="bg-black/40 border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                        placeholder="Modelleri kıyaslamak için bir soru sorun..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold uppercase tracking-widest outline-none focus:border-cyan-500 transition-all placeholder:text-gray-700"
                    />
                    <button
                        onClick={handleCompare}
                        disabled={isProcessing}
                        className="px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-cyan-500/20"
                    >
                        {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bolt"></i>}
                        Kıyasla
                    </button>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${Math.min(results.length, 4)} gap-6 min-h-0 overflow-y-auto custom-scrollbar pb-10`}>
                {results.length === 0 && !isProcessing && (
                    <div className="absolute inset-x-0 bottom-40 flex flex-col items-center justify-center opacity-10 pointer-events-none">
                        <i className="fas fa-layer-group text-9xl mb-10"></i>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center">AI Model Arena</h2>
                    </div>
                )}

                {isProcessing && results.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 animate-pulse">
                        <i className="fas fa-microchip text-4xl text-cyan-400 mb-4"></i>
                        <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Nöral Ağlar İşleniyor...</p>
                    </div>
                )}

                {results.map((res, i) => (
                    <div key={i} className="flex flex-col bg-black/40 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
                        <div className={`p-6 border-b border-white/5 flex items-center justify-between ${res.provider === 'gemini' ? 'bg-blue-500/10' :
                            res.provider === 'openai' ? 'bg-green-500/10' :
                                res.provider === 'deepseek' ? 'bg-purple-900/20' : 'bg-orange-500/10'
                            }`}>
                            <div>
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">{res.provider}</h3>
                                <p className="text-[9px] text-gray-500 uppercase font-bold mt-1">{res.model}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-cyan-400">{res.time.toFixed(2)}s</span>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                            <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                                {res.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-auto backdrop-blur-xl">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Soru Sorma</p>
                        <p>Kıyaslamak istediğiniz bir problemi veya soruyu üstteki kutucuğa yazın.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Model Yarışı</p>
                        <p>Gemini, OpenAI, Groq ve DeepSeek modelleri aynı anda çalışarak kendi cevaplarını üretir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Performans Takibi</p>
                        <p>Her modelin cevap süresini ve içerik kalitesini yan yana görerek en iyi sonucu seçebilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArenaView;
