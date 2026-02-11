import React, { useState } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface AutomationTrigger {
  id: string;
  type: 'webhook' | 'schedule' | 'email' | 'manual';
  config: any;
}

interface AutomationAction {
  id: string;
  type: 'send_email' | 'api_call' | 'create_file' | 'notification';
  config: any;
}

interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
  lastRun?: Date;
}

const AutomationStudio: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowDescription, setNewFlowDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);

  const triggerTypes = [
    { value: 'webhook', label: '🔗 Webhook', description: 'HTTP isteği ile tetikle' },
    { value: 'schedule', label: '⏰ Zamanlayıcı', description: 'Belirli zamanlarda çalış' },
    { value: 'email', label: '📧 E-posta', description: 'E-posta ile tetikle' },
    { value: 'manual', label: '👆 Manuel', description: 'Elle çalıştır' }
  ];

  const actionTypes = [
    { value: 'send_email', label: '📧 E-posta Gönder', description: 'E-posta gönder' },
    { value: 'api_call', label: '🌐 API Çağrı', description: 'Dış API çağır' },
    { value: 'create_file', label: '📄 Dosya Oluştur', description: 'Dosya oluştur' },
    { value: 'notification', label: '🔔 Bildirim', description: 'Bildirim gönder' }
  ];

  const createFlow = () => {
    if (!newFlowName.trim()) return;
    
    const newFlow: AutomationFlow = {
      id: Date.now().toString(),
      name: newFlowName,
      description: newFlowDescription,
      triggers: [],
      actions: [],
      isActive: false,
      createdAt: new Date()
    };
    
    setFlows(prev => [...prev, newFlow]);
    setSelectedFlow(newFlow.id);
    setNewFlowName('');
    setNewFlowDescription('');
    setIsCreating(false);
  };

  const addTrigger = (flowId: string, type: AutomationTrigger['type']) => {
    const trigger: AutomationTrigger = {
      id: Date.now().toString(),
      type,
      config: getDefaultTriggerConfig(type)
    };
    
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, triggers: [...flow.triggers, trigger] }
        : flow
    ));
  };

  const addAction = (flowId: string, type: AutomationAction['type']) => {
    const action: AutomationAction = {
      id: Date.now().toString(),
      type,
      config: getDefaultActionConfig(type)
    };
    
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, actions: [...flow.actions, action] }
        : flow
    ));
  };

  const getDefaultTriggerConfig = (type: AutomationTrigger['type']) => {
    switch (type) {
      case 'webhook':
        return { url: '', method: 'POST', headers: {} };
      case 'schedule':
        return { frequency: 'daily', time: '09:00', timezone: 'UTC' };
      case 'email':
        return { address: '', subject: '', keywords: [] };
      case 'manual':
        return {};
      default:
        return {};
    }
  };

  const getDefaultActionConfig = (type: AutomationAction['type']) => {
    switch (type) {
      case 'send_email':
        return { to: '', subject: '', body: '', attachments: [] };
      case 'api_call':
        return { url: '', method: 'POST', headers: {}, body: {} };
      case 'create_file':
        return { name: '', content: '', format: 'txt' };
      case 'notification':
        return { title: '', message: '', channels: ['web'] };
      default:
        return {};
    }
  };

  const toggleFlow = (flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, isActive: !flow.isActive }
        : flow
    ));
  };

  const testFlow = async (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;
    
    setTestResults(prev => [...prev, `🧪 Testing flow: ${flow.name}`]);
    
    // Simüle edilmiş test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResults(prev => [...prev, `✅ Flow test completed successfully`]);
    setTestResults(prev => [...prev, `📊 ${flow.triggers.length} triggers processed`]);
    setTestResults(prev => [...prev, `⚡ ${flow.actions.length} actions executed`]);
  };

  const deleteFlow = (flowId: string) => {
    setFlows(prev => prev.filter(flow => flow.id !== flowId));
    if (selectedFlow === flowId) {
      setSelectedFlow(null);
    }
  };

  const generateWebhookUrl = (flowId: string) => {
    const url = `https://api.quantum-ai.com/webhook/${flowId}`;
    setWebhookUrl(url);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="automation-studio p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🔄 Otomasyon Akışları</h2>
      
      {/* Create New Flow */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">⚡ Akışlar</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            ➕ Yeni Akış
          </button>
        </div>
        
        {isCreating && (
          <div className="bg-gray-700 p-4 rounded mb-4">
            <input
              type="text"
              placeholder="Akış Adı"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              className="w-full bg-gray-600 px-3 py-2 rounded mb-2"
            />
            <textarea
              placeholder="Açıklama"
              value={newFlowDescription}
              onChange={(e) => setNewFlowDescription(e.target.value)}
              className="w-full bg-gray-600 px-3 py-2 rounded mb-2"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={createFlow}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                ✅ Oluştur
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
              >
                ❌ İptal
              </button>
            </div>
          </div>
        )}
        
        {/* Flow List */}
        <div className="space-y-2">
          {flows.map(flow => (
            <div
              key={flow.id}
              onClick={() => setSelectedFlow(flow.id)}
              className={`p-3 rounded cursor-pointer flex justify-between items-center ${
                selectedFlow === flow.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div>
                <div className="font-medium">{flow.name}</div>
                <div className="text-sm text-gray-400">
                  {flow.triggers.length} tetikleyici, {flow.actions.length} eylem
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  flow.isActive ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {flow.isActive ? '🟢 Aktif' : '⚪ Pasif'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlow(flow.id);
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {flow.isActive ? '⏸️' : '▶️'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlow(flow.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flow Editor */}
      {selectedFlow && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              📝 {flows.find(f => f.id === selectedFlow)?.name}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => testFlow(selectedFlow)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
              >
                🧪 Test Et
              </button>
              <button
                onClick={() => generateWebhookUrl(selectedFlow)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                🔗 Webhook URL
              </button>
            </div>
          </div>
          
          {/* Triggers */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">🎯 Tetikleyiciler</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {triggerTypes.map(trigger => (
                <button
                  key={trigger.value}
                  onClick={() => addTrigger(selectedFlow, trigger.value as any)}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-left"
                >
                  <div>{trigger.label}</div>
                  <div className="text-xs text-gray-400">{trigger.description}</div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              {flows.find(f => f.id === selectedFlow)?.triggers.map(trigger => (
                <div key={trigger.id} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                  <span>{triggerTypes.find(t => t.value === trigger.type)?.label}</span>
                  <button className="text-red-400 hover:text-red-300">❌</button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div>
            <h4 className="font-medium mb-3">⚡ Eylemler</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {actionTypes.map(action => (
                <button
                  key={action.value}
                  onClick={() => addAction(selectedFlow, action.value as any)}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-left"
                >
                  <div>{action.label}</div>
                  <div className="text-xs text-gray-400">{action.description}</div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              {flows.find(f => f.id === selectedFlow)?.actions.map(action => (
                <div key={action.id} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                  <span>{actionTypes.find(a => a.value === action.type)?.label}</span>
                  <button className="text-red-400 hover:text-red-300">❌</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">📊 Test Sonuçları</h3>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm bg-gray-700 p-2 rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhook URL Display */}
      {webhookUrl && (
        <div className="bg-green-900 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold mb-2">🔗 Webhook URL</h3>
          <div className="bg-gray-800 p-2 rounded font-mono text-sm break-all">
            {webhookUrl}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            ✅ Panoya kopyalandı!
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationStudio;
