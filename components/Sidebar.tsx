
import React from 'react';
import { WorkspaceView } from '../types';

interface SidebarProps {
  currentView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const mainItems = [
    { id: WorkspaceView.CHAT, label: 'Sohbet', icon: 'fas fa-comments' },
    { id: WorkspaceView.LIVE, label: 'Canlı Asistan', icon: 'fas fa-robot' },
    { id: WorkspaceView.ASTRA, label: 'Astra Ajan', icon: 'fas fa-eye' },
    { id: WorkspaceView.SEARCH, label: 'Google Arama', icon: 'fas fa-search' },
    { id: WorkspaceView.FLOW, label: 'Google Flow', icon: 'fas fa-project-diagram', color: 'text-indigo-400' },
  ];

  const neuralItems = [
    { id: WorkspaceView.YOUTUBE, label: 'YouTube Merkezi', icon: 'fab fa-youtube' },
    { id: WorkspaceView.BRAINSTORM, label: 'Beyin Fırtınası', icon: 'fas fa-brain' },
    { id: WorkspaceView.NEWS, label: 'Haber Merkezi', icon: 'fas fa-newspaper' },
    { id: WorkspaceView.NEURAL_MAP, label: '3D Nöral Harita', icon: 'fas fa-project-diagram' },
    { id: WorkspaceView.CRYPTO, label: 'Alfa Kripto', icon: 'fas fa-chart-line' },
    { id: WorkspaceView.ARENA, label: 'Model Arena', icon: 'fas fa-bolt' },
    { id: WorkspaceView.GHOST_RESEARCH, label: 'Ghost Araştırma', icon: 'fas fa-ghost' },
    { id: WorkspaceView.ARCHIVE, label: 'Nöral Hafıza', icon: 'fas fa-dna' },
  ];

  const ultimateItems = [
    { id: WorkspaceView.IMAGE_STUDIO, label: 'Image Studio', icon: 'fas fa-camera-retro', color: 'text-pink-400' },
    { id: WorkspaceView.DOC_INTEL, label: 'Belge Analizi', icon: 'fas fa-file-invoice', color: 'text-amber-400' },
    { id: WorkspaceView.CODE_COPILOT, label: 'Code Copilot', icon: 'fas fa-laptop-code', color: 'text-emerald-400' },
    { id: WorkspaceView.SOCIAL_AUTO, label: 'Sosyal Fabrika', icon: 'fas fa-share-nodes', color: 'text-sky-400' },
    { id: WorkspaceView.LEARNING_PATH, label: 'Eğitim Yolu', icon: 'fas fa-graduation-cap', color: 'text-violet-400' },
    { id: WorkspaceView.DATA_VIZ, label: 'Veri Vizyonu', icon: 'fas fa-chart-pie', color: 'text-rose-400' },
    { id: WorkspaceView.AGENT_TEAM, label: 'Ajan Ekibi', icon: 'fas fa-users-gear', color: 'text-cyan-400' },
  ];

  const developerItems = [
    { id: WorkspaceView.BUILDER, label: 'Uygulama Sihirbazı', icon: 'fas fa-magic' },
    { id: WorkspaceView.SANDBOX, label: 'Kod Sandbox', icon: 'fas fa-code' },
    { id: WorkspaceView.WORKFLOW, label: 'İş Akışı', icon: 'fas fa-project-diagram' },
    { id: WorkspaceView.LOCAL_LLM, label: 'Yerel LLM', icon: 'fas fa-server' },
    { id: WorkspaceView.SYSTEM, label: 'Sistem Ayarları', icon: 'fas fa-cog' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed md:relative w-72 h-screen border-r border-white/10 flex flex-col bg-black/90 md:bg-black/80 backdrop-blur-3xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <i className="fas fa-atom text-xl text-white"></i>
            </div>
            <div>
              <h2 className="text-md font-black italic tracking-tighter text-white uppercase leading-none">Ersin'in</h2>
              <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-[0.2em] mt-1">Yapay Zekası</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 mt-2 overflow-y-auto custom-scrollbar">
          {/* Main Menu */}
          <div>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3 ml-2">ANA MENÜ</p>
            <div className="grid grid-cols-1 gap-1">
              {mainItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${currentView === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <i className={`${item.icon} text-sm ${currentView === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`}></i>
                  <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ultimate Menu */}
          <div>
            <p className="text-[9px] text-pink-500 font-black uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
              <i className="fas fa-crown"></i> ULTIMATE PAKET
            </p>
            <div className="grid grid-cols-1 gap-1">
              {ultimateItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${currentView === item.id ? 'bg-white/10 text-white border border-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <i className={`${item.icon} text-sm ${item.color} ${currentView === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}></i>
                  <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Neural Center */}
          <div>
            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-3 ml-2">NÖRAL MERKEZ</p>
            <div className="grid grid-cols-1 gap-1">
              {neuralItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${currentView === item.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-indigo-900/10'}`}
                >
                  <i className={`${item.icon} text-sm ${currentView === item.id ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}></i>
                  <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Developer Tools */}
          <div>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3 ml-2">DEVELOPER ARAÇLARI</p>
            <div className="grid grid-cols-1 gap-1">
              {developerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${currentView === item.id ? 'bg-gray-500/10 text-gray-300 border border-gray-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  <i className={`${item.icon} text-sm ${currentView === item.id ? 'text-gray-300' : 'group-hover:text-gray-400'}`}></i>
                  <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">v2.5 // Neural Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
