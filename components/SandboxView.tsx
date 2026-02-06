import React, { useState, useEffect, useRef } from 'react';

interface JulesTask {
    id: string;
    topic: string;
    status: 'queued' | 'working' | 'completed' | 'failed';
    progress: number;
}

const SandboxView: React.FC = () => {
    const [julesInput, setJulesInput] = useState('');
    const [activeTasks, setActiveTasks] = useState<JulesTask[]>([]);
    const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #000; color: #00f2ff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { padding: 40px; border: 2px solid #00f2ff; border-radius: 20px; box-shadow: 0 0 20px #00f2ff; text-align: center; }
        h1 { margin: 0; font-size: 2em; text-transform: uppercase; letter-spacing: 5px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>Quantum Preview</h1>
        <p>Edit code to see direct changes.</p>
    </div>
</body>
</html>`);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (iframeRef.current) {
                const doc = iframeRef.current.contentDocument;
                if (doc) {
                    doc.open();
                    doc.write(code);
                    doc.close();
                }
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [code]);

    const handleRunTask = () => {
        if (!julesInput.trim()) return;

        const newTask: JulesTask = {
            id: Date.now().toString(),
            topic: julesInput,
            status: 'working',
            progress: 0
        };

        setActiveTasks(prev => [newTask, ...prev]);
        setJulesInput('');

        // Mock Asynchronous Processing
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setActiveTasks(prev => prev.map(t =>
                t.id === newTask.id ? { ...t, progress } : t
            ));

            if (progress >= 100) {
                clearInterval(interval);
                setActiveTasks(prev => prev.map(t =>
                    t.id === newTask.id ? { ...t, status: 'completed' } : t
                ));
            }
        }, 800);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Editor Side */}
                <div className="bg-black/40 border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-2xl backdrop-blur-md">
                    <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Quantum Editor v3.0</span>
                        </div>
                        <div className="flex gap-1.5Indicator">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 p-8 font-mono text-[11px] text-cyan-100/70 bg-transparent outline-none resize-none custom-scrollbar leading-relaxed"
                        spellCheck={false}
                    />
                </div>

                {/* Preview Side */}
                <div className="bg-black/80 border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-play text-emerald-400 text-xs text animate-pulse"></i>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Sentez Hub</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">FPS: 60.00</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-white relative">
                        <iframe
                            ref={iframeRef}
                            title="preview"
                            className="w-full h-full border-none"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            </div>

            {/* AI Agent Panel */}
            <div className="bg-gradient-to-r from-indigo-950/20 to-cyan-950/20 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl">
                <div className="flex flex-col lg:row-span-1 lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                                <i className="fas fa-layer-group text-2xl text-white"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Astra Code Architect</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Autonomous Agent // Port: 8080 Active</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-indigo-500/20 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <input
                                type="text"
                                value={julesInput}
                                onChange={(e) => setJulesInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRunTask()}
                                placeholder="Astra'ya kod yazdır veya düzenlet (Örn: 'Karakaran bir buton ekle', 'Temayı yeşil yap'...)"
                                className="relative w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-indigo-500 transition-all pr-32"
                            />
                            <button
                                onClick={handleRunTask}
                                className="absolute right-3 top-3 bottom-3 bg-indigo-500 hover:bg-indigo-400 text-black font-black uppercase px-8 rounded-xl text-[10px] transition-all shadow-xl"
                            >
                                Execute
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-96">
                        <div className="h-full bg-black/40 border border-white/5 rounded-[32px] p-6">
                            <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Görev Havuzu</h4>
                            <div className="space-y-3 h-40 overflow-y-auto custom-scrollbar pr-2">
                                {activeTasks.length === 0 ? (
                                    <div className="text-[10px] text-gray-700 italic font-bold uppercase text-center mt-10">
                                        Şu an aktif işlem yok
                                    </div>
                                ) : (
                                    activeTasks.map(task => (
                                        <div key={task.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[10px] font-black text-gray-300 truncate w-40 uppercase tracking-tighter">{task.topic}</p>
                                                <span className={`text-[8px] font-black uppercase ${task.status === 'completed' ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${task.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Kod Düzenleme</p>
                        <p>Sol taraftaki editöre HTML/CSS/JS kodlarını girin. Değişiklikler anında sağ panelde simüle edilir.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Astra Asistan</p>
                        <p>Alt paneldeki giriş alanına "Bana koyu temalı bir form yap" gibi komutlar vererek Astra'ya kod yazdırın.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Canlı Sentez</p>
                        <p>Yazdığınız kodlar güvenli bir sandbox ortamında çalıştırılır ve gerçek zamanlı önizleme sunar.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SandboxView;
