import React, { useState } from 'react';

const YoutubeView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            // Jina Search API uses markdown-like output for search results
            const response = await fetch(`https://s.jina.ai/site:youtube.com ${encodeURIComponent(searchQuery)}`);
            const text = await response.text();

            // Basic parsing of Jina markdown output for youtube links
            const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g;
            const matches = [...text.matchAll(youtubeRegex)];
            const uniqueIds = Array.from(new Set(matches.map(m => m[1])));

            setVideos(uniqueIds.map(id => ({
                id,
                thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${id}`
            })));
        } catch (error) {
            console.error("YouTube search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="flex-1 w-full relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="YouTube'da ara..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold uppercase tracking-widest outline-none focus:border-red-500 transition-all placeholder:text-gray-700"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-search'}`}></i>
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-[40px] overflow-hidden relative flex items-center justify-center">
                    {selectedVideo ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="text-center p-10 opacity-20">
                            <i className="fab fa-youtube text-8xl mb-6 text-red-600"></i>
                            <h2 className="text-xl font-black uppercase tracking-widest">Video Seçilmedi</h2>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 bg-black/40 border border-white/10 rounded-[40px] p-6 flex flex-col gap-4 overflow-hidden">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">Arama Sonuçları</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                        {videos.length === 0 && !isLoading && (
                            <p className="text-[10px] text-gray-700 uppercase font-black text-center mt-20">Sonuç bulunamadı.</p>
                        )}
                        {videos.map((vid, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedVideo(vid.id)}
                                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${selectedVideo === vid.id ? 'border-red-500 bg-red-500/10' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <img src={vid.thumbnail} className="w-full aspect-video object-cover" alt="Youtube Thumbnail" />
                                <div className="p-3">
                                    <p className="text-[10px] font-black text-white uppercase truncate">YouTube Videosu</p>
                                    <p className="text-[8px] text-gray-500 uppercase mt-1 tracking-tighter">ID: {vid.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Video Arama</p>
                        <p>İzlemek istediğiniz konuyu üstteki arama çubuğuna yazın. AI, YouTube üzerinde en alakalı videoları bulur.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Önizleme</p>
                        <p>Sağ taraftaki listeden bir videoya tıkladığınızda sol paneldeki oynatıcıda otomatik olarak yüklenir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Kesintisiz İzleme</p>
                        <p>YouTube player üzerinden kalite ayarlayabilir, tam ekran yapabilir veya diğer kontrolleri kullanabilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YoutubeView;
