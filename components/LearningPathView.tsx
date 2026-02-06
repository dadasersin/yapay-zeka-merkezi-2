import React, { useState } from 'react';

const LearningPathView: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-violet-500">Learning <span className="text-white">Path</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Kişiselleştirilmiş Akıllı Eğitim Yolu</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search / Goal Input */}
                <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-6">Hedefini Belirle</h3>
                    <input
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-violet-500/50"
                        placeholder="Örn: İleri seviye Python ve Data Science..."
                    />
                    <button
                        onClick={() => { setIsGenerating(true); setTimeout(() => setIsGenerating(false), 2000); }}
                        className="w-full mt-6 bg-violet-600 hover:bg-violet-500 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-violet-600/20 transition-all"
                    >
                        {isGenerating ? 'Müfredat Oluşturuluyor...' : 'Eğitim Yolunu Çıkar'}
                    </button>

                    <div className="mt-10 space-y-4">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-2">Popüler Hedefler</p>
                        {['Full-Stack Geliştirici', 'AI Mühendisi', 'Borsa Analizi'].map(h => (
                            <button key={h} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                {h}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Path Visualization */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full"></div>
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-12">Dinamik Müfredat Haritası</h3>

                    <div className="space-y-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-violet-500 to-transparent opacity-20"></div>

                        {[
                            { step: 1, title: 'Temel Kavramlar', desc: 'Syntax, veri yapıları ve algoritma mantığına giriş.', status: 'Tamamlandı' },
                            { step: 2, title: 'İleri Seviye Uygulama', desc: 'Asenkron programlama ve API entegrasyonları.', status: 'Sırada' },
                            { step: 3, title: 'Capstone Projesi', desc: 'Gerçek dünya verileriyle otonom bir sistem inşa etme.', status: 'Kilitli' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 font-black italic border transition-all ${item.status === 'Tamamlandı' ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/40' : 'bg-black/60 border-white/10 text-gray-600'}`}>
                                    {item.step}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-black uppercase text-sm mb-1 tracking-wide">{item.title}</h4>
                                    <p className="text-gray-500 text-[11px] leading-relaxed mb-3">{item.desc}</p>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Tamamlandı' ? 'text-green-500' : 'text-gray-600'}`}>{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How to Use */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-violet-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. İsteği Tanımla</p>
                        <p>Neyi, hangi seviyede öğrenmek istediğinizi açıkça yazın. AI, mevcut bilginizi de test edebilir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Müfredat Takibi</p>
                        <p>AI sizin için internetteki en iyi kaynakları tarar ve sıralı bir öğrenme planı çıkarır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Adaptif İlerleme</p>
                        <p>Siz geliştikçe müfredat zorlaşır ve her adımda quizler ile bilginiz mühürlenir.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPathView;
