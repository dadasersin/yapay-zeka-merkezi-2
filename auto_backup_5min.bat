
@echo off
:loop
echo ===========================================
echo   [OTOMATIK] 5 Dakikalik GitHub Yedekleme
echo   Zaman: %date% %time%
echo ===========================================

git add .
git commit -m "Auto Backup (5 min interval) - %date% %time%"
git push origin main

if %errorlevel% neq 0 (
    echo [HATA] Yedekleme sirasinda hata olustu.
) else (
    echo [BASARILI] GitHub senkronizasyonu tamamlandi.
)

echo.
echo 1 dakika bekleniyor (Iptal icin pencereyi kapatin)...
timeout /t 60 /nobreak >nul
goto loop
