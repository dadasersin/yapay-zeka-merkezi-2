import React, { useState } from 'react';

const ImageStudioView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('Photorealistic');

    const styles = ['Photorealistic', 'Cyberpunk', 'Digital Art', 'Anime', 'Oil Painting'];

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">AI Image <span className="text-pink-500">Studio</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">İleri Seviye Görsel Üretim & Editör</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                    {styles.map(style => (
                        <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedStyle === style ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Prompt (Komut)</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Hayalindeki görseli buraya detaylıca yaz..."
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50 transition-all resize-none"
                        />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Boyut</span>
                                <select className="bg-transparent text-white text-xs outline-none w-full">
                                    <option>1024x1024</option>
                                    <option>16:9 Landscape</option>
                                    <option>9:16 Portrait</option>
                                </select>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Adımlar</span>
                                <input type="range" className="w-full accent-pink-500" />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`w-full mt-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isGenerating ? 'bg-pink-600/50 text-white cursor-wait' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-xl shadow-pink-600/20 hover:scale-[1.02]'}`}
                        >
                            {isGenerating ? (
                                <><i className="fas fa-circle-notch animate-spin"></i> Üretiliyor...</>
                            ) : (
                                <><i className="fas fa-wand-magic-sparkles"></i> Görseli Oluştur</>
                            )}
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Gelişmiş Araçlar</h4>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-bold transition-all">
                                <span>In-Painting (Bölgesel Düzenle)</span>
                                <i className="fas fa-paint-brush text-pink-400"></i>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-bold transition-all">
                                <span>Upscaling (Çözünürlük Artır)</span>
                                <i className="fas fa-expand-arrows-alt text-cyan-400"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="lg:col-span-2 relative group uppercase italic">
                    <div className="aspect-square w-full bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden relative shadow-2xl">
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-4 animate-bounce">
                                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <i className="fas fa-atom text-4xl text-pink-500 animate-spin"></i>
                                </div>
                                <span className="text-white font-black tracking-widest text-sm">Katmanlar Sentezleniyor...</span>
                            </div>
                        ) : (
                            <div className="text-center p-12">
                                <i className="fas fa-image text-8xl text-white/5 mb-6"></i>
                                <p className="text-gray-500 font-bold max-w-xs">Henüz bir görsel üretilmedi. Sol taraftaki panelden bir tanım yaparak başlayın.</p>
                            </div>
                        )}
                        {/* Status Tags */}
                        <div className="absolute top-8 left-8 flex gap-2">
                            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-pink-400 uppercase">GPU: Active</span>
                            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-cyan-400 uppercase">v3.5 Engine</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-pink-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Tanımlama</p>
                        <p>İstediğiniz görseli detaylı bir prompt ile açıklayın. Stil seçimi sonucun estetiğini belirler.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Üretim Süreci</p>
                        <p>AI modelimiz (DALL-E 3 / Flux) tanımınızı analiz ederek pikselleri katman katman oluşturur.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. İyileştirme</p>
                        <p>Üretilen görselleri "Upscaling" ile netleştirebilir veya "In-painting" ile istediğiniz bölgesini değiştirebilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageStudioView;
