import React, { useState, useEffect } from 'react';

interface LocalModel {
    name: string;
    size: string;
    status: 'running' | 'offline' | 'loading';
    lastUsed: string;
}

const LocalLLMView: React.FC = () => {
    const [models, setModels] = useState<LocalModel[]>([
        { name: 'Llama 3 (8B)', size: '4.7GB', status: 'offline', lastUsed: '2 saat önce' },
        { name: 'Mistral 7B', size: '4.1GB', status: 'offline', lastUsed: 'Dün' },
        { name: 'Phi-3 Mini', size: '2.3GB', status: 'offline', lastUsed: '1 hafta önce' }
    ]);

    const toggleModel = (index: number) => {
        const newModels = [...models];
        const currentStatus = newModels[index].status;

        if (currentStatus === 'offline') {
            newModels[index].status = 'loading';
            setModels(newModels);
            setTimeout(() => {
                newModels[index].status = 'running';
                setModels([...newModels]);
            }, 2000);
        } else {
            newModels[index].status = 'offline';
            setModels(newModels);
        }
    };

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Yerel LLM Kontrol Merkezi</h3>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] mt-2">Ollama & LM Studio Denetleyicisi</p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Yerel Sunucu Aktif</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model, i) => (
                    <div key={model.name} className="bg-black/40 border border-white/5 rounded-[40px] p-8 hover:border-emerald-500/30 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-all">{model.name}</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{model.size}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${model.status === 'running' ? 'bg-emerald-500 text-black' :
                                model.status === 'loading' ? 'bg-yellow-500 text-black animate-pulse' : 'bg-white/5 text-gray-500'
                                }`}>
                                {model.status}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span className="text-gray-600">RAM Kullanımı</span>
                                <span className="text-gray-400">{model.status === 'running' ? '4.2 GB' : '0 GB'}</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-emerald-500 transition-all duration-1000 ${model.status === 'running' ? 'w-full' : 'w-0'}`}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleModel(i)}
                            className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${model.status === 'running' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                                }`}
                        >
                            {model.status === 'running' ? 'Modeli Durdur' : 'Modeli Başlat'}
                        </button>

                        <p className="text-[8px] text-center text-gray-700 font-bold uppercase mt-4">Son kullanım: {model.lastUsed}</p>
                    </div>
                ))}

                <div className="bg-white/5 border border-white/10 border-dashed rounded-[40px] p-8 flex flex-col items-center justify-center gap-4 group hover:border-white/20 transition-all cursor-pointer">
                    <i className="fas fa-plus text-4xl text-gray-700 group-hover:text-white transition-all"></i>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Model Ekle (GGUF/Ollama)</p>
                </div>
            </div>

            <div className="mt-auto bg-black/60 border border-white/10 p-8 rounded-[40px] flex items-center justify-between">
                <div className="flex gap-10">
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Sistem Latency</p>
                        <p className="text-xl font-mono text-white">12ms</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">VRAM Status</p>
                        <p className="text-xl font-mono text-emerald-500">8.2 / 12 GB</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Endpoint URL</p>
                    <p className="text-xs font-mono text-gray-400">http://localhost:11434/api</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mt-4">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Sunucu Bağlantısı</p>
                        <p>Ollama veya LM Studio uygulamanızın arka planda çalıştığından emin olun (Port: 11434).</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Model Yönetimi</p>
                        <p>İndirmiş olduğunuz yerel modelleri bu panelden tek tıkla başlatabilir veya durdurabilirsiniz.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Kaynak İzleme</p>
                        <p>Alt paneldeki telemetri verileri sayesinde sisteminizdeki gecikme (latency) ve VRAM kullanımını takip edin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalLLMView;
