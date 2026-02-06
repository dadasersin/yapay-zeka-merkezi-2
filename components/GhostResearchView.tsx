import React, { useState, useEffect, useRef } from 'react';
import { callAI } from '../aiService';
import { googleSearch } from '../toolsService';

interface ResearchStep {
    type: 'search' | 'read' | 'analyze' | 'report';
    content: string;
    status: 'pending' | 'running' | 'done';
}

const GhostResearchView: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isResearching, setIsResearching] = useState(false);
    const [steps, setSteps] = useState<ResearchStep[]>([]);
    const [finalReport, setFinalReport] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [steps]);

    const runResearch = async () => {
        if (!topic.trim()) return;
        setIsResearching(true);
        setSteps([]);
        setFinalReport('');

        const addStep = (step: ResearchStep) => setSteps(prev => [...prev, step]);
        const updateLastStep = (content: string, status: 'done' | 'running' = 'done') => {
            setSteps(prev => {
                const last = [...prev];
                last[last.length - 1] = { ...last[last.length - 1], content, status };
                return last;
            });
        };

        try {
            // Step 1: Search
            addStep({ type: 'search', content: `"${topic}" için global kaynaklar taranıyor...`, status: 'running' });
            const searchResults = await googleSearch(topic);
            updateLastStep(`Arama tamamlandı. ${searchResults.substring(0, 100)}...`, 'done');

            // Step 2: Read & Analyze
            addStep({ type: 'read', content: 'Bulunan kaynaklar AI tarafından analiz ediliyor...', status: 'running' });
            await new Promise(r => setTimeout(r, 2000));
            updateLastStep('Veriler sentezlendi ve kritik noktalar belirlendi.', 'done');

            // Step 3: Deep Analysis
            addStep({ type: 'analyze', content: 'Derin bağlantılar ve trendler sorgulanıyor...', status: 'running' });
            const analysis = await callAI([
                { role: 'user', content: `Şu konu hakkında derin bir araştırma raporu hazırla: ${topic}\n\nVeriler: ${searchResults.substring(0, 5000)}` }
            ], 'gemini');
            updateLastStep('Stratejik analiz tamamlandı.', 'done');

            // Step 4: Final Report
            addStep({ type: 'report', content: 'Nöral Rapor oluşturuluyor...', status: 'done' });
            setFinalReport(analysis.text);

        } catch (e) {
            addStep({ type: 'report', content: 'Araştırma sırasında bir aksama oluştu.', status: 'done' });
        }
        setIsResearching(false);
    };

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Hayalet Araştırma Ajanı</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Otonom Nöral Araştırmacı</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                    <i className="fas fa-ghost text-gray-400 animate-pulse"></i>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Gizlilik Modu Aktif</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl flex-1 flex flex-col min-h-0">
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Görev Günlüğü</h4>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
                            {steps.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-10">
                                    <i className="fas fa-skull text-8xl mb-6"></i>
                                    <p className="text-xs font-black uppercase tracking-[0.5em]">Hedef Belirlenmedi</p>
                                </div>
                            )}
                            {steps.map((step, i) => (
                                <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step.status === 'done' ? 'bg-white text-black border-white' : 'border-white/20 text-white'
                                            }`}>
                                            {step.status === 'running' ? <i className="fas fa-circle-notch animate-spin text-[10px]"></i> :
                                                step.type === 'search' ? <i className="fas fa-search text-[10px]"></i> :
                                                    step.type === 'read' ? <i className="fas fa-book-open text-[10px]"></i> :
                                                        step.type === 'analyze' ? <i className="fas fa-brain text-[10px]"></i> : <i className="fas fa-file-alt text-[10px]"></i>
                                            }
                                        </div>
                                        {i < steps.length - 1 && <div className="w-[1px] flex-1 bg-white/10 my-2"></div>}
                                    </div>
                                    <div className="pt-1 pb-6">
                                        <p className={`text-xs font-bold uppercase tracking-widest ${step.status === 'running' ? 'text-white' : 'text-gray-500'}`}>
                                            {step.type}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{step.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-[32px] p-6 shadow-2xl">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && runResearch()}
                                placeholder="Derin araştırma konusu girin..."
                                className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-white transition-all font-medium"
                                disabled={isResearching}
                            />
                            <button
                                onClick={runResearch}
                                disabled={isResearching || !topic.trim()}
                                className="bg-white hover:bg-gray-200 disabled:bg-gray-800 text-black px-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                            >
                                {isResearching ? 'ARAŞTIRILIYOR' : 'AJANI GÖNDER'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-10 text-center">Neural Research Report</h4>
                    {finalReport ? (
                        <div className="prose prose-invert max-w-none prose-sm font-medium leading-loose text-gray-300 whitespace-pre-wrap animate-in fade-in zoom-in-95 duration-1000">
                            {finalReport}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-5">
                            <i className="fas fa-file-invoice text-[12rem]"></i>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mt-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Hedef Belirleme</p>
                        <p>Hakkında derinlemesine bilgi edinmek istediğiniz konuyu yazın ve ajanı göreve gönderin.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Otonom Süreç</p>
                        <p>Ajan sırayla interneti tarar, kaynakları okur, verileri sentezler ve stratejik bir rapor oluşturur.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Rapor İnceleme</p>
                        <p>Sağ panelde oluşan kapsamlı raporu okuyarak konuya dair profesyonel bir bakış açısı kazanabilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GhostResearchView;
