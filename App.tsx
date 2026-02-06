
import React, { useState, useEffect } from 'react';
import { WorkspaceView } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import CreativeView from './components/CreativeView';
import VideoView from './components/VideoView';
import LiveView from './components/LiveView';
import AudioLab from './components/AudioLab';
import SystemView from './components/SystemView';
import BuilderView from './components/BuilderView';
import WorkflowStudio from './components/WorkflowStudio';
import CryptoView from './components/CryptoView';
import RequestView from './components/RequestView';
import ResearchView from './components/ResearchView';
import ArchiveView from './components/ArchiveView';
import SandboxView from './components/SandboxView';
import AstraAgent from './components/AstraAgent';
import YoutubeView from './components/YoutubeView';
import ArenaView from './components/ArenaView';
import BrainstormView from './components/BrainstormView';
import NewsView from './components/NewsView';
import VoiceLabView from './components/VoiceLabView';
import NeuralMapView from './components/NeuralMapView';
import LocalLLMView from './components/LocalLLMView';
import GhostResearchView from './components/GhostResearchView';
import SearchView from './components/SearchView';
import NewFeaturePlaceholder from './components/NewFeaturePlaceholder';
import ImageStudioView from './components/ImageStudioView';
import DocIntelView from './components/DocIntelView';
import CodeCopilotView from './components/CodeCopilotView';
import SocialAutoView from './components/SocialAutoView';
import LearningPathView from './components/LearningPathView';
import DataVizView from './components/DataVizView';
import AgentTeamView from './components/AgentTeamView';

import LoginView from './components/LoginView';
import { onAuthStateChanged, logout, ADMIN_EMAIL, isAuthInitialized } from './authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<WorkspaceView>(WorkspaceView.CHAT);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // DIRECT ACCESS: Default to a mock user so the app opens immediately
  const [user, setUser] = useState<any>({ email: 'dadasersin@gmail.com' });
  const [authLoading, setAuthLoading] = useState(false);
  const [configError, setConfigError] = useState(false); // Ignored
  const [userIp, setUserIp] = useState<string>('Detecting...');

  // Optional: Try to connect to Firebase if available, but don't block if not.
  useEffect(() => {
    if (isAuthInitialized()) {
      const unsub = onAuthStateChanged((u) => {
        if (u) setUser(u);
        // If u is null (logout), we normally go to login, but for "Direct Access" we might want to stay put or show login.
        // For now, let's allow logout to show LoginView if they really want.
        else setUser(null);
      });
      return () => unsub();
    }
  }, []);

  const [apiKeyReady, setApiKeyReady] = useState(false);

  // REMOVED: Blocking Config Error Screen
  // REMOVED: Auth Loading Spinner (since we default to a user)

  if (!user) return <LoginView onLoginSuccess={() => { }} />;
  // All removed to ensure direct access.

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
    };
    checkApiKey();

    // Fetch User IP
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (e) {
        setUserIp('Unknown');
      }
    };
    fetchIp();
  }, []);

  const handleOpenKeyPicker = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setApiKeyReady(true);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case WorkspaceView.CHAT: return <ChatView />;
      case WorkspaceView.CREATIVE: return <CreativeView apiKeyReady={apiKeyReady} onOpenKeyPicker={handleOpenKeyPicker} />;
      case WorkspaceView.VIDEO: return <VideoView apiKeyReady={apiKeyReady} onOpenKeyPicker={handleOpenKeyPicker} />;
      case WorkspaceView.LIVE: return <LiveView />;
      case WorkspaceView.AUDIO_LAB: return <AudioLab />;
      case WorkspaceView.SYSTEM: return <SystemView />;
      case WorkspaceView.BUILDER: return <BuilderView />;
      case WorkspaceView.WORKFLOW: return <WorkflowStudio />;
      case WorkspaceView.CRYPTO: return <CryptoView />;
      case WorkspaceView.REQUESTS: return <RequestView />;
      case WorkspaceView.RESEARCH: return <ResearchView />;
      case WorkspaceView.ARCHIVE: return <ArchiveView />;
      case WorkspaceView.SANDBOX: return <SandboxView />;
      case WorkspaceView.ASTRA: return <AstraAgent />;
      case WorkspaceView.YOUTUBE: return <YoutubeView />;
      case WorkspaceView.ARENA: return <ArenaView />;
      case WorkspaceView.BRAINSTORM: return <BrainstormView />;
      case WorkspaceView.NEWS: return <NewsView />;
      case WorkspaceView.NEURAL_MAP: return <NeuralMapView />;
      case WorkspaceView.SEARCH: return <SearchView />;
      case WorkspaceView.VOICE_LAB: return <VoiceLabView />;
      case WorkspaceView.LOCAL_LLM: return <LocalLLMView />;
      case WorkspaceView.GHOST_RESEARCH: return <GhostResearchView />;
      case WorkspaceView.IMAGE_STUDIO: return <ImageStudioView />;
      case WorkspaceView.DOC_INTEL: return <DocIntelView />;
      case WorkspaceView.CODE_COPILOT: return <CodeCopilotView />;
      case WorkspaceView.SOCIAL_AUTO: return <SocialAutoView />;
      case WorkspaceView.LEARNING_PATH: return <LearningPathView />;
      case WorkspaceView.DATA_VIZ: return <DataVizView />;
      case WorkspaceView.AGENT_TEAM: return <AgentTeamView />;
      case WorkspaceView.FLOW: return (
        <div className="w-full h-full bg-black/50 rounded-2xl border border-white/10 overflow-hidden">
          <iframe
            src="https://labs.google/fx/tr/tools/flow/project/14c81643-573a-49bd-bab0-c5a9b750d871"
            className="w-full h-full border-none"
            title="Google Labs Flow"
          />
        </div>
      );
      default: return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-['Inter']">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                {currentView === WorkspaceView.CHAT && "Ersin'in Yapay Zekası"}
                {currentView === WorkspaceView.CREATIVE && "Görsel Sentez Studio"}
                {currentView === WorkspaceView.VIDEO && "Veo Temporal Lab"}
                {currentView === WorkspaceView.LIVE && "Omni-Link Live"}
                {currentView === WorkspaceView.AUDIO_LAB && "Ses Laboratuvarı"}
                {currentView === WorkspaceView.SYSTEM && "Sistem Çekirdeği"}
                {currentView === WorkspaceView.BUILDER && "Otonom İnşa"}
                {currentView === WorkspaceView.WORKFLOW && "Neural Workflow Studio"}
                {currentView === WorkspaceView.CRYPTO && "Kripto Bot Motoru"}
                {currentView === WorkspaceView.REQUESTS && "İstek Yönetimi"}
                {currentView === WorkspaceView.RESEARCH && "Derin Araştırma Laboratuvarı"}
                {currentView === WorkspaceView.ARCHIVE && "Nöral Hafıza Arşivi"}
                {currentView === WorkspaceView.SANDBOX && "Quantum AI Sandbox"}
                {currentView === WorkspaceView.ASTRA && "Project Astra: Ersin'in Evrensel Asistanı"}
                {currentView === WorkspaceView.YOUTUBE && "YouTube Sinematik Hub"}
                {currentView === WorkspaceView.ARENA && "AI Model Arena: Performans Kıyaslama"}
                {currentView === WorkspaceView.BRAINSTORM && "AI Beyin fırtınası & Strateji Merkezi"}
                {currentView === WorkspaceView.NEWS && "Haber Merkezi: Canlı AI Haber Akışı"}
                {currentView === WorkspaceView.NEURAL_MAP && "3D Nöral Hafıza Haritası"}
                {currentView === WorkspaceView.SEARCH && "Google Arama Motoru"}
                {currentView === WorkspaceView.VOICE_LAB && "Ses Laboratuvarı & Sentezleyici"}
                {currentView === WorkspaceView.LOCAL_LLM && "Yerel LLM Kontrol Merkezi"}
                {currentView === WorkspaceView.GHOST_RESEARCH && "Ghost Research: Otonom Araştırma Ajanı"}
                {currentView === WorkspaceView.IMAGE_STUDIO && "AI Image Studio: İleri Seviye Görsel Stüdyo"}
                {currentView === WorkspaceView.DOC_INTEL && "Doc Intel: Akıllı Belge Analizi"}
                {currentView === WorkspaceView.CODE_COPILOT && "Code Copilot: Repo & Geliştirici Asistanı"}
                {currentView === WorkspaceView.SOCIAL_AUTO && "Social Auto: Otonom İçerik Fabrikası"}
                {currentView === WorkspaceView.LEARNING_PATH && "Learning Path: Kişiselleştirilmiş Eğitim Yolu"}
                {currentView === WorkspaceView.DATA_VIZ && "Data Viz: İnteraktif Veri Görselleştirme"}
                {currentView === WorkspaceView.AGENT_TEAM && "Agent Team: AI Görev Dağıtım Merkezi"}
                {currentView === WorkspaceView.FLOW && "Google Labs Flow: Nöral Akış Tasarımcısı"}
              </h1>
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            </div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">
              Protocol v12.0 // Workflow Engine v2.5 Online
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white text-sm font-bold">{user.email}</p>
              <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-tighter">IP: {userIp}</p>
            </div>
            <button onClick={logout} className="bg-red-500/10 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
              <i className="fas fa-sign-out-alt"></i>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user.email.substring(0, 2)}&background=00f2ff&color=000`} alt="Profil" />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
