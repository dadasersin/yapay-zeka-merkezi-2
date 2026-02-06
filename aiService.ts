
// aiService.ts - Hibrit & Çoklu Key Yönetimi
export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'deepseek';

export interface AIMessage {
    role: 'user' | 'model' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    text: string;
    provider: AIProvider;
    model: string;
}

export const AVAILABLE_MODELS = {
    // GÜNCELLEME: Model isimleri '001' versiyon etiketiyle sabitlendi (404 hatasını önlemek için)
    gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'],
    openai: ['gpt-4o', 'gpt-4o-mini'],
    anthropic: ['claude-3-5-sonnet-20241022'],
    groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    deepseek: ['deepseek-chat', 'deepseek-coder']
};

export async function callAI(
    messages: AIMessage[],
    preferredProvider: AIProvider = 'gemini',
    model?: string,
    dynamicApiKey?: string
): Promise<AIResponse> {
    const targetModel = model || AVAILABLE_MODELS[preferredProvider][0];

    let apiKey = dynamicApiKey;
    if (!apiKey) {
        if (preferredProvider === 'gemini') {
            const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => k && k.length > 10);
            if (keys.length > 0) apiKey = keys[Math.floor(Math.random() * keys.length)];
        }
        else if (preferredProvider === 'openai') apiKey = process.env.OPENAI_API_KEY;
        else if (preferredProvider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY;
        else if (preferredProvider === 'groq') apiKey = process.env.GROQ_API_KEY;
        else if (preferredProvider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY;
    }

    if (!apiKey) throw new Error(`${preferredProvider.toUpperCase()} API anahtarı bulunamadı.`);

    try {
        if (preferredProvider === 'openai') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model: targetModel, messages: messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })), temperature: 0.7 })
            });
            const data = await response.json();
            return { text: data.choices?.[0]?.message?.content || "Hata: Yanıt yok", provider: 'openai', model: targetModel };
        }
        else if (preferredProvider === 'anthropic') {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'dangerously-allow-browser': 'true' },
                body: JSON.stringify({ model: targetModel, messages: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })), system: messages.find(m => m.role === 'system')?.content, max_tokens: 4096 })
            });
            const data = await response.json();
            return { text: data.content?.[0]?.text || "Hata: Yanıt yok", provider: 'anthropic', model: targetModel };
        }
        else if (preferredProvider === 'groq') {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model: targetModel, messages: messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })), temperature: 0.7 })
            });
            const data = await response.json();
            return { text: data.choices?.[0]?.message?.content || "Hata: Yanıt yok", provider: 'groq', model: targetModel };
        }
        else if (preferredProvider === 'deepseek') {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model: targetModel, messages: messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })), temperature: 0.7 })
            });
            const data = await response.json();
            return { text: data.choices?.[0]?.message?.content || "Hata: Yanıt yok", provider: 'deepseek', model: targetModel };
        }
        else {
            throw new Error("Gemini çağrıları ChatView.tsx üzerinden yönetilmektedir.");
        }
    } catch (error: any) {
        console.error(`AI Service Error (${preferredProvider}):`, error);
        throw error;
    }
}
