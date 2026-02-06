import React, { useState } from 'react';

const AgentTeamView: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-700">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ajan <span className="text-cyan-500">Ekibi</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Çoklu AI Ajan Koordinasyon Merkezi</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-2 rounded-2xl">
                    <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Aktif Ajan: 12</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Agent Roster */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-6">Ekibini Yönet</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Mimar AI', role: 'Sistem Tasarımı', color: 'text-indigo-400' },
                                { name: 'Debugger AI', role: 'Hata Ayıklama', color: 'text-emerald-400' },
                                { name: 'Analist AI', role: 'Veri Madenciliği', color: 'text-amber-400' }
                            ].map((agent, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group hover:border-cyan-500/30 transition-all cursor-pointer">
                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${agent.color}`}>
                                        <i className="fas fa-robot"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-xs">{agent.name}</h4>
                                        <p className="text-gray-500 text-[9px] uppercase tracking-wider">{agent.role}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-500 hover:text-white hover:border-cyan-500/30 transition-all font-black uppercase text-[10px] tracking-widest">
                            + Yeni Ajan Ata
                        </button>
                    </div>
                </div>

                {/* Task Orchestration */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden flex flex-col group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-8">Görev Dağıtım Konsolu</h3>

                    <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 p-8 relative overflow-hidden font-mono text-[11px] text-gray-400 space-y-4">
                        <div className="flex gap-4">
                            <span className="text-cyan-500">[SYSTEM]</span>
                            <span>Ajan 'Mimar' projeyi başlattı...</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-indigo-400">[MİMAR]</span>
                            <span>Veritabanı şeması oluşturuluyor: PostGres v15...</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-emerald-400">[DEBUGGER]</span>
                            <span>Giriş katmanında 3 potansiyel güvenlik riski tarandı...</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-amber-400">[ANALİST]</span>
                            <span>Kullanıcı trafik verileri OpenAI katmanına iletildi...</span>
                        </div>
                        <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                            <input className="flex-1 bg-black/60 border border-white/10 rounded-xl px-6 py-3 text-white outline-none focus:border-cyan-500/50" placeholder="Ekipten bir şey iste..." />
                            <button className="bg-cyan-600 px-6 rounded-xl hover:bg-cyan-500 transition-all font-black text-white text-[10px] uppercase tracking-widest italic">COORDİNAT</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Ekip Kurma</p>
                        <p>Projenizin ihtiyaçlarına göre farklı uzmanlıkları olan AI ajanlarını listenize ekleyin.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Görev Tanımı</p>
                        <p>Başlatmak istediğiniz projeyi ana hatlarıyla yazın. AI Orhestarator görevi parçalara böler ve uygun ajanlara dağıtır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. İzleme & Kontrol</p>
                        <p>Ajanların birbirleriyle olan iletişimlerini canlı izleyebilir ve istediğiniz aşamada sürece müdahale edebilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentTeamView;
