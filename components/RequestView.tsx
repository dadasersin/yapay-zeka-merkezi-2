
import React, { useState, useEffect } from 'react';
import { SystemRequest } from '../types';

const RequestView: React.FC = () => {
  const [requests, setRequests] = useState<SystemRequest[]>([]);

  const loadTasks = () => {
    const saved = localStorage.getItem('quantum_tasks');
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      // Mock initial data if empty
      const initial: SystemRequest[] = [
        { id: '#1024', topic: 'Quantum API Analizi', date: '28.01', status: 'warning', statusText: 'Bekliyor', priority: 'high' },
        { id: '#1023', topic: 'Neon Tema Entegrasyonu', date: '28.01', status: 'success', statusText: 'Tamamlandı', priority: 'medium' },
      ];
      setRequests(initial);
      localStorage.setItem('quantum_tasks', JSON.stringify(initial));
    }
  };

  useEffect(() => {
    loadTasks();
    const handleUpdate = () => loadTasks();
    window.addEventListener('tasksUpdated', handleUpdate);
    return () => window.removeEventListener('tasksUpdated', handleUpdate);
  }, []);

  const toggleStatus = (id: string) => {
    const updated = requests.map(r => {
      if (r.id === id) {
        const isDone = r.status === 'success';
        return {
          ...r,
          status: isDone ? 'warning' : 'success' as 'warning' | 'success',
          statusText: isDone ? 'Bekliyor' : 'Tamamlandı'
        };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('quantum_tasks', JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    localStorage.setItem('quantum_tasks', JSON.stringify(updated));
  };

  const clearDone = () => {
    const updated = requests.filter(r => r.status !== 'success');
    setRequests(updated);
    localStorage.setItem('quantum_tasks', JSON.stringify(updated));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Görev & İstek Yönetimi</h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">Asistan tarafından oluşturulan tüm direktifler</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={clearDone}
            className="px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 text-xs"
          >
            Tamamlananları Temizle
          </button>
          <button 
            onClick={() => {
              const topic = prompt("Yeni görev nedir?");
              if (topic) {
                const tasks = [...requests];
                tasks.unshift({
                  id: `#${Math.floor(1000 + Math.random() * 9000)}`,
                  topic,
                  date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
                  status: 'warning',
                  statusText: 'Bekliyor',
                  priority: 'medium'
                });
                setRequests(tasks);
                localStorage.setItem('quantum_tasks', JSON.stringify(tasks));
              }
            }}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-500/20 text-xs"
          >
            Manuel Ekle
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Görev / Direktif</th>
              <th className="px-6 py-4">Öncelik</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">Eylem</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold uppercase tracking-widest">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-600 italic">Görev listesi boş. Chat üzerinden görev atayabilirsin.</td>
              </tr>
            ) : requests.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="px-6 py-6 text-cyan-400 italic font-mono">{r.id}</td>
                <td className={`px-6 py-6 ${r.status === 'success' ? 'text-gray-600 line-through' : 'text-gray-200'}`}>
                  {r.topic}
                </td>
                <td className="px-6 py-6">
                  <span className={`text-[9px] px-2 py-0.5 rounded border ${
                    r.priority === 'high' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                    r.priority === 'medium' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                    'border-blue-500/50 text-blue-400 bg-blue-500/10'
                  }`}>
                    {r.priority || 'medium'}
                  </span>
                </td>
                <td className="px-6 py-6 text-gray-500">{r.date}</td>
                <td className="px-6 py-6">
                  <button 
                    onClick={() => toggleStatus(r.id)}
                    className={`px-3 py-1 rounded-lg text-[9px] transition-all ${
                      r.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      r.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    } border`}
                  >
                    <i className={`fas ${r.status === 'success' ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                    {r.statusText}
                  </button>
                </td>
                <td className="px-6 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteTask(r.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors px-3 py-1"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestView;
