
import React from 'react';

const SystemView: React.FC = () => {
  const modules = [
    { name: 'Neural Reasoning', status: 'Optimal', load: '42%', color: 'text-cyan-400' },
    { name: 'Creative Synthesis', status: 'Active', load: '18%', color: 'text-purple-400' },
    { name: 'Temporal Processing', status: 'Standby', load: '0%', color: 'text-blue-400' },
    { name: 'Jules External Sync', status: 'Connected', load: '100%', color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Core Online & Synced</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-4">Autonomous Intelligence</h2>
          <p className="text-gray-400 max-w-2xl leading-relaxed mb-10">
            Yapay Zeka Merkezi operates with full authorization. System is currently linked to <span className="text-cyan-400">Jules Session Protocol</span> for enhanced high-level reasoning and global grounding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((m, i) => (
              <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{m.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg ${m.color}`}>{m.status}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-black italic text-white">{m.load}</div>
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-current ${m.color}`} style={{ width: m.load }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-6 flex items-center gap-3">
            <i className="fas fa-terminal text-cyan-400"></i>
            Command Execution Log
          </h3>
          <div className="space-y-4 font-mono text-[11px] text-gray-500">
            <div className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
              <span className="text-cyan-500">[14:22:01]</span>
              <span className="text-gray-300">USER_AUTH_LEVEL: MASTER</span>
            </div>
            <div className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
              <span className="text-cyan-500">[14:25:12]</span>
              <span className="text-emerald-400 italic font-bold">JULES_SESSION: INITIALIZING EXTERNAL HANDSHAKE...</span>
            </div>
            <div className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
              <span className="text-cyan-500">[14:25:15]</span>
              <span className="text-emerald-500 font-bold">LINK_ESTABLISHED: REMOTE_ACCESS_GRANTED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-[40px] p-10 relative overflow-hidden h-full">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-8">AI Overrides</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Self-Modification</p>
                <p className="text-[10px] text-gray-500 uppercase">Allow AI to rewrite UI</p>
              </div>
              <div className="w-12 h-6 bg-cyan-600 rounded-full relative shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Global Search</p>
                <p className="text-[10px] text-gray-500 uppercase">Real-time data streams</p>
              </div>
              <div className="w-12 h-6 bg-cyan-600 rounded-full relative shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Session Sync</p>
                <p className="text-[10px] text-gray-500 uppercase">Jules external link</p>
              </div>
              <div className="w-12 h-6 bg-emerald-600 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Remote Notice</p>
            <p className="text-[11px] text-gray-400 italic">
              "System is now optimized for external session bridging. Your environment and Jules protocols are fully aligned."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemView;
