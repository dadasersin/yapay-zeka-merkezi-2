import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface Integration {
  id: string;
  name: string;
  type: 'storage' | 'communication' | 'development' | 'social' | 'analytics';
  icon: string;
  description: string;
  isConnected: boolean;
  apiKey?: string;
  settings: Record<string, any>;
  lastSync?: Date;
  usage: {
    requests: number;
    lastUsed?: Date;
  };
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: Date;
  lastTriggered?: Date;
}

const IntegrationsHub: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] as string[] });

  const availableIntegrations: Omit<Integration, 'id' | 'isConnected' | 'usage'>[] = [
    {
      name: 'Google Drive',
      type: 'storage',
      icon: '📁',
      description: 'Dosya depolama ve paylaşım',
      settings: { folderId: '', autoSync: true }
    },
    {
      name: 'Dropbox',
      type: 'storage',
      icon: '📦',
      description: 'Bulut depolama servisi',
      settings: { appKey: '', appSecret: '' }
    },
    {
      name: 'Slack',
      type: 'communication',
      icon: '💬',
      description: 'Ekip iletişim platformu',
      settings: { workspace: '', channel: '#general' }
    },
    {
      name: 'Discord',
      type: 'communication',
      icon: '🎮',
      description: 'Topluluk iletişim platformu',
      settings: { serverId: '', channelId: '' }
    },
    {
      name: 'GitHub',
      type: 'development',
      icon: '🐙',
      description: 'Kod versiyon kontrolü',
      settings: { repository: '', branch: 'main' }
    },
    {
      name: 'GitLab',
      type: 'development',
      icon: '🦊',
      description: 'CI/CD ve kod yönetimi',
      settings: { projectId: '', instanceUrl: '' }
    },
    {
      name: 'Twitter',
      type: 'social',
      icon: '🐦',
      description: 'Sosyal medya paylaşım',
      settings: { handle: '', autoPost: false }
    },
    {
      name: 'LinkedIn',
      type: 'social',
      icon: '💼',
      description: 'Profesyonel ağ',
      settings: { profileId: '', shareMode: 'public' }
    }
  ];

  const availableEvents = [
    'user.created',
    'file.uploaded',
    'message.sent',
    'video.generated',
    'api.called',
    'error.occurred',
    'user.login',
    'project.created'
  ];

  useEffect(() => {
    // Mock connected integrations
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        ...availableIntegrations[0], // Google Drive
        isConnected: true,
        apiKey: 'mock-google-key',
        lastSync: new Date(),
        usage: { requests: 1247, lastUsed: new Date() }
      },
      {
        id: '2',
        ...availableIntegrations[2], // Slack
        isConnected: true,
        apiKey: 'xoxb-mock-slack-token',
        usage: { requests: 892, lastUsed: new Date() }
      },
      {
        id: '3',
        ...availableIntegrations[4], // GitHub
        isConnected: false,
        usage: { requests: 0 }
      }
    ];
    setIntegrations(mockIntegrations);

    // Mock webhooks
    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'User Activity Logger',
        url: 'https://api.example.com/webhooks/user-activity',
        events: ['user.created', 'user.login'],
        isActive: true,
        secret: 'webhook-secret-123',
        createdAt: new Date(Date.now() - 86400000),
        lastTriggered: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        name: 'File Backup',
        url: 'https://backup.example.com/webhook',
        events: ['file.uploaded'],
        isActive: false,
        createdAt: new Date(Date.now() - 172800000)
      }
    ];
    setWebhooks(mockWebhooks);
  }, []);

  const connectIntegration = async (integrationIndex: number) => {
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const integration = availableIntegrations[integrationIndex];
    const newIntegration: Integration = {
      id: Date.now().toString(),
      ...integration,
      isConnected: true,
      apiKey: `mock-${integration.name.toLowerCase().replace(' ', '-')}-key`,
      lastSync: new Date(),
      usage: { requests: 0 }
    };
    
    setIntegrations(prev => [...prev, newIntegration]);
    setIsConnecting(false);
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, isConnected: false, apiKey: undefined }
        : integration
    ));
  };

  const syncIntegration = async (integrationId: string) => {
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            lastSync: new Date(),
            usage: { 
              ...integration.usage, 
              requests: integration.usage.requests + 1,
              lastUsed: new Date()
            }
          }
        : integration
    ));
  };

  const createWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) return;
    
    const webhook: Webhook = {
      id: Date.now().toString(),
      ...newWebhook,
      isActive: true,
      secret: Math.random().toString(36).substr(2, 16),
      createdAt: new Date()
    };
    
    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({ name: '', url: '', events: [] });
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, isActive: !webhook.isActive }
        : webhook
    ));
  };

  const deleteWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
  };

  const toggleEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const testWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;
    
    // Simulate webhook test
    console.log(`Testing webhook: ${webhook.name}`);
    alert(`Webhook test edildi: ${webhook.name}`);
  };

  const getTypeIcon = (type: Integration['type']) => {
    switch (type) {
      case 'storage': return '📁';
      case 'communication': return '💬';
      case 'development': return '🐙';
      case 'social': return '🐦';
      case 'analytics': return '📊';
      default: return '🔗';
    }
  };

  return (
    <div className="integrations-hub p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🔗 Entegrasyon Merkezi</h2>
      
      {/* Available Integrations */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🔧 Mevcut Entegrasyonlar</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {availableIntegrations.map((integration, index) => {
            const isConnected = integrations.some(i => 
              i.name === integration.name && i.isConnected
            );
            
            return (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-gray-400">{integration.description}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    isConnected ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {isConnected ? '✅ Bağlı' : '❌ Bağlı Değil'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {!isConnected ? (
                    <button
                      onClick={() => connectIntegration(index)}
                      disabled={isConnecting}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      {isConnecting ? '🔄 Bağlanıyor...' : '🔗 Bağlan'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const integration = integrations.find(i => i.name === integration.name);
                          if (integration) syncIntegration(integration.id);
                        }}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        🔄 Sync
                      </button>
                      <button
                        onClick={() => {
                          const integration = integrations.find(i => i.name === integration.name);
                          if (integration) disconnectIntegration(integration.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        ❌ Bağlantıyı Kes
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">✅ Bağlı Entegrasyonlar</h3>
        
        <div className="space-y-3">
          {integrations.filter(i => i.isConnected).map(integration => (
            <div key={integration.id} className="bg-gray-700 p-4 rounded">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-gray-400">{integration.description}</div>
                  </div>
                </div>
                <span className="text-green-400">✅ Aktif</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">API Key:</span>
                  <div className="font-mono">{integration.apiKey?.substring(0, 10)}...</div>
                </div>
                <div>
                  <span className="text-gray-400">Son Sync:</span>
                  <div>{integration.lastSync?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-400">Kullanım:</span>
                  <div>{integration.usage.requests} istek</div>
                </div>
                <div>
                  <span className="text-gray-400">Son Kullanım:</span>
                  <div>{integration.usage.lastUsed?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🪝 Webhook'lar</h3>
        
        {/* Create Webhook */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <h4 className="font-medium mb-3">➕ Yeni Webhook</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm mb-1">İsim</label>
              <input
                type="text"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Webhook adı..."
                className="w-full bg-gray-600 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">URL</label>
              <input
                type="url"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/webhook"
                className="w-full bg-gray-600 px-3 py-2 rounded"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Olaylar</label>
            <div className="grid grid-cols-4 gap-2">
              {availableEvents.map(event => (
                <button
                  key={event}
                  onClick={() => toggleEvent(event)}
                  className={`px-2 py-1 rounded text-xs ${
                    newWebhook.events.includes(event)
                      ? 'bg-blue-600'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={createWebhook}
            disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
          >
            ➕ Webhook Oluştur
          </button>
        </div>
        
        {/* Webhooks List */}
        <div className="space-y-3">
          {webhooks.map(webhook => (
            <div key={webhook.id} className="bg-gray-700 p-4 rounded">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{webhook.name}</div>
                  <div className="text-sm text-gray-400">{webhook.url}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Oluşturuldu: {webhook.createdAt.toLocaleDateString()}
                    {webhook.lastTriggered && ` • Son tetikleme: ${webhook.lastTriggered.toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    webhook.isActive ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {webhook.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  <button
                    onClick={() => toggleWebhook(webhook.id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {webhook.isActive ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => testWebhook(webhook.id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    🧪
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {webhook.events.map(event => (
                  <span key={event} className="bg-gray-600 px-2 py-1 rounded text-xs">
                    {event}
                  </span>
                ))}
              </div>
              
              {webhook.secret && (
                <div className="mt-2 text-xs text-gray-400">
                  Secret: {webhook.secret.substring(0, 8)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;
