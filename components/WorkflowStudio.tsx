
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { WorkflowNode, WorkflowLink } from '../types';

const WorkflowStudio: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [links, setLinks] = useState<WorkflowLink[]>([]);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'logs'>('visual');
  const [logs, setLogs] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');

  const [isSimulating, setIsSimulating] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);
  };

  const processJson = (content: string) => {
    if (!content.trim()) {
      addLog("HATA: İşlenecek JSON verisi bulunamadı.");
      return;
    }
    try {
      const data = JSON.parse(content);
      addLog("Workflow JSON ayrıştırılıyor...");

      const parsedNodes: WorkflowNode[] = (data.nodes || []).map((n: any) => ({
        id: n.id,
        name: n.name,
        type: n.type,
        position: n.position || [Math.random() * 500, Math.random() * 500],
        parameters: n.parameters
      }));

      const parsedLinks: WorkflowLink[] = (data.links || []).map((l: any) => ({
        fromNode: l.fromNode,
        toNode: l.toNode
      }));

      setNodes(parsedNodes);
      setLinks(parsedLinks);
      setJsonInput(JSON.stringify(data, null, 2));
      addLog(`${parsedNodes.length} düğüm ve ${parsedLinks.length} bağlantı başarıyla yüklendi.`);
      setActiveTab('visual');
    } catch (e: any) {
      addLog(`HATA: Geçersiz JSON yapısı - ${e.message}`);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || isProcessing) return;
    setIsProcessing(true);
    addLog("Gemini AI ile iş akışı tasarlanıyor...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Aşağıdaki tanıma göre bir n8n benzeri iş akışı JSON'u oluştur. JSON şu yapıda olmalı: 
        { "nodes": [ { "id": "1", "name": "Node Adı", "type": "node.type", "position": [x, y], "parameters": {} } ], 
          "links": [ { "fromNode": "1", "toNode": "2" } ] }
        
        Kullanıcı Tanımı: ${aiPrompt}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    position: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                    parameters: { type: Type.OBJECT }
                  },
                  required: ['id', 'name', 'type', 'position']
                }
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fromNode: { type: Type.STRING },
                    toNode: { type: Type.STRING }
                  },
                  required: ['fromNode', 'toNode']
                }
              }
            },
            required: ['nodes', 'links']
          }
        }
      });

      const result = JSON.parse(response.text);
      processJson(JSON.stringify(result));
      addLog("AI İş akışı tasarımı tamamlandı.");
    } catch (error: any) {
      addLog(`AI Hata: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const runSimulation = async () => {
    if (nodes.length === 0) return;
    setIsProcessing(true);
    setSimulationProgress(0);
    addLog("Neural Execution Engine başlatıldı...");

    let step = 0;
    for (const node of nodes) {
      step++;
      setActiveNodeId(node.id);
      setSimulationProgress((step / nodes.length) * 100);
      setTelemetryData(node.parameters || { info: "Node parametreleri aktif." });

      addLog(`İşleniyor: ${node.name}`);
      await new Promise(r => setTimeout(r, 1000));
      addLog(`Tamamlandı: ${node.name}`);
    }

    setActiveNodeId(null);
    setTelemetryData(null);
    setExecutionResult("Workflow başarıyla yürütüldü.");
    addLog("Simülasyon tamamlandı.");
    setIsProcessing(false);
    setTimeout(() => setExecutionResult(null), 3000);
    setActiveNodeId(null);
    addLog("Neural Execution Engine başlatıldı...");

    // Reset all nodes to idle before starting
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));

    const executionOrder = nodes.map(n => n.id);
    let currentIndex = 0;

    const executeNext = () => {
      if (currentIndex >= executionOrder.length) {
        setIsProcessing(false);
        setExecutionResult("Workflow başarıyla yürütüldü.");
        addLog("Simülasyon tamamlandı.");
        setTimeout(() => setExecutionResult(null), 3000);
        setNodes(prev => prev.map(n => ({ ...n, status: 'idle' }))); // Reset all to idle after completion
        return;
      }

      const nodeId = executionOrder[currentIndex];
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) {
        currentIndex++;
        executeNext();
        return;
      }

      setActiveNodeId(nodeId);
      setTelemetryData(currentNode.parameters || { info: "Node parametreleri aktif." });
      setSimulationProgress(((currentIndex + 1) / executionOrder.length) * 100);
      addLog(`İşleniyor: ${currentNode.name}`);

      setNodes(prev => prev.map(n =>
        n.id === nodeId ? { ...n, status: 'working' } : n
      ));

      setTimeout(() => {
        addLog(`Tamamlandı: ${currentNode.name}`);
        setNodes(prev => prev.map(n =>
          n.id === nodeId ? { ...n, status: 'completed' } : n
        ));
        currentIndex++;
        executeNext();
      }, 1500); // Simulate work for 1.5 seconds per node
    };

    executeNext();
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-12rem)] relative"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => processJson(ev.target?.result as string);
          reader.readAsText(file);
        }
      }}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-cyan-900/60 backdrop-blur-md border-4 border-dashed border-cyan-400 rounded-[40px] flex flex-col items-center justify-center pointer-events-none">
          <i className="fas fa-file-code text-5xl text-cyan-400 mb-4 animate-bounce"></i>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">JSON Verisini Bırak</h2>
        </div>
      )}

      <div className="mb-6 flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="AI'ya iş akışı tasarlat (Örn: Telegram'dan gelen mesajı Gemini ile analiz et ve e-posta gönder)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold uppercase tracking-widest outline-none focus:border-cyan-500 transition-all placeholder:text-gray-700"
          />
        </div>
        <button
          onClick={handleAiGenerate}
          disabled={!aiPrompt.trim() || isProcessing}
          className="px-8 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-purple-500/20"
        >
          {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-magic"></i>}
          Tasarla
        </button>
        <button
          onClick={runSimulation}
          disabled={nodes.length === 0 || isProcessing}
          className="px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-cyan-500/20"
        >
          {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-play"></i>}
          Yürüt
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-[32px] p-6 flex flex-col overflow-hidden">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center justify-between">JSON Verisi</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 bg-transparent border-none p-0 text-[10px] font-mono text-cyan-300/70 resize-none outline-none custom-scrollbar mb-4"
              placeholder="JSON buraya..."
            />
            <button
              onClick={() => processJson(jsonInput)}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Uygula
            </button>
          </div>

          {telemetryData && (
            <div className="h-40 bg-cyan-950/30 border border-cyan-500/30 rounded-[24px] p-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2">Telemetri</h3>
              <div className="font-mono text-[10px] text-cyan-500 overflow-y-auto h-full custom-scrollbar">
                <pre>{JSON.stringify(telemetryData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-black/40 border border-white/10 rounded-[40px] relative overflow-hidden flex flex-col">
          <div className="h-14 border-b border-white/5 flex items-center px-8 gap-6 bg-black/20">
            <button onClick={() => setActiveTab('visual')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'visual' ? 'text-cyan-400' : 'text-gray-500'}`}>Canvas</button>
            <button onClick={() => setActiveTab('logs')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'logs' ? 'text-cyan-400' : 'text-gray-500'}`}>Logs</button>
            {isProcessing && <div className="ml-auto w-32 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${simulationProgress}%` }}></div></div>}
          </div>

          <div className="flex-1 relative overflow-auto custom-scrollbar p-10">
            {activeTab === 'visual' ? (
              <div className="relative min-w-[800px] min-h-[600px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {links.map((link, i) => {
                    const from = nodes.find(n => n.id === link.fromNode);
                    const to = nodes.find(n => n.id === link.toNode);
                    if (!from || !to) return null;
                    return (
                      <path
                        key={i}
                        d={`M ${from.position[0] + 100} ${from.position[1] + 30} C ${from.position[0] + 150} ${from.position[1] + 30}, ${to.position[0] - 50} ${to.position[1] + 30}, ${to.position[0]} ${to.position[1] + 30}`}
                        stroke="rgba(6,182,212,0.2)"
                        fill="none"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute w-48 p-4 rounded-xl border transition-all ${activeNodeId === node.id ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow-lg shadow-cyan-400/20' : 'bg-white/5 border-white/10'}`}
                    style={{ left: node.position[0], top: node.position[1] }}
                  >
                    <p className="text-[10px] font-black text-white uppercase truncate">{node.name}</p>
                    <p className="text-[8px] text-gray-500 uppercase mt-1">{node.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 font-mono text-[10px]">
                {logs.map((log, i) => (
                  <div key={i} className="p-2 bg-white/5 border border-white/5 rounded text-gray-400">{log}</div>
                ))}
              </div>
            )}
          </div>

          {executionResult && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-xl shadow-cyan-500/40">
              {executionResult}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-4 backdrop-blur-xl">
        <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
          <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 leading-relaxed font-medium">
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">1. AI Tasarımı</p>
            <p>Üstteki kutucuğa yapmak istediğiniz otomasyonu (örn: haber takibi) yazın. AI sizin için JSON yapısını oluşturur.</p>
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">2. Manuel Yükleme</p>
            <p>Elinizde bir n8n veya özel iş akışı JSON verisi varsa, bunu sol panele yapıştırabilir veya direkt sayfaya sürükleyip bırakabilirsiniz.</p>
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold uppercase tracking-widest text-[9px]">3. Görsel Yürütme</p>
            <p>"Yürüt" butonuna basarak iş akışının düğüm düğüm nasıl çalıştığını ve veri akışını canlı izleyin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStudio;
