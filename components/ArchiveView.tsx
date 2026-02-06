import React, { useEffect, useState } from 'react';
import { getAllMemories, Memory, clearMemory } from '../memoryService';

const ArchiveView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'media' | 'memory'>('memory');
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'memory') {
            loadMemories();
        }
    }, [activeTab]);

    const loadMemories = async () => {
        setIsLoading(true);
        try {
            const data = await getAllMemories();
            setMemories(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (e) {
            console.error("Memory load error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = async () => {
        if (confirm("Tüm hafızayı silmek istediğinize emin misiniz?")) {
            await clearMemory();
            loadMemories();
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Sistem Arşivi</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                        {activeTab === 'media' ? 'Sistem tarafından üretilen tüm varlıklar' : 'AI tarafından öğrenilen tüm bilgiler (Hafıza)'}
                    </p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('memory')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'memory' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        Nöral Hafıza
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'media' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        Medya Assets
                    </button>
                </div>
            </div>

            {activeTab === 'memory' ? (
                <div className="flex-1 flex flex-col min-h-0 bg-black/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-cyan-500 pb-2">Öğrenilen Gerçekler</h3>
                        <button onClick={handleClear} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Tümünü Unut</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                        {isLoading && <div className="text-center py-10 animate-pulse text-cyan-500">Hafıza taranıyor...</div>}
                        {!isLoading && memories.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                <i className="fas fa-brain text-6xl mb-4"></i>
                                <p className="text-xs font-black uppercase tracking-widest">Hafıza şu an boş.</p>
                            </div>
                        )}
                        {memories.map((mem, i) => (
                            <div key={i} className="group p-5 bg-white/5 border border-white/5 rounded-[24px] hover:border-cyan-500/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {mem.tags.map((tag, j) => (
                                            <span key={j} className="text-[8px] font-black text-cyan-400/60 uppercase bg-cyan-900/20 px-2 py-0.5 rounded">#{tag}</span>
                                        ))}
                                    </div>
                                    <span className="text-[8px] font-mono text-gray-600 italic">{new Date(mem.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-200 leading-relaxed font-medium">{mem.content}</p>
                                <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Önem: {mem.importance}/10</span>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Kaynak: {mem.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-[32px] group relative overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all bg-black/40">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-all z-10">
                                <i className="fas fa-eye text-white text-xl"></i>
                            </div>
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${i % 3 === 0 ? 'bg-cyan-500/10' : i % 3 === 1 ? 'bg-purple-500/10' : 'bg-green-500/10'}`}>
                                    <i className={`fas ${i % 3 === 0 ? 'fa-image text-cyan-500' : i % 3 === 1 ? 'fa-video text-purple-500' : 'fa-file-alt text-green-500'} text-2xl`}></i>
                                </div>
                                <p className="text-[10px] text-white font-black uppercase tracking-tighter">Asset #{i}04_{i}</p>
                                <p className="text-[8px] text-gray-600 uppercase font-bold mt-1">Generated by AI Engine</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Nöral Hafıza</p>
                        <p>AI'nın sizin hakkınızda öğrendiği ve gelecekteki sohbetlerde kullanacağı tüm bilgileri buradan görebilirsiniz.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Medya Arşivi</p>
                        <p>AI tarafından üretilen resim, video ve dokümanlar "Medya Assets" sekmesinde kategorize edilir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Veri Kontrolü</p>
                        <p>Hafızayı tamamen sıfırlamak veya belirli öğeleri incelemek için üstteki butonları kullanın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchiveView;
