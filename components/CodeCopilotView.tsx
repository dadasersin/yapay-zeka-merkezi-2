import React, { useState } from 'react';

const CodeCopilotView: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<null | any>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setAnalysisResult({
                qualityScore: 84,
                issues: ['Bellek sızıntısı riski (line 142)', 'Eski tip döngü kullanımı', 'Yetersiz tip tanımı'],
                suggestions: ['React.memo kullanın', 'Tailwind sınıflarını optimize edin']
            });
            setIsAnalyzing(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-8 animate-in zoom-in duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Code <span className="text-emerald-500">Copilot</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Repo Analizi & Geliştirici Asistanı</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">GitHub / Local Path</label>
                        <input
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                            placeholder="https://github.com/ersin/proje..."
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`w-full mt-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isAnalyzing ? 'bg-emerald-600/50 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'}`}
                        >
                            {isAnalyzing ? 'Analiz Ediliyor...' : 'Repo Analizini Başlat'}
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl font-mono text-[10px]">
                        <h4 className="text-emerald-500 mb-4 font-bold tracking-widest uppercase">Geliştirici Konsolu</h4>
                        <div className="space-y-1 text-gray-500">
                            <p>{'>'} Repository scanning initialized...</p>
                            <p>{'>'} Language: TypeScript detected</p>
                            <p>{'>'} Complexity check: Pass</p>
                            <p className="animate-pulse">{'>'} Waiting for command...</p>
                        </div>
                    </div>
                </div>

                {/* Main Content / Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    {analysisResult ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
                                <h3 className="text-white font-black uppercase italic text-xl mb-6">Kalite Skoru</h3>
                                <div className="text-6xl font-black text-emerald-500 italic mb-4">{analysisResult.qualityScore}</div>
                                <div className="h-2 w-full bg-white/5 rounded-full">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysisResult.qualityScore}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
                                <h3 className="text-white font-black uppercase italic text-xl mb-6">Tespit Edilenler</h3>
                                <ul className="space-y-3">
                                    {analysisResult.issues.map((issue: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                                            <i className="fas fa-exclamation-triangle text-amber-500"></i>
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                            <i className={`fas ${isAnalyzing ? 'fa-dna fa-spin' : 'fa-laptop-code'} text-7xl text-white/5 mb-6`}></i>
                            <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">Analiz Sonuçları Burada Görünecek</h3>
                            <p className="text-gray-600 text-xs mt-2 max-w-xs">Yapay zeka projenizi satır satır inceler ve performans açıklarını bulur.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* How to Use */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Kaynak Erişimi</p>
                        <p>GitHub reposu linkini veya yerel proje yolunu verin. AI, dosya ağacını otomatik oluşturur.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Derin Analiz</p>
                        <p>Kod kalitesi, güvenlik açıkları ve mimari hatalar için binlerce kural seti üzerinden tarama yapılır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Optimizasyon</p>
                        <p>Copilot, sadece hataları bulmaz; düzeltilmiş kod parçacıklarını (Snippet) size sunar ve projenize entegre eder.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeCopilotView;
