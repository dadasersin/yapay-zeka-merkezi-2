
import React from 'react';
import { WorkspaceView } from '../types';

interface SidebarProps {
  currentView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: WorkspaceView.HOME, label: '🏠 Ana Sayfa', icon: 'fas fa-home' },
    { id: WorkspaceView.CHAT, label: 'Panel', icon: 'fas fa-th-large' },
    { id: WorkspaceView.WORKFLOW, label: 'Workflow Studio', icon: 'fas fa-project-diagram' },
    { id: WorkspaceView.LIVE, label: 'Canlı Asistan', icon: 'fas fa-robot' },
    { id: WorkspaceView.AUDIO_LAB, label: 'Ses Laboratuvarı', icon: 'fas fa-microphone' },
    { id: WorkspaceView.CREATIVE, label: 'Görsel Üretim', icon: 'fas fa-paint-brush' },
    { id: WorkspaceView.VIDEO, label: 'Video Lab', icon: 'fas fa-video' },
  ];

  const toolItems = [
    { id: WorkspaceView.VIDEO_EDITOR, label: '🎬 Video Editör', icon: 'fas fa-film' },
    { id: WorkspaceView.AUDIO_STUDIO, label: '🎵 Ses Stüdyosu', icon: 'fas fa-music' },
    { id: WorkspaceView.DATA_ANALYTICS, label: '📊 Veri Analizi', icon: 'fas fa-chart-bar' },
    { id: WorkspaceView.MULTIMODAL_AI, label: '🧠 Multi-Modal AI', icon: 'fas fa-brain' },
    { id: WorkspaceView.AUTOMATION_STUDIO, label: '🔄 Otomasyon', icon: 'fas fa-robot' },
    { id: WorkspaceView.ART_STUDIO, label: '🎨 Sanat Stüdyosu', icon: 'fas fa-palette' },
    { id: WorkspaceView.GAME_DEV, label: '🎮 Oyun Geliştirme', icon: 'fas fa-gamepad' },
    { id: WorkspaceView.TEAM_COLLAB, label: '👥 Ekip Çalışması', icon: 'fas fa-users' },
    { id: WorkspaceView.ADVANCED_CHAT, label: '💬 Gelişmiş Sohbet', icon: 'fas fa-comments' },
    { id: WorkspaceView.SECURITY_CENTER, label: '🔐 Güvenlik', icon: 'fas fa-shield-alt' },
    { id: WorkspaceView.ANALYTICS_DASHBOARD, label: '📈 Analytics', icon: 'fas fa-chart-line' },
    { id: WorkspaceView.INTEGRATIONS, label: '🔗 Entegrasyonlar', icon: 'fas fa-plug' },
    { id: WorkspaceView.SOCIAL_MEDIA, label: '📢 Sosyal Medya', icon: 'fas fa-share-alt' },
    { id: WorkspaceView.BUILDER, label: 'Otonom İnşa', icon: 'fas fa-cube' },
    { id: WorkspaceView.CRYPTO, label: 'Kripto Bot', icon: 'fas fa-chart-line' },
    { id: WorkspaceView.REQUESTS, label: 'İstekler', icon: 'fas fa-clipboard-list' },
    { id: WorkspaceView.SYSTEM, label: 'Sistem', icon: 'fas fa-cog' },
  ];

  return (
    <aside className="w-72 border-r border-white/10 flex flex-col bg-black/80 backdrop-blur-3xl z-30">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <i className="fas fa-atom text-2xl text-white"></i>
        </div>
        <div>
          <h2 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">Quantum</h2>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em] mt-1">Yapay Zeka</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-8 mt-4 overflow-y-auto custom-scrollbar">
        <div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 ml-2">Ana Menü</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  currentView === item.id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-sm ${currentView === item.id ? 'text-black' : 'group-hover:text-cyan-400'}`}></i>
                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 ml-2">Araçlar</p>
          <div className="space-y-1">
            {toolItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  currentView === item.id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-sm ${currentView === item.id ? 'text-black' : 'group-hover:text-cyan-400'}`}></i>
                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="p-8 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Neural Workflow Ready</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
