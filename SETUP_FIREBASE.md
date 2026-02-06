# 🔥 Firebase Kurulum Rehberi

Yapay Zeka Merkezi'nizin giriş sisteminin (Login) çalışması için Google Firebase ayarlarını yapmanız gerekmektedir. Bu işlem 2 dakikanızı alır ve tamamen ücretsizdir.

## 1. Firebase Projesi Oluşturma
1.  [console.firebase.google.com](https://console.firebase.google.com/) adresine gidin.
2.  **"Proje Ekle"** (Add Project) butonuna tıklayın.
3.  Proje ismi olarak **"yapay-zeka-merkezi"** yazın ve devam edin.
4.  Analytics'i kapatıp (veya açık bırakıp) projeyi oluşturun.

## 2. Web Uygulaması Ekleme
1.  Proje paneli açıldığında orta kısımdaki **</>** (Web) ikonuna tıklayın.
2.  Uygulama takma adı: **"Site"** yazın.
3.  **"Uygulamayı Kaydet"** (Register app) butonuna basın.
4.  Size `const firebaseConfig = { ... }` şeklinde bir kod verecek.
5.  **BU KODU KOPYALAYIN.**

## 3. Kimlik Doğrulama (Auth) Açma
1.  Soldaki menüden **"Derleme" (Build) -> "Authentication"** kısmına tıklayın.
2.  **"Başlayın"** (Get Started) butonuna basın.
3.  **"Oturum açma yöntemi"** (Sign-in method) sekmesinden **"E-posta/Şifre"** (Email/Password) seçeneğini bulun.
4.  **Etkinleştir** (Enable) anahtarını açın ve Kaydet'e basın.
5.  Aynı ekranda **"Users"** (Kullanıcılar) sekmesine geçin.
6.  **"Kullanıcı Ekle"** butonuna basın.
7.  Email: `dadasersin@gmail.com`
8.  Şifre: (Kendi belirleyeceğiniz bir şifre)
9.  Kaydedin.

## 4. Ayarları Projeye Girme
1.  Bilgisayarınızdaki proje klasöründe `src` klasörüne girin.
2.  `firebaseConfig.ts` dosyasını Not Defteri veya VS Code ile açın.
3.  `const firebaseConfig = { ... }` kısmını, 2. adımda kopyaladığınız kod ile değiştirin.
4.  Kaydedin.

## 5. Güncelleme
1.  Değişikliği yaptıktan sonra `auto_backup_5min.bat` veya `backup_project.bat` dosyasına çift tıklayın.
2.  Kodlar GitHub'a (ve oradan Render'a) gidecek.
3.  Birkaç dakika sonra sitenizde giriş ekranı aktif olacaktır!
