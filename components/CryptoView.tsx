import React, { useState, useEffect, useRef } from 'react';

const CryptoView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [prices, setPrices] = useState({ BTC: 64230.45, ETH: 3450.12, SOL: 145.67 });
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 50)]);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const indicators = ["SMA", "EMA", "RSI", "MACD", "VWAP", "Bollinger Bands"];
        const ind = indicators[Math.floor(Math.random() * indicators.length)];
        const coins = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const action = Math.random() > 0.5 ? "STRONG BUY" : "SCALE IN";
        addLog(`${coin} | ${ind}: ${action} Signal Generated`);

        setPrices(prev => ({
          BTC: prev.BTC + (Math.random() - 0.5) * 10,
          ETH: prev.ETH + (Math.random() - 0.5) * 5,
          SOL: prev.SOL + (Math.random() - 0.5) * 2,
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Ticker Tape */}
      <div className="flex gap-6 overflow-hidden bg-black/40 border-y border-white/5 py-3 whitespace-nowrap">
        {Object.entries(prices).map(([symbol, price]) => (
          <div key={symbol} className="flex items-center gap-3 px-6 border-r border-white/5 last:border-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{symbol}</span>
            <span className="text-sm font-mono text-cyan-400 font-bold">${(price as number).toFixed(2)}</span>
            <span className="text-[10px] text-green-400 font-bold">▲ {(Math.random() * 2).toFixed(2)}%</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-8 min-h-0">
          <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl flex-1 flex flex-col min-h-0 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Nöral Alpha Motoru</h3>
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em] mt-2">HFT Algoritmik İşlem Modeli // v4.2</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[8px] text-gray-500 uppercase font-black">Senkronizasyon</p>
                  <p className="text-[10px] text-emerald-400 font-black uppercase">Şifreli</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-cyan-500 animate-pulse' : 'bg-gray-800'}`}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {["SMA-20", "EMA-50", "RSI-14", "MACD-C"].map(ind => (
                <div key={ind} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-all cursor-pointer">
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-cyan-400 transition-all">{ind}</span>
                  <span className="text-xs font-mono text-white mt-1">AKTİF</span>
                </div>
              ))}
            </div>

            <div className="flex-1 bg-black/60 rounded-[32px] border border-white/5 p-8 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed relative">
              <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                  <i className="fas fa-microchip text-8xl mb-6"></i>
                  <p className="text-sm font-black uppercase italic tracking-widest text-center">Sistemin Devreye Girmesi Bekleniyor...</p>
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="mb-2 flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-cyan-900 font-black">{log.split(' ')[0]}</span>
                  <span className="text-cyan-400/80">{log.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 rounded-[40px] p-8 shadow-2xl backdrop-blur-3xl">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <i className="fas fa-shield-alt text-indigo-400"></i>
              Komuta Merkezi
            </h4>
            <div className="space-y-4">
              <button
                onClick={() => { setIsRunning(true); addLog("QUANTUM LINK KURULDU. VERİ AKIŞI BAŞLIYOR..."); }}
                disabled={isRunning}
                className="group relative w-full overflow-hidden"
              >
                <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className={`relative flex items-center justify-center gap-4 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isRunning ? 'bg-gray-900 text-gray-500 cursor-not-allowed' : 'bg-cyan-500 text-black hover:bg-cyan-400'}`}>
                  {isRunning && <i className="fas fa-spinner animate-spin"></i>}
                  Motoru Çalıştır
                </div>
              </button>

              <button
                onClick={() => { setIsRunning(false); addLog("ACİL DURDURMA BAŞLATILDI."); }}
                disabled={!isRunning}
                className="w-full py-5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 text-xs"
              >
                Sonlandır
              </button>
            </div>

            <div className="mt-12 space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-2">Portföy Getirisi</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white italic tracking-tighter">84.2%</span>
                  <span className="text-[10px] text-green-400 font-black tracking-widest">+20.4%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Risk Skoru</p>
                  <span className="text-xs font-black text-cyan-400">DÜŞÜK</span>
                </div>
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Gecikme</p>
                  <span className="text-xs font-black text-cyan-400">1.2ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 flex-1 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-all duration-1000">
              <i className="fas fa-atom text-[200px] text-cyan-500"></i>
            </div>
            <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Nöral Analiz</h4>
            <p className="text-xs font-bold text-gray-300 leading-relaxed italic">"Pazar yapısı, bir sonraki büyük yükselişten önce 68 bin seviyesinin üzerinde bir likidite temizliği sinyali veriyor. Onay gelene kadar tarafsız pozisyonu koruyun."</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
          <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. Veri Analizi</p>
            <p>Sistem, popüler kripto paraların (BTC, ETH, SOL) fiyatlarını ve teknik indikatörlerini anlık olarak analiz eder.</p>
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Algoritmik Sinyaller</p>
            <p>"Execute Engine" butonuna basarak AI destekli HFT işlem sinyallerini ve pazar içgörülerini canlı olarak takip edin.</p>
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Portföy Takibi</p>
            <p>Alt kısımdaki telemetri verileri ile pazar risk skorunu, gecikme süresini ve tahmini getirileri izleyebilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoView;
