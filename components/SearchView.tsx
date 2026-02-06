import React, { useState } from 'react';
import { googleSearch } from '../toolsService';

interface SearchResult {
    title: string;
    snippet: string;
    link: string;
}

const SearchView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        try {
            const data = await googleSearch(query);
            setResults(data);
        } catch (e) {
            console.error("Arama hatası:", e);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Google Arama Motoru</h3>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mt-2">Global Bilgi Erişim Portalı</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                    <i className="fas fa-search text-cyan-400"></i>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Canlı İndeksleme Aktif</span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Merak ettiğiniz her şeyi burada arayın..."
                        className="w-full bg-black/40 border border-white/10 rounded-[32px] px-10 py-8 text-xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium placeholder:text-gray-700 shadow-2xl"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="absolute right-4 top-4 bottom-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 text-white px-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                    >
                        {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : 'ARAMA YAP'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 border border-white/5 rounded-[40px] p-10 min-h-[400px]">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <i className="fas fa-stream text-8xl mb-6 animate-pulse text-cyan-500"></i>
                            <p className="text-xs font-black uppercase tracking-[0.5em]">Veriler Çekiliyor...</p>
                        </div>
                    ) : results ? (
                        <div className="prose prose-invert max-w-none prose-sm font-medium leading-loose text-gray-300 whitespace-pre-wrap">
                            {results}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-5">
                            <i className="fas fa-search-plus text-[12rem]"></i>
                            <p className="text-xl font-black uppercase tracking-[0.5em] mt-10">Sonuç Bulunamadı</p>
                        </div>
                    )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-4 backdrop-blur-xl">
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                        <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                        <div className="space-y-2">
                            <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Arama Terimi</p>
                            <p>Merak ettiğiniz konuyu üstteki kutucuğa yazın. Global kaynaklar anlık olarak taranır.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Canlı İndeks</p>
                            <p>Sistem, Jina Search motorunu kullanarak web'deki en güncel verileri AI dostu formatta çeker.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Derin Analiz</p>
                            <p>Sonuçlar doğrudan web'den gelir; isterseniz bu sonuçları kopyalayıp Chat modunda AI'ya analiz ettirebilirsiniz.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchView;
