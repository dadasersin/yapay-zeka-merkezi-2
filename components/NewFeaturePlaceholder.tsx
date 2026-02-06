import React from 'react';

const NewFeaturePlaceholder: React.FC<{ name: string, icon: string, color: string, description: string }> = ({ name, icon, color, description }) => {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-gray-900 to-black border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-${color.split('-')[1]}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <i className={`${icon} text-3xl ${color} relative z-10`}></i>
            </div>

            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
                {name} <span className="text-cyan-400">Laboratuvarı</span>
            </h1>

            <p className="text-gray-400 font-medium text-lg max-w-2xl mb-12 leading-relaxed">
                {description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-white/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="fas fa-layer-group text-cyan-400"></i>
                    </div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-3">Mimari Yapı</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Sinir ağları ve hibrit modelleme ile optimize edilmiş otonom çalışma katmanı.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-white/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="fas fa-bolt text-indigo-400"></i>
                    </div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-3">Canlı İşleme</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Düşük gecikmeli veri akışı ve anlık asenkron yanıt mekanizması.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-white/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="fas fa-microchip text-rose-400"></i>
                    </div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-3">Çekirdek Entegrasyon</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed">Ersin'in Yapay Zekası çekirdek algoritmaları ile tam senkronize operasyon.</p>
                </div>
            </div>

            <div className="mt-12 p-8 border border-white/5 rounded-[2.5rem] bg-gradient-to-r from-gray-900/40 to-black/40 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                        <i className="fas fa-tools text-gray-400"></i>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-wide">Üretim Aşamasında</h4>
                        <p className="text-gray-500 text-xs">Bu ileri seviye modül şu an optimize ediliyor.</p>
                    </div>
                </div>
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:bg-white/10 transition-all">
                    Tahmini Tamamlanma: %85
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-12 backdrop-blur-xl">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Kurulum</p>
                        <p>İlgili modülü Sidebar üzerinden seçtiğinizde gerekli asistanlar otomatik olarak yüklenir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Etkileşim</p>
                        <p>Kullanıcı dostu arayüz ve sesli komut sistemi ile karmaşık işlemler saniyeler içinde tamamlanır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Çıktı Yönetimi</p>
                        <p>Üretilen sonuçlar doğrudan Nöral Hafıza Arşivine kaydedilir ve her an erişilebilir durumdadır.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFeaturePlaceholder;
