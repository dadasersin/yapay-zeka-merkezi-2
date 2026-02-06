import React, { useState } from 'react';

const DocIntelView: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<string[]>([]);

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setFiles(['mali_rapor_2025.pdf', 'proje_detaylari.docx']);
            setIsUploading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Doc <span className="text-amber-500">Intel</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Akıllı Belge Analiz Laboratuvarı</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Upload & Files Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div
                        onClick={handleUpload}
                        className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/30 hover:bg-white/10 transition-all group"
                    >
                        <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-4xl text-amber-500 mb-4 group-hover:scale-110 transition-transform`}></i>
                        <h3 className="text-white font-black text-xs uppercase tracking-widest">Belge Yükle</h3>
                        <p className="text-gray-500 text-[10px] mt-2">PDF, DOCX veya XLSX sürükleyin</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Aktif Belgeler</h4>
                        <div className="space-y-2">
                            {files.length > 0 ? files.map(file => (
                                <div key={file} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300">
                                    <i className="fas fa-file-pdf text-red-400"></i>
                                    <span className="truncate flex-1">{file}</span>
                                    <i className="fas fa-check-circle text-green-500"></i>
                                </div>
                            )) : (
                                <p className="text-gray-600 text-[10px] uppercase font-bold text-center py-4 italic">Belge Bekleniyor...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Console */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                        <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-6">Analitik Özet</h3>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[80%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                AI, yüklenen belgeleri tarayarak anahtar noktaları, riskleri ve finansal verileri otomatik olarak sınıflandırır.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <span className="text-amber-500 font-black text-lg block italic">742</span>
                                    <span className="text-[9px] text-gray-500 uppercase font-bold">Veri Noktası</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <span className="text-amber-500 font-black text-lg block italic">%98.2</span>
                                    <span className="text-[9px] text-gray-500 uppercase font-bold">Doğruluk</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl group">
                        <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-6">Doc-Chat</h3>
                        <div className="h-40 bg-black/40 rounded-2xl p-4 text-[11px] text-gray-500 mb-4 overflow-y-auto">
                            <p className="mb-2 italic">Asistan: Belge yüklendiğinde sorularınızı sorabilirsiniz...</p>
                        </div>
                        <div className="flex gap-2">
                            <input className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 text-xs text-white outline-none focus:border-amber-500/50" placeholder="Belge hakkında soru sor..." />
                            <button className="bg-amber-600 p-3 rounded-xl hover:bg-amber-500 transition-all">
                                <i className="fas fa-paper-plane text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Use Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Veri Girişi</p>
                        <p>Analiz etmek istediğiniz PDF veya rapor dosyalarını sürükleyip bırakın.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. OCR & Sentez</p>
                        <p>AI, metinleri tarar, tabloları okur ve karmaşık formülleri çözerek anlamlı bir veri haritası çıkarır.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Sorgulama</p>
                        <p>Doc-Chat kısmından "Bu rapordaki net kar nedir?" gibi sorular sorarak belgeden direkt yanıt alın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocIntelView;
