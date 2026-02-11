// Mock AI Service - API olmadan simüle edilen yanıtlar
export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    text: string;
    provider: string;
    model: string;
}

// Mock yanıtlar
const mockResponses = [
    "Bu harika bir soru! API olmadan çalışıyorum ama size yardımcı olabilirim.",
    "Yapay zeka merkezi şu anda simülasyon modunda çalışıyor.",
    "İsteğinizi anladım. Size en iyi yanıtı hazırlıyorum...",
    "Quantum AI sistemleri aktif, yanıt üretiliyor...",
    "Veri işleme tamamlandı, size en doğru bilgiyi sunuyorum."
];

export async function callMockAI(messages: AIMessage[]): Promise<AIResponse> {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return {
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)] + 
              "\n\n*Bu bir simüle edilmiş yanıttır. Gerçek AI özellikleri için API anahtarı gereklidir.*",
        provider: 'MockAI',
        model: 'simulator-v1.0'
    };
}

export async function callMockImageGeneration(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Placeholder görsel URL'leri
    const placeholders = [
        "https://picsum.photos/512/512?random=1",
        "https://picsum.photos/512/512?random=2", 
        "https://picsum.photos/512/512?random=3"
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
}

export async function callMockVideoGeneration(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
    
    // Placeholder video URL
    return "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
}

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
