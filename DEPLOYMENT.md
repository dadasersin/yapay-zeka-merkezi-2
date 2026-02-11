# 🚀 Render.com Deployment Rehberi

Bu rehber, Yapay Zeka Merkezi projesini Render.com'da nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Hazırlık

### Gereksinimler
- ✅ GitHub hesabı
- ✅ Render.com hesabı ([ücretsiz kayıt](https://dashboard.render.com/register))
- ✅ Git kurulu (bilgisayarınızda)

## 🔧 Adım 1: GitHub Repository Oluşturma

### 1.1 GitHub'da Yeni Repository

1. [GitHub](https://github.com/new) üzerinde yeni repository oluşturun
2. Repository adı: `yapay-zeka-merkezi`
3. **Public** veya **Private** seçin
4. **README**, **gitignore** veya **license** eklemeyin (zaten mevcut)
5. **Create repository** butonuna tıklayın

### 1.2 Yerel Projeyi GitHub'a Push Etme

Terminal/PowerShell'de projenizin dizininde:

```powershell
cd C:\Users\ersin\.gemini\antigravity\scratch\yapay-zeka-merkezi

# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "🚀 Initial commit - Yapay Zeka Merkezi"

# GitHub remote ekle (KULLANICI_ADI yerine kendi kullanıcı adınızı yazın)
git remote add origin https://github.com/KULLANICI_ADI/yapay-zeka-merkezi.git

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub'a push et
git push -u origin main
```

## 🌐 Adım 2: Render.com'da Deployment

### 2.1 Render Dashboard

1. [Render Dashboard](https://dashboard.render.com)'a gidin
2. Sağ üstteki **"New +"** butonuna tıklayın
3. **"Web Service"** seçeneğini seçin

### 2.2 Repository Bağlama

1. **"Connect a repository"** bölümünde GitHub'ı seçin
2. İlk kez bağlıyorsanız GitHub hesabınıza yetki verin
3. Repository listesinden `yapay-zeka-merkezi`'ni bulun ve **"Connect"** tıklayın

### 2.3 Service Yapılandırması

Aşağıdaki ayarları yapın:

#### Temel Bilgiler
- **Name**: `yapay-zeka-merkezi` (veya istediğiniz bir isim)
- **Region**: `Oregon (US West)` önerilir (veya size yakın bölge)
- **Branch**: `main`

#### Build & Deploy
- **Runtime**: **Docker** seçin
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

#### Instance Type
- **Free** plan'ı seçin (başlangıç için yeterli)

### 2.4 Environment Variables (İsteğe Bağlı)

Bu projede API keyleri zaten kodda gömülü olduğu için environment variable eklemenize gerek yok! ✅

### 2.5 Deploy Başlatma

- Tüm ayarları kontrol edin
- En alttaki **"Create Web Service"** butonuna tıklayın

## ⏳ Adım 3: Deployment İzleme

### 3.1 Build Süreci

Render otomatik olarak:
1. ✅ Repository'yi klonlar
2. ✅ Docker image'ı build eder
3. ✅ npm install çalıştırır
4. ✅ npm run build ile production build oluşturur
5. ✅ npm run start ile uygulamayı başlatır

Bu işlem yaklaşık **5-10 dakika** sürer.

### 3.2 Deployment Logları

Build sürecini **Logs** sekmesinden takip edebilirsiniz:
- Yeşil ✅ işaretler: Başarılı adımlar
- Kırmızı ❌ işaretler: Hata varsa

### 3.3 Live URL

Deployment tamamlandığında:
```
https://yapay-zeka-merkezi-xxxx.onrender.com
```

formatında bir URL alacaksınız. Bu URL'ye tıklayarak uygulamanızı ziyaret edebilirsiniz!

## 🔄 Adım 4: Otomatik Deployment

Render GitHub'la sürekli bağlantılıdır:

- **GitHub'a her push**: Render otomatik olarak yeniden deploy eder
- **Pull request**: PR'lar için preview environment oluşturabilirsiniz
- **Manuel deploy**: Dashboard'dan "Manual Deploy" → "Deploy latest commit"

## 🎛️ Alternatif: Blueprint ile Deployment

Projenizde `render.yaml` dosyası mevcut, bu yüzden Blueprint özelliğini kullanabilirsiniz:

### Blueprint Deployment
1. Render Dashboard → **"New +"** → **"Blueprint"**
2. Repository'nizi seçin
3. Render otomatik olarak `render.yaml`'ı algılar
4. **"Apply"** butonuna tıklayın

## 🐞 Sorun Giderme

### Build Hatası

**Hata**: `npm: command not found`
- **Çözüm**: Runtime olarak **Docker** seçtiğinizden emin olun

**Hata**: `Failed to build`
- **Çözüm**: Logs'u kontrol edin, `package.json`'ın doğru olduğundan emin olun

### Port Hatası

**Hata**: `Port already in use`
- **Çözüm**: `vite.config.ts` zaten Render'ın `PORT` environment variable'ını kullanıyor, sorun olmamalı

### Blank Page

**Sorun**: Sayfa açılıyor ama boş
- **Çözüm**: Browser console'u kontrol edin (F12), API key hatası varsa `vite.config.ts`'e bakın

## 📊 Free Plan Limitler

Render Free Plan:
- ✅ 750 saat/ay çalışma süresi
- ✅ Otomatik HTTPS
- ✅ Otomatik deployment
- ⚠️ 15 dakika inaktivite sonrası sleep mode (ilk istekte yeniden başlar)

## 🔐 Güvenlik Notları

> [!WARNING]
> API keyleri `vite.config.ts` içinde açık olarak bulunuyor. Production ortamında bu keyler görülebilir. Eğer bu bir public proje ise, API keylerini environment variable olarak taşımayı düşünün.

### API Key'leri Gizleme (İsteğe Bağlı)

Eğer API keylerini gizlemek isterseniz:

1. `vite.config.ts`'den API keylerini kaldırın
2. Render Dashboard → Service Settings → Environment → Add Environment Variable
3. `VITE_API_KEY=your_key_here` şeklinde ekleyin
4. Kodda `import.meta.env.VITE_API_KEY` kullanın

## 🎉 Başarılı Deployment!

Tebrikler! Uygulamanız artık canlıda:
```
https://yapay-zeka-merkezi-xxxx.onrender.com
```

## 📚 Ek Kaynaklar

- [Render Docs](https://render.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Sorularınız mı var?** Repository'de issue açın! 💬
