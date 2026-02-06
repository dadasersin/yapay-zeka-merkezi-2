
import React, { useState, useEffect, useRef } from 'react';

interface VisualMemory {
    id: string;
    time: string;
    description: string;
    confidence: number;
}

const AstraAgent: React.FC = () => {
    const [isVisionActive, setIsVisionActive] = useState(false);
    const [detectedObjects, setDetectedObjects] = useState<string[]>(['Laptop', 'Mouse', 'Keyboard', 'Coffee Cup']);
    const [memories, setMemories] = useState<VisualMemory[]>([
        { id: '1', time: '14:20', description: 'User asked about the red coffee mug.', confidence: 0.98 },
        { id: '2', time: '14:25', description: 'Screen displayed a complex Python function.', confidence: 0.94 },
        { id: '3', time: '14:28', description: 'Identified a set of keys on the desk.', confidence: 0.91 }
    ]);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isVisionActive) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
                .catch(err => { console.error("Camera access failed", err); setIsVisionActive(false); });
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                videoRef.current.srcObject = null;
            }
        }
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
        };
    }, [isVisionActive]);

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">

                {/* Visual Feed Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex-1 bg-black rounded-[48px] border-4 border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)]">
                        {!isVisionActive ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-10 text-center">
                                <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 animate-pulse border border-cyan-500/30">
                                    <i className="fas fa-eye text-4xl text-cyan-400"></i>
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Vision Protocol Offline</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                    Astra requires visual input to process your environment and provide spatial intelligence.
                                </p>
                                <button
                                    onClick={() => setIsVisionActive(true)}
                                    className="mt-10 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                                >
                                    Vision Link Başlat
                                </button>
                            </div>
                        ) : (
                            <>
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Mock Recognition Bounding Boxes */}
                                    <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-cyan-400/50 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-pulse">
                                        <span className="absolute -top-6 left-0 bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Laptop (98%)</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-10 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Visual Analysis Engine v4.0</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="h-40 bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Astra Listening...</span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                            {[...Array(40)].map((_, i) => (
                                <div key={i} className="flex-1 bg-cyan-500/20 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Intelligence Side Panel */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">

                    {/* Objects List */}
                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col h-1/2">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                            Detected Entities
                        </h3>
                        <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar">
                            {detectedObjects.map(obj => (
                                <span key={obj} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                                    {obj}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contextual Memory */}
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-[40px] p-8 flex flex-col flex-1 overflow-hidden">
                        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 border-b border-indigo-500/10 pb-4">
                            Session Memory (10m)
                        </h3>
                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 text-indigo-100/80">
                            {memories.map(m => (
                                <div key={m.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[9px] font-black text-indigo-400">{m.time}</span>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase">Confidence: {Math.floor(m.confidence * 100)}%</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed italic">{m.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AstraAgent;
