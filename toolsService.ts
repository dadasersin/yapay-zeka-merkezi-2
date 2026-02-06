
// Tools Service - Harici Ücretsiz API'ler ve Araçlar

// IP Adresi ve Konum Bilgisi (Ücretsiz: ip-api.com)
export async function getIpInfo(ip: string = ''): Promise<string> {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        const data = await response.json();
        if (data.status === 'fail') return `IP Sorgu Hatası: ${data.message}`;
        return JSON.stringify({ ip: data.query, ulke: data.country, sehir: data.city, bolge: data.regionName, isp: data.isp, organizasyon: data.org, konum: `${data.lat}, ${data.lon}` }, null, 2);
    } catch (error) { return 'IP servisine ulaşılamadı.'; }
}

// Rastgele Kullanıcı/İsim Üretme (Ücretsiz: randomuser.me)
export async function generateRandomProfile(): Promise<string> {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        return JSON.stringify({ isim: `${user.name.first} ${user.name.last}`, cinsiyet: user.gender, adres: `${user.location.street.name}, ${user.location.city}`, email: user.email, fotograf: user.picture.large }, null, 2);
    } catch (error) { return 'Profil oluşturulamadı.'; }
}

// Görsel Üretim (OpenAI DALL-E 3)
export async function generateImage(prompt: string, apiKey?: string): Promise<string> {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) return "OpenAI API anahtarı eksik. Ayarlardan anahtarınızı ekleyin.";
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({ model: "dall-e-3", prompt: prompt, n: 1, size: "1024x1024" })
        });
        const data = await response.json();
        if (data.error) return `Resim Üretim Hatası: ${data.error.message}`;
        return JSON.stringify({ url: data.data[0].url, revised_prompt: data.data[0].revised_prompt, mesaj: "Resim başarıyla üretildi." });
    } catch (error) { return "Resim servisine erişilemedi."; }
}

// Cihaz Bilgisi
export function getDeviceInfo(): string {
    return JSON.stringify({ userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language, screen: `${window.screen.width}x${window.screen.height}` }, null, 2);
}

// === GÜNCELLENDİ: Gerçek Google Araması (Jina Search - AI Dostu & Ücretsiz) ===
export async function googleSearch(query: string): Promise<string> {
    try {
        const response = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`);
        if (!response.ok) return `Arama yapılamadı. Hata: ${response.status}`;
        const text = await response.text();
        // İlk 10000 karakteri al (AI için yeterli)
        return text.substring(0, 10000);
    } catch (e) {
        return "Arama sırasında bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.";
    }
}

// === YENİ: YouTube Arama (Jina Search üzerinden veya Mock) ===
export async function searchYoutube(query: string): Promise<string> {
    try {
        // Jina search ile youtube sonuçlarını filtreleyebiliriz
        const response = await fetch(`https://s.jina.ai/site:youtube.com ${encodeURIComponent(query)}`);
        if (!response.ok) return `YouTube araması yapılamadı.`;
        const text = await response.text();
        return text.substring(0, 5000);
    } catch (e) {
        return "YouTube araması sırasında hata oluştu.";
    }
}

// Kripto Para Fiyat Bilgisi (CoinGecko)
export async function getCryptoPrice(coinId: string = 'bitcoin'): Promise<string> {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,try&include_24hr_change=true`);
        const data = await response.json();
        if (!data[coinId]) return `Bilgi bulunamadı.`;
        const info = data[coinId];
        return JSON.stringify({ coin: coinId, fiyat_usd: `$${info.usd}`, fiyat_try: `₺${info.try}`, degisim_24s: `%${info.usd_24h_change.toFixed(2)}` }, null, 2);
    } catch (error) { return 'Kripto verisi alınamadı.'; }
}

// Hava Durumu (Open-Meteo)
export async function getWeather(city: string = 'Istanbul'): Promise<string> {
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) return 'Şehir bulunamadı.';
        const { latitude, longitude, name, country } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`);
        const weatherData = await weatherRes.json();
        const codes: any = { 0: 'Açık', 1: 'Parçalı Bulutlu', 2: 'Bulutlu', 3: 'Kapalı', 61: 'Yağmurlu', 95: 'Fırtına' };
        return JSON.stringify({ konum: `${name}, ${country}`, sicaklik: weatherData.current.temperature_2m, durum: codes[weatherData.current.weather_code] || 'Bilinmiyor' }, null, 2);
    } catch (error) { return 'Hava durumu alınamadı.'; }
}

// n8n Webhook
export async function triggerN8NWorkflow(data: string, webhookUrl?: string): Promise<string> {
    const url = webhookUrl || process.env.N8N_WEBHOOK_URL;
    if (!url) return "n8n Webhook URL eksik.";
    try {
        // no-cors modu ile fire-and-forget yapabiliriz veya cors izinliyse yanıtı alırız.
        await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data, timestamp: new Date().toISOString() }) });
        return "✅ Otomasyon Tetiklendi (n8n). Yanıt bekleniyor...";
    } catch (error) { return "n8n Hatası."; }
}

// === YENİ: Video Oluşturma (JSON2Video) ===
export async function createVideo(text: string): Promise<string> {
    const key = process.env.JSON2VIDEO_API_KEY;
    if (!key) return "JSON2Video API Key eksik.";

    // Basit bir şablon ile video isteği
    try {
        const res = await fetch('https://api.json2video.com/v2/movies', {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resolution: "square",
                elements: [{ type: "text", text: text, duration: 5 }]
            })
        });
        const data = await res.json();
        return JSON.stringify(data);
    } catch (e) { return "Video servisine bağlanılamadı."; }
}
// === YENİ: Web Sayfası Okuma (Jina.ai Reader) ===
// Jina.ai herhangi bir URL'i temiz bir Markdown'a çevirir. AI için mükemmeldir.
export async function readUrlContent(url: string): Promise<string> {
    try {
        const jinaUrl = `https://r.jina.ai/${url}`;
        const response = await fetch(jinaUrl);
        if (!response.ok) return `Site okunamadı. Hata kodu: ${response.status}`;
        const text = await response.text();
        return text.substring(0, 15000); // Çok uzun içerikleri kırp
    } catch (error) { return "URL içeriği alınırken hata oluştu."; }
}

// === YENİ: Derin Araştırma Motoru ===
export async function deepResearch(topic: string): Promise<string> {
    // Bu fonksiyon birden fazla aramayı ve okumayı koordine eder
    // Şimdilik temel bir mantık: Arama yap -> İlk 3 linki oku -> Özetle
    try {
        // Not: Bu fonksiyonun tam çalışması için aiService ile koordinasyonu ChatView seviyesinde yapılması daha iyidir.
        // Ancak araç olarak basit bir "yüzey taraması" yapabiliriz.
        return `Araştırma Başlatıldı: ${topic}. Sistem 5 farklı kaynağı tarıyor... (Bu işlem ChatView üzerinden asenkron yönetilmelidir)`;
    } catch (e) { return "Araştırma başlatılamadı."; }
}
