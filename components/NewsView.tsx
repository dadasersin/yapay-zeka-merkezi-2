import React, { useState, useEffect } from 'react';
import { callAI } from '../aiService';

interface NewsItem {
    title: string;
    summary: string;
    url: string;
    source: string;
    time: string;
}

const NewsView: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            // Jina Search ile teknoloji haberlerini çekiyoruz
            const response = await fetch(`https://s.jina.ai/techcrunch.com+ai+latest+news`);
            const text = await response.text();

            // AI ile bu metni haberlere bölmesini sağlıyoruz
            const aiResponse = await callAI([
                {
                    role: 'user', content: `Aşağıdaki metinden en önemli 5 AI haberini ayıkla ve JSON formatında döndür. 
        Format: [{ "title": "...", "summary": "...", "url": "...", "source": "TechCrunch", "time": "Bugün" }]
        Metin: ${text.substring(0, 10000)}`
                }
            ], 'gemini');

            const parsedNews = JSON.parse(aiResponse.text.replace(/```json|```/g, ''));
            setNews(parsedNews);
        } catch (e) {
            console.error("Haber çekme hatası:", e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Nöral Haber Merkezi</h3>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mt-2">Canlı Yapay Zeka Haber Akışı</p>
                </div>
                <button
                    onClick={fetchNews}
                    disabled={isLoading}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all"
                >
                    <i className={`fas fa-sync-alt text-cyan-500 ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-10">
                {isLoading && news.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center animate-pulse">
                        <i className="fas fa-satellite text-4xl text-cyan-500 mb-6"></i>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text">Haber Kanalları Taranıyor...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {news.map((item, i) => (
                            <div key={i} className="bg-black/40 border border-white/5 rounded-[32px] p-8 hover:border-cyan-500/30 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all">
                                    <i className="fas fa-newspaper text-8xl text-cyan-500 translate-x-10 translate-y--10 rotate-12"></i>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex gap-4 items-center mb-4">
                                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">{item.source}</span>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.time}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-white mb-4 group-hover:text-cyan-400 transition-all leading-tight">{item.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium mb-6 line-clamp-3">{item.summary}</p>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-cyan-400 transition-all border-b border-white/10 pb-1"
                                    >
                                        Kaynağa Git <i className="fas fa-external-link-alt text-[8px]"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Otomatik Takip</p>
                        <p>Sayfa açıldığında AI, dünya genelindeki en güncel teknoloji haberlerini anlık olarak tarar.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Akıllı Özet</p>
                        <p>Uzun makaleler yerine, her haberin sadece en kritik noktalarını AI tarafından özetlenmiş olarak okursunuz.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Kaynağa Erişim</p>
                        <p>"Kaynağa Git" butonuna tıklayarak haberin orijinal metnine ve detaylarına ulaşabilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsView;
