// Google GenAI Wrapper - API anahtarı kontrolü ile
import { GoogleGenAI } from '@google/genai';

export class SafeGoogleGenAI {
  private static instance: GoogleGenAI | null = null;

  static getInstance(): GoogleGenAI | null {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API anahtarı bulunamadı. Simülasyon modu aktif.');
      return null;
    }

    if (!this.instance) {
      this.instance = new GoogleGenAI({ apiKey });
    }
    
    return this.instance;
  }

  static isAvailable(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }
}

// Mock veri üreticileri
export const mockDataGenerators = {
  generateChatResponse: async (prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `"${prompt}" için harika bir soru! Simülasyon modunda size yardımcı olabilirim.`,
      `İsteğinizi anladım. "${prompt}" konusunu işliyorum...`,
      `Quantum AI sistemleri aktif. "${prompt}" için yanıt üretiliyor.`,
      `Veri işleme tamamlandı. "${prompt}" hakkında en doğru bilgiyi sunuyorum.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\n*Bu bir simüle edilmiş yanıttır. Gerçek AI özellikleri için API anahtarı gereklidir.*";
  },

  generateImage: async (prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    return `https://picsum.photos/512/512?random=${Math.random()}`;
  },

  generateVideo: async (prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
    return "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
  },

  generateWorkflow: async (prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      nodes: [
        { id: "1", name: "Başlat", type: "trigger", position: [100, 100] },
        { id: "2", name: "İşlem", type: "action", position: [300, 100] },
        { id: "3", name: "Sonuç", type: "output", position: [500, 100] }
      ],
      links: [
        { fromNode: "1", toNode: "2" },
        { fromNode: "2", toNode: "3" }
      ]
    };
  }
};
