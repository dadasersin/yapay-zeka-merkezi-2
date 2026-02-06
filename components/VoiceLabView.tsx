import React, { useState, useEffect, useRef } from 'react';

const VoiceLabView: React.FC = () => {
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const loadVoices = () => {
            const v = window.speechSynthesis.getVoices();
            setVoices(v);
            if (v.length > 0) setSelectedVoice(v[0].name);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        if (!isSpeaking) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const bars = 50;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6366f1';

            for (let i = 0; i < bars; i++) {
                const h = Math.random() * canvas.height * 0.8;
                const x = (canvas.width / bars) * i;
                const y = (canvas.height - h) / 2;
                ctx.beginPath();
                ctx.roundRect(x, y, 4, h, 2);
                ctx.fill();
            }
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationId);
    }, [isSpeaking]);

    const handleSpeak = () => {
        if (!text.trim()) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.pitch = pitch;
        utterance.rate = rate;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Yapay Zeka Ses Laboratuvarı</h3>
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-2">Nöral Ses Sentezleme Merkezi</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ElevenLabs Hazır</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl relative overflow-hidden">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Konuşulacak metni buraya yazın..."
                            className="w-full h-full bg-transparent border-none outline-none text-white text-lg font-medium resize-none placeholder:text-gray-700"
                        />
                        <div className="absolute bottom-10 left-0 w-full h-32 pointer-events-none px-8">
                            <canvas ref={canvasRef} width={800} height={128} className="w-full h-full opacity-40" />
                        </div>
                    </div>

                    <button
                        onClick={handleSpeak}
                        disabled={isSpeaking || !text.trim()}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 rounded-3xl text-white font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-4"
                    >
                        {isSpeaking ? <i className="fas fa-wave-square animate-pulse"></i> : <i className="fas fa-play"></i>}
                        {isSpeaking ? 'SESLENDİRİLİYOR...' : 'ŞİMDİ KONUŞTUR'}
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col gap-8">
                    <div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Ses Seçimi</h4>
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white font-bold outline-none focus:border-indigo-500"
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between mb-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Hız</h4>
                            <span className="text-[10px] font-mono text-indigo-400">{rate}x</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2" step="0.1" value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ton</h4>
                            <span className="text-[10px] font-mono text-indigo-400">{pitch}</span>
                        </div>
                        <input
                            type="range" min="0" max="2" step="0.1" value={pitch}
                            onChange={(e) => setPitch(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                    </div>

                    <div className="mt-auto p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                        <p className="text-[10px] text-indigo-300 italic leading-relaxed">
                            "Native modundasınız. ElevenLabs API anahtarı ekleyerek ultra gerçekçi klonlanmış seslere geçiş yapabilirsiniz."
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Metin Girişi</p>
                        <p>Seslendirilmesini istediğiniz metni ana kutucuğa yazın. İstediğiniz dilde giriş yapabilirsiniz.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Ses Ayarları</p>
                        <p>Sağ panelden farklı sesleri seçebilir, konuşma hızı ve tonunu ihtiyacınıza göre ayarlayabilirsiniz.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Nöral Sentez</p>
                        <p>Butona bastığınızda AI metni işler ve canlı spektrum eşliğinde seslendirme yapar.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceLabView;
