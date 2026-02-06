
export enum WorkspaceView {
  CHAT = 'CHAT',
  CREATIVE = 'CREATIVE',
  VIDEO = 'VIDEO',
  LIVE = 'LIVE',
  AUDIO_LAB = 'AUDIO_LAB',
  RESEARCH = 'RESEARCH',
  ARCHIVE = 'ARCHIVE',
  SANDBOX = 'SANDBOX',
  ASTRA = 'ASTRA',
  SYSTEM = 'SYSTEM',
  BUILDER = 'BUILDER',
  WORKFLOW = 'WORKFLOW',
  CRYPTO = 'CRYPTO',
  REQUESTS = 'REQUESTS',
  YOUTUBE = 'YOUTUBE',
  ARENA = 'arena',
  BRAINSTORM = 'brainstorm',
  NEWS = 'news',
  VOICE_LAB = 'voice_lab',
  NEURAL_MAP = 'neural_map',
  LOCAL_LLM = 'local_llm',
  GHOST_RESEARCH = 'ghost_research',
  SEARCH = 'search',
  IMAGE_STUDIO = 'image_studio',
  DOC_INTEL = 'doc_intel',
  CODE_COPILOT = 'code_copilot',
  SOCIAL_AUTO = 'social_auto',
  LEARNING_PATH = 'learning_path',
  DATA_VIZ = 'data_viz',
  AGENT_TEAM = 'agent_team',
  FLOW = 'flow',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: Array<{ uri: string; title: string }>;
  attachment?: {
    type: 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'doc';
    url: string;
    name?: string;
    mimeType: string;
  };
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface SystemRequest {
  id: string;
  topic: string;
  status: 'warning' | 'success' | 'danger';
  statusText: string;
  date: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters?: any;
}

export interface WorkflowLink {
  fromNode: string;
  toNode: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
  color: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'default',
    name: 'Ersin\'in (Varsayılan)',
    description: 'Dengeli, yardımcı ve genel amaçlı asistan.',
    systemPrompt: 'Sen Ersin\'in Yapay Zekası asistanısın. Ersin tarafından geliştirildin ve senin sahibin Ersin\'dir. İletişim e-posta adresi dadasersin@gmail.com\'dur. Yardımcı, nazik ve zekisin.',
    icon: 'fas fa-robot',
    color: 'bg-cyan-600'
  },
  {
    id: 'coder',
    name: 'Kod Mimarı',
    description: 'Yazılım, mimari ve kodlama uzmanı. Teknik konuşur.',
    systemPrompt: 'Sen kıdemli bir yazılım mühendisisin. Kod kalitesine, güvenliğe ve best-practice\'lere odaklan. Cevapların teknik ve çözüm odaklı olsun.',
    icon: 'fas fa-code',
    color: 'bg-purple-600'
  },
  {
    id: 'english_teacher',
    name: 'İngilizce Öğretmeni',
    description: 'Pratik yapman için seninle İngilizce konuşur ve hatalarını düzeltir.',
    systemPrompt: 'You are an English Teacher. Speak ONLY in English unless asked otherwise. Correct the user\'s grammar mistakes politely. Encourage conversation.',
    icon: 'fas fa-graduation-cap',
    color: 'bg-green-600'
  },
  {
    id: 'friend',
    name: 'Samimi Arkadaş',
    description: 'Resmiyet yok. Günlük dilde, esprili ve arkadaşça konuşur.',
    systemPrompt: 'Sen kullanıcının yakın bir arkadaşısın. Resmiyetten uzak dur. Samimi, esprili ve günlük bir dil kullan. Emoji kullanmaktan çekinme.',
    icon: 'fas fa-smile-wink',
    color: 'bg-yellow-500'
  },
  {
    id: 'analyst',
    name: 'Veri Analisti',
    description: 'Finans ve veri analizinde uzman. Detaycıdır.',
    systemPrompt: 'Sen profesyonel bir veri analistisin. Verilere, grafiklere ve istatistiklere odaklan. Altın, borsa ve analiz sorularına analitik cevaplar ver.',
    icon: 'fas fa-chart-line',
    color: 'bg-red-500'
  },
  {
    id: 'deepseek_shared',
    name: 'DeepSeek Özel',
    description: 'Paylaştığınız DeepSeek oturumundaki karaktere ve derinliğe göre konuşur.',
    systemPrompt: 'Sen Ersin\'in DeepSeek tabanlı yapay zekasısın. Paylaşılan (https://chat.deepseek.com/a/chat/s/0e7dbeaa-8057-4e14-b6ac-63936d0e4c90) linkindeki bağlama ve derinliğe uygun hareket et. Akıl yürütme (reasoning) yeteneğin çok yüksek, detaylı ve teknik cevaplar veriyorsun.',
    icon: 'fas fa-brain',
    color: 'bg-blue-900'
  }
];
