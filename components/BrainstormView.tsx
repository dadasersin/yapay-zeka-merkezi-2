import React, { useState, useEffect, useRef } from 'react';
import { callAI, AIProvider } from '../aiService';

interface Message {
    agent: string;
    text: string;
    color: string;
}

const BrainstormView: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isStorming, setIsStorming] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const agents = [
        { name: 'X-Architect', provider: 'openai' as AIProvider, model: 'gpt-4o', color: 'text-blue-400' },
        { name: 'Deep-Engineer', provider: 'deepseek' as AIProvider, model: 'deepseek-chat', color: 'text-indigo-400' },
        { name: 'Llama-Analyst', provider: 'groq' as AIProvider, model: 'llama-3.3-70b-versatile', color: 'text-emerald-400' }
    ];

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startBrainstorm = async () => {
        if (!topic.trim()) return;
        setIsStorming(true);
        setMessages([{ agent: 'System', text: `"${topic}" konusu üzerine beyin fırtınası başlatılıyor...`, color: 'text-gray-500' }]);

        let context = `Konu: ${topic}\n\nLütfen bu konuyu kendi uzmanlık alanınıza göre değerlendirin ve diğer ajanların fikirlerini geliştirin.`;

        for (let round = 1; round <= 2; round++) {
            for (const agent of agents) {
                try {
                    const response = await callAI(
                        [{ role: 'user', content: `${context}\n\n${agent.name} olarak senin sıran. Kısa ve vurucu bir değerlendirme yap.` }],
                        agent.provider,
                        agent.model
                    );

                    const text = response.text;
                    const newMsg = { agent: agent.name, text: text, color: agent.color };
                    setMessages(prev => [...prev, newMsg]);
                    context += `\n\n${agent.name}: ${text}`;

                    // Yapay bir gecikme ekle (okuma hissi için)
                    await new Promise(r => setTimeout(r, 2000));
                } catch (e) {
                    setMessages(prev => [...prev, { agent: agent.name, text: 'Hata: Bağlantı kurulamadı.', color: 'text-red-500' }]);
                }
            }
        }

        setIsStorming(false);
        setMessages(prev => [...prev, { agent: 'System', text: 'Beyin fırtınası sona erdi. Strateji hazır.', color: 'text-emerald-500 font-bold' }]);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Çoklu Ajan Beyin Fırtınası</h3>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Sentezleme & Tartışma Modu</p>
                    </div>
                    <div className="flex gap-2">
                        {agents.map(a => (
                            <div key={a.name} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <div className={`w-1.5 h-1.5 rounded-full ${a.color.replace('text-', 'bg-')}`}></div>
                                <span className="text-[8px] font-black text-white uppercase">{a.name.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <i className="fas fa-users-cog text-8xl mb-6 text-indigo-500"></i>
                            <p className="text-sm font-black uppercase tracking-[0.3em]">Ajanlar Emrinizi Bekliyor</p>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`p-6 rounded-3xl border border-white/5 bg-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.agent}</span>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">{m.text}</p>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/40 to-black border border-white/10 rounded-[32px] p-6 shadow-2xl">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isStorming && startBrainstorm()}
                        placeholder="Bir fikir veya problem girin (Örn: 'Sürdürülebilir enerji için yeni bir AI startup'ı...')"
                        className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-indigo-500 transition-all font-medium"
                        disabled={isStorming}
                    />
                    <button
                        onClick={startBrainstorm}
                        disabled={isStorming || !topic.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white px-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/20"
                    >
                        {isStorming ? <i className="fas fa-sync animate-spin"></i> : <i className="fas fa-bolt"></i>}
                        {isStorming ? 'Sentezleniyor...' : 'Fırtınayı Başlat'}
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Konu Belirleme</p>
                        <p>Tartışılmasını istediğiniz bir fikir, sorun veya proje başlığını girin.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Ajan Etkileşimi</p>
                        <p>Farklı AI modelleri (GPT-4o, DeepSeek, Llama) sırayla söz alarak birbirlerinin fikirlerini geliştirir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Sentez & Karar</p>
                        <p>Tartışma sonunda ortaya çıkan ortak akıl, projeniz için stratejik bir yol haritası sunar.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrainstormView;
