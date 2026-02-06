
@echo off
echo ===========================================
echo   YAPAY ZEKA MERKEZI - GITHUB YEDEKLEME
echo ===========================================
echo.
echo 1. Degisiklikler algilaniyor...
git add .

echo.
echo 2. Versiyon kaydediliyor...
set /p msg="Yedekleme mesaji girin (Enter'a basarsaniz 'Oto Yedek' yazilir): "
if "%msg%"=="" set msg=Oto Yedek - %date% %time%
git commit -m "%msg%"

echo.
echo 3. GitHub'a gonderiliyor...
git push origin main

echo.
echo ===========================================
if %errorlevel% neq 0 (
    echo [HATA] Yedekleme basarisiz oldu. Lutfen interneti ve Git ayarlarini kontrol edin.
) else (
    echo [BASARILI] Proje GitHub'a yedeklendi.
)
echo ===========================================
pause
