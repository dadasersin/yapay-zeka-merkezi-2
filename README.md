<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 Yapay Zeka Merkezi

**The Ultimate AI Command Center** - Gemini 3 Pro ile çalışan gelişmiş AI komuta merkezi. Merkezi bir hub olarak akıllı muhakeme, yaratıcı sentez ve otonom sistem kontrolü sunar.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## ✨ Özellikler

- 💬 **Komuta Merkezi** - Gelişmiş AI sohbet arayüzü, görev yönetimi
- 🎨 **Görsel Sentez Studio** - AI destekli görsel üretimi
- 🎥 **Veo Temporal Lab** - Video işleme ve analiz
- 🔴 **Omni-Link Live** - Canlı AI etkileşim
- 🎵 **Ses Laboratuvarı** - Ses sentezi ve analiz
- ⚙️ **Sistem Çekirdeği** - Sistem yönetimi ve kontrol
- 🏗️ **Otonom İnşa** - AI destekli uygulama oluşturma
- 🔄 **Neural Workflow Studio** - İş akışı otomasyonu
- 💰 **Kripto Bot Motoru** - Kripto bot yönetimi
- 📋 **İstek Yönetimi** - Talep ve görev takibi

## 🌐 Render.com'da Hızlı Deployment

### Ön Gereksinimler
- GitHub hesabı
- Render.com hesabı (ücretsiz)

### Deployment Adımları

#### 1️⃣ GitHub'a Yükle

```bash
cd C:\Users\ersin\.gemini\antigravity\scratch\yapay-zeka-merkezi

# Git repository başlat
git init
git add .
git commit -m "Initial commit - Yapay Zeka Merkezi"

# GitHub'a push et (kendi repository URL'inizi kullanın)
git remote add origin https://github.com/KULLANICI_ADI/yapay-zeka-merkezi.git
git branch -M main
git push -u origin main
```

#### 2️⃣ Render.com'da Deployment

1. **Render.com'a giriş yapın**: https://dashboard.render.com
2. **"New +"** butonuna tıklayın ve **"Web Service"** seçin
3. GitHub repository'nizi bağlayın
4. Aşağıdaki ayarları yapın:

**Temel Ayarlar:**
- **Name**: `yapay-zeka-merkezi`
- **Region**: `Oregon (US West)` veya size yakın bölge
- **Branch**: `main`
- **Runtime**: `Docker`

**Build & Deploy Settings:**
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

5. **Create Web Service** butonuna tıklayın

#### 3️⃣ Deployment Tamamlandı! 🎉

Render otomatik olarak uygulamanızı deploy edecek. URL şu formatta olacak:
```
https://yapay-zeka-merkezi-xxxx.onrender.com
```

### 🔧 Alternatif: Render.yaml ile Deployment

Repository'nizde zaten `render.yaml` dosyası mevcut. Render Dashboard'da:

1. **"New +"** → **"Blueprint"** seçin
2. Repository'nizi seçin
3. Render otomatik olarak `render.yaml`'ı algılayacak

## 💻 Yerel Geliştirme

### Gereksinimler
- Node.js 18+ 
- npm 9+

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build oluştur
npm run build

# Production preview
npm run preview
```

Uygulama `http://localhost:5173` adresinde çalışacak.

## 🔑 API Keys

API anahtarları (`GEMINI_API_KEY` vb.) zaten `vite.config.ts` içinde tanımlı ve kod içine gömülü. Herhangi bir environment variable ayarlamanız gerekmez! ✅

## 🐳 Docker ile Çalıştırma

```bash
# Docker image oluştur
docker build -t yapay-zeka-merkezi .

# Container'ı çalıştır
docker run -p 3000:3000 yapay-zeka-merkezi
```

## 📁 Proje Yapısı

```
yapay-zeka-merkezi/
├── components/          # React componentleri
│   ├── ChatView.tsx
│   ├── CreativeView.tsx
│   ├── VideoView.tsx
│   ├── LiveView.tsx
│   ├── AudioLab.tsx
│   ├── SystemView.tsx
│   ├── BuilderView.tsx
│   ├── WorkflowStudio.tsx
│   ├── CryptoView.tsx
│   └── RequestView.tsx
├── App.tsx              # Ana uygulama
├── types.ts             # TypeScript tanımları
├── vite.config.ts       # Vite yapılandırması
├── Dockerfile           # Docker yapılandırması
├── render.yaml          # Render deployment config
└── package.json         # Dependencies
```

## 🛠️ Teknoloji Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **AI**: Google Gemini API (@google/genai)
- **Styling**: TailwindCSS (CDN)
- **Icons**: Font Awesome 6

## 📝 Lisans

Bu proje özel kullanım içindir.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📞 Destek

Sorularınız için issue açabilirsiniz.

---

<div align="center">
Made with ❤️ using Google Gemini AI
</div>
