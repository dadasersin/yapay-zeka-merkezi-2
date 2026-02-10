// AI Provider Service - Tüm AI API'lerini yöneten merkezi servis

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    text: string;
    provider: AIProvider;
    model: string;
}

// OpenAI API Call
export async function callOpenAI(messages: AIMessage[], model: string = 'gpt-4'): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return {
        text: data.choices[0].message.content,
        provider: 'openai',
        model: model
    };
}

// Anthropic (Claude) API Call
export async function callAnthropic(messages: AIMessage[], model: string = 'claude-3-5-sonnet-20241022'): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    // Anthropic format: system message ayrı, user/assistant messages dizisi
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
        }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4096,
            system: systemMessage,
            messages: conversationMessages
        })
    });

    const data = await response.json();
    return {
        text: data.content[0].text,
        provider: 'anthropic',
        model: model
    };
}

// Groq API Call (Llama, Mixtral models)
export async function callGroq(messages: AIMessage[], model: string = 'llama-3.3-70b-versatile'): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 8000
        })
    });

    const data = await response.json();
    return {
        text: data.choices[0].message.content,
        provider: 'groq',
        model: model
    };
}

// Multi-Provider AI Call - Otomatik fallback
export async function callAI(
    messages: AIMessage[],
    preferredProvider: AIProvider = 'gemini',
    model?: string
): Promise<AIResponse> {
    try {
        switch (preferredProvider) {
            case 'openai':
                return await callOpenAI(messages, model || 'gpt-4o');
            case 'anthropic':
                return await callAnthropic(messages, model || 'claude-3-5-sonnet-20241022');
            case 'groq':
                return await callGroq(messages, model || 'llama-3.3-70b-versatile');
            case 'gemini':
            default:
                // Gemini calls handled by @google/genai library in components
                throw new Error('Gemini should be called via GoogleGenAI library');
        }
    } catch (error) {
        console.error(`Error calling ${preferredProvider}:`, error);

        // Fallback chain: OpenAI -> Groq -> Anthropic
        if (preferredProvider !== 'openai') {
            try {
                return await callOpenAI(messages, 'gpt-4o-mini');
            } catch (e) {
                console.error('OpenAI fallback failed:', e);
            }
        }

        if (preferredProvider !== 'groq') {
            try {
                return await callGroq(messages, 'llama-3.3-70b-versatile');
            } catch (e) {
                console.error('Groq fallback failed:', e);
            }
        }

        if (preferredProvider !== 'anthropic') {
            try {
                return await callAnthropic(messages, 'claude-3-5-sonnet-20241022');
            } catch (e) {
                console.error('Anthropic fallback failed:', e);
            }
        }

        throw new Error('All AI providers failed');
    }
}

// Supabase SDK wrapper (for data storage)
export const supabaseConfig = {
    apiKey: import.meta.env.VITE_SUPABASE_API_KEY,
    url: '', // Kullanıcı kendi Supabase URL'ini ekleyebilir
};

// Available models for each provider
export const AVAILABLE_MODELS = {
    openai: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo'
    ],
    anthropic: [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
    ],
    groq: [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'mixtral-8x7b-32768',
        'gemma2-9b-it'
    ],
    gemini: [
        'gemini-3-pro-preview',
        'gemini-3-flash-preview',
        'gemini-2.5-flash',
        'gemini-2.5-pro'
    ]
};
