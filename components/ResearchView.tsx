
import React from 'react';

const ResearchView: React.FC = () => {
    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <h2 className="text-xl font-bold mb-2">Derin Araştırma Laboratuvarı</h2>
                <p className="text-gray-400">Yapay zeka internetin derinliklerine iner, kaynakları sentezler ve kapsamlı bir rapor sunar.</p>

                <div className="mt-8 flex gap-4">
                    <input
                        type="text"
                        placeholder="Araştırılacak konuyu girin..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 focus:border-cyan-500 outline-none transition-all"
                    />
                    <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2">
                        <i className="fas fa-search"></i>
                        <span>ARAŞTIR</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-microscope text-3xl text-cyan-400 mb-4"></i>
                    <h3 className="font-bold mb-2">Analiz Modu</h3>
                    <p className="text-xs text-gray-400">Birden fazla makaleyi karşılaştırarak tutarlılık analizi yapar.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-file-invoice text-3xl text-purple-400 mb-4"></i>
                    <h3 className="font-bold mb-2">Raporlama</h3>
                    <p className="text-xs text-gray-400">Akademik düzeyde PDF veya Markdown raporları oluşturur.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-project-diagram text-3xl text-green-400 mb-4"></i>
                    <h3 className="font-bold mb-2">Görsel Haritama</h3>
                    <p className="text-xs text-gray-400">Konular arasındaki bağlantıları zihin haritası olarak sunar.</p>
                </div>
            </div>
        </div>
    );
};

export default ResearchView;
