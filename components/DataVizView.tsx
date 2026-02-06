import React, { useState } from 'react';

const DataVizView: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 animate-in zoom-in duration-700 uppercase italic font-['Inter']">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-rose-500">Data <span className="text-white">Vizyonu</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">İnteraktif Veri Görselleştirme Paneli</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-black text-gray-300 hover:text-white transition-all">EXPORT PDF</button>
                    <button className="bg-rose-600 px-6 py-2 rounded-2xl text-[10px] font-black text-white shadow-lg shadow-rose-600/20">LIVE STREAM</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Insight Card */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full group-hover:bg-rose-500/10 transition-colors duration-700"></div>

                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                <i className="fas fa-chart-line text-rose-500 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xl tracking-tighter">Büyüme Analitiği</h3>
                                <p className="text-gray-500 text-[10px] font-bold tracking-widest">REAL-TIME DATA PROCESSING</p>
                            </div>
                        </div>

                        {/* Simulated Chart */}
                        <div className="h-64 flex items-end justify-between gap-4 mt-12 bg-black/20 p-8 rounded-[2rem] border border-white/5 relative">
                            {[40, 70, 45, 90, 65, 80, 55, 100, 85].map((h, i) => (
                                <div key={i} className="flex-1 group/bar relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-lg transition-all duration-1000 ease-out"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-[8px] font-black text-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {h}k
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8">
                        <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Hacim</span>
                            <span className="text-white font-black text-xl italic">$1.2M</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Büyüme</span>
                            <span className="text-green-500 font-black text-xl italic">+%42.5</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Veri Kaynağı</span>
                            <span className="text-cyan-400 font-black text-xl italic">HİBRİT</span>
                        </div>
                    </div>
                </div>

                {/* Controls & Mini Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Görselleştirme Modu</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {['Radar', 'Line', 'Bar', 'Neural'].map(m => (
                                <button key={m} className={`p-4 rounded-2xl border transition-all text-[10px] font-black ${m === 'Neural' ? 'bg-rose-600/10 border-rose-500/30 text-rose-500' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'}`}>
                                    {m} Sentezi
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Hızlı Veri Girişi</h4>
                        <div className="p-10 border-2 border-dashed border-white/10 rounded-[2rem] text-center hover:border-rose-500/30 transition-all cursor-pointer group">
                            <i className="fas fa-file-csv text-3xl text-rose-500/30 group-hover:text-rose-500 mb-4 transition-all"></i>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">JSON / CSV yükle</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Veri Kaynağı</p>
                        <p>Analiz etmek istediğiniz ham tabloyu veya JSON verisini sisteme yükleyin.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. AI Modelleme</p>
                        <p>AI, verideki anlamlı korelasyonları ve anomalileri tespit ederek en uygun grafiği otomatik seçer.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Dashboard Oluşturma</p>
                        <p>Seçtiğiniz grafikleri sürükle-bırak yöntemiyle kendi özel canlı takip panelinize dönüştürün.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataVizView;
