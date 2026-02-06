import React, { useState } from 'react';

const SocialAutoView: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('Instagram');

    return (
        <div className="flex flex-col gap-8 animate-in slide-in-from-right duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Social <span className="text-sky-500">Auto</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Otonom Sosyal Medya İçerik Fabrikası</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Platform Selection */}
                <div className="lg:col-span-1 space-y-4">
                    {['Instagram', 'LinkedIn', 'Twitter (X)', 'YouTube Shorts'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${platform === p ? 'bg-sky-600/10 border-sky-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                        >
                            <span className="font-black uppercase tracking-widest text-[10px]">{p}</span>
                            <i className={`fab fa-${p.toLowerCase().split(' ')[0]} text-lg`}></i>
                        </button>
                    ))}
                </div>

                {/* Content Generator */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative group">
                    <div className="absolute -top-4 -right-4 bg-sky-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl italic">AI Engine v5</div>
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-8">İçerik Stratejisi</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 block ml-2">İçerik Konusu / Anahtar Kelime</label>
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-sky-500/30"
                                placeholder="Örn: Yapay zeka ile verimlilik artırma..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center hover:bg-white/10 transition-all">
                                <i className="fas fa-magic text-sky-400 mb-3 text-xl"></i>
                                <p className="text-white font-bold text-xs">Caption Yaz</p>
                                <p className="text-gray-500 text-[9px] mt-1 uppercase tracking-widest">Alt Başlık & Hashtag</p>
                            </button>
                            <button className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center hover:bg-white/10 transition-all">
                                <i className="fas fa-palette text-pink-400 mb-3 text-xl"></i>
                                <p className="text-white font-bold text-xs">Görsel Üret</p>
                                <p className="text-gray-500 text-[9px] mt-1 uppercase tracking-widest">AI İmaj Sentezi</p>
                            </button>
                        </div>

                        <button className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] text-white shadow-2xl shadow-sky-600/20 hover:scale-[1.01] active:scale-95 transition-all">
                            Kampanyayı Planla & Yayınla
                        </button>
                    </div>
                </div>

                {/* Preview / Stats */}
                <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[3rem] p-8 backdrop-blur-xl">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Canlı Önizleme</h4>
                    <div className="aspect-[9/16] bg-black/40 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                        <i className="fas fa-play-circle text-4xl text-white/10 scale-150"></i>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="h-1 w-[80%] bg-sky-500 rounded-full mb-2"></div>
                            <div className="h-1 w-[40%] bg-white/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-sky-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Platform Seçimi</p>
                        <p>Hedef kitlenize uygun mecrayı seçin. Her platform için AI farklı bir ton ve algoritma kullanır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Yaratıcı Süreç</p>
                        <p>Sadece bir kelime verin; AI size viral olabilecek başlıklar, açıklama metinleri ve görseller hazırlar.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Zamanlama</p>
                        <p>Hemen paylaşın veya AI'nın etkileşim oranlarına göre belirlediği en doğru saatte otonom olarak yayınlayın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialAutoView;
