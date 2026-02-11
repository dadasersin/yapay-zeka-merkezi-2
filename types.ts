
export enum WorkspaceView {
  CHAT = 'CHAT',
  CREATIVE = 'CREATIVE',
  VIDEO = 'VIDEO',
  LIVE = 'LIVE',
  AUDIO_LAB = 'AUDIO_LAB',
  SYSTEM = 'SYSTEM',
  BUILDER = 'BUILDER',
  WORKFLOW = 'WORKFLOW',
  CRYPTO = 'CRYPTO',
  REQUESTS = 'REQUESTS',
  // Yeni özellikler
  VIDEO_EDITOR = 'VIDEO_EDITOR',
  AUDIO_STUDIO = 'AUDIO_STUDIO',
  DATA_ANALYTICS = 'DATA_ANALYTICS',
  MULTIMODAL_AI = 'MULTIMODAL_AI',
  AUTOMATION_STUDIO = 'AUTOMATION_STUDIO',
  ART_STUDIO = 'ART_STUDIO',
  GAME_DEV = 'GAME_DEV',
  TEAM_COLLAB = 'TEAM_COLLAB',
  ADVANCED_CHAT = 'ADVANCED_CHAT',
  SECURITY_CENTER = 'SECURITY_CENTER',
  ANALYTICS_DASHBOARD = 'ANALYTICS_DASHBOARD',
  INTEGRATIONS = 'INTEGRATIONS',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  HOME = 'HOME'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: Array<{ uri: string; title: string }>;
  attachment?: {
    type: 'image' | 'video' | 'audio';
    url: string;
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
