
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // fallbackKeys: .env dosyası çalışmazsa veya boşsa kullanılacak yedek anahtarlar (Kullanıcının sağladığı)
  const fallbackKeys = {
    GEMINI: "AIzaSyDJ7-BgiVAC1XBAYRValXZJsY09LLeaHjE",
    GEMINI_2: "AIzaSyB9VBp80hDOAYPvR7vvKJ9o8cUfoNTNrL8",
    GEMINI_3: "AIzaSyAxATkVRZ_s4aT1PwBRhAU70FTTlyDZnfo",
    OPENAI: "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", // Ana Key
    DEEPSEEK: "sk-af4fb14376d64c8c9219b65af64749ec",
    GROQ: "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",
    SERP: "ae050663c18491a0aa02e6a3e17aa80b4d7aec106666120883beb7716fc22c85",
    JSON2VIDEO: "fNGuFFGt1JlbCAVPieegAKjckfYdRrArdAKeJpDd",
    BINANCE_KEY: "NTbrn1OL02Yv8KxCHwtzadQ98q1j00QL3bscwkIl2EzVg9HCRO7CqKer4KpVUfSL",
    BINANCE_SECRET: "VHZrAr9rKI9HXigOfDmbGEsi0w3z94bBuqUHfYCMXL8sfBgOWK4HqzrqRhJMZ6OU",
    N8N: "https://dadasersin.app.n8n.cloud/webhook/2ec42c07-6bd2-4861-8389-e7b97e1fe7bc/chat"
  };

  return {
    plugins: [react()],
    define: {
      // Önce .env'den okumayı dene, yoksa fallback (hardcoded) anahtarı kullan
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || fallbackKeys.GEMINI),
      'process.env.GEMINI_API_KEY_2': JSON.stringify(env.GEMINI_API_KEY_2 || fallbackKeys.GEMINI_2),
      'process.env.GEMINI_API_KEY_3': JSON.stringify(env.GEMINI_API_KEY_3 || fallbackKeys.GEMINI_3),

      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY || fallbackKeys.OPENAI),
      'process.env.ANTHROPIC_API_KEY': JSON.stringify(env.ANTHROPIC_API_KEY || ''),
      'process.env.DEEPSEEK_API_KEY': JSON.stringify(env.DEEPSEEK_API_KEY || fallbackKeys.DEEPSEEK),
      'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY || fallbackKeys.GROQ),

      'process.env.SERP_API_KEY': JSON.stringify(env.SERP_API_KEY || fallbackKeys.SERP),
      'process.env.JSON2VIDEO_API_KEY': JSON.stringify(env.JSON2VIDEO_API_KEY || fallbackKeys.JSON2VIDEO),
      'process.env.N8N_WEBHOOK_URL': JSON.stringify(env.N8N_WEBHOOK_URL || fallbackKeys.N8N),

      'process.env.BINANCE_API_KEY': JSON.stringify(env.BINANCE_API_KEY || fallbackKeys.BINANCE_KEY),
      'process.env.BINANCE_SECRET_KEY': JSON.stringify(env.BINANCE_SECRET_KEY || fallbackKeys.BINANCE_SECRET),

      // Legacy
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || fallbackKeys.GEMINI),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1600,
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
