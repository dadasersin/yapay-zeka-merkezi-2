
import React, { useEffect, useRef } from 'react';

interface Props {
    state: 'idle' | 'listening' | 'processing' | 'speaking';
    audioLevel?: number; // 0 - 1
}

const AIVisualizer: React.FC<Props> = ({ state, audioLevel = 0 }) => {

    // Basit bir CSS tabanlı animasyon kullanalım
    const getColor = () => {
        if (state === 'listening') return 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
        if (state === 'processing') return 'bg-cyan-400 animate-spin shadow-[0_0_50px_rgba(34,211,238,0.8)]';
        if (state === 'speaking') return 'bg-green-400 shadow-[0_0_40px_rgba(74,222,128,0.7)]';
        return 'bg-white/20';
    };

    const getSize = () => {
        if (state === 'listening') {
            const scale = 1 + (audioLevel * 5); // Ses seviyesine göre büyüme
            return { transform: `scale(${Math.min(scale, 2.5)})` };
        }
        if (state === 'speaking') {
            return { animation: 'pulse-speaking 1s infinite' };
        }
        return {};
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 transition-all duration-500">
            <div className="relative">
                {/* Core Sphere */}
                <div
                    className={`w-32 h-32 rounded-full backdrop-blur-3xl transition-all duration-200 ease-out border-2 border-white/30 ${getColor()}`}
                    style={getSize()}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        {state === 'idle' && <i className="fas fa-microphone text-3xl text-white/50"></i>}
                        {state === 'processing' && <i className="fas fa-brain text-3xl text-white/80 animate-pulse"></i>}
                        {state === 'speaking' && <div className="flex gap-1 h-8 items-center">
                            <div className="w-1 bg-white animate-bounce h-4"></div>
                            <div className="w-1 bg-white animate-bounce h-8 delay-75"></div>
                            <div className="w-1 bg-white animate-bounce h-6 delay-150"></div>
                            <div className="w-1 bg-white animate-bounce h-4 delay-300"></div>
                        </div>}
                    </div>
                </div>

                {/* Rings */}
                {state === 'listening' && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-50"></div>
                        <div className="absolute -inset-4 rounded-full border border-red-500/30 animate-pulse opacity-30"></div>
                    </>
                )}
            </div>

            <div className="mt-8 text-center">
                <p className="text-xl font-light tracking-[0.2em] uppercase text-white/80">
                    {state === 'idle' && "Hazır Bekleniyor"}
                    {state === 'listening' && "Dinleniyor..."}
                    {state === 'processing' && "Düşünülüyor..."}
                    {state === 'speaking' && "Konuşuyor..."}
                </p>
            </div>
        </div>
    );
};

export default AIVisualizer;
