import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  apiRateLimit: number;
  encryptionEnabled: boolean;
  auditLogEnabled: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'api_call' | 'file_access' | 'permission_change';
  userId: string;
  userName: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
  rateLimit: number;
}

const SecurityCenter: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    apiRateLimit: 100,
    encryptionEnabled: true,
    auditLogEnabled: true
  });
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);

  const permissions = [
    'read_messages', 'write_messages', 'delete_messages',
    'read_files', 'write_files', 'delete_files',
    'manage_users', 'manage_api_keys', 'view_analytics',
    'admin_access'
  ];

  const eventTypes = [
    { value: 'login', label: '🔓 Giriş', color: 'text-green-400' },
    { value: 'failed_login', label: '🚫 Başarısız Giriş', color: 'text-red-400' },
    { value: 'api_call', label: '🌐 API Çağrı', color: 'text-blue-400' },
    { value: 'file_access', label: '📁 Dosya Erişimi', color: 'text-yellow-400' },
    { value: 'permission_change', label: '👥 Yetki Değişikliği', color: 'text-purple-400' }
  ];

  useEffect(() => {
    // Mock security events
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        userId: '1',
        userName: 'Ahmet Yılmaz',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/120.0',
        details: 'Başarılı giriş',
        severity: 'low'
      },
      {
        id: '2',
        type: 'failed_login',
        userId: 'unknown',
        userName: 'Bilinmeyen',
        timestamp: new Date(Date.now() - 7200000),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0',
        details: 'Hatalı şifre',
        severity: 'medium'
      },
      {
        id: '3',
        type: 'api_call',
        userId: '2',
        userName: 'Ayşe Kaya',
        timestamp: new Date(Date.now() - 1800000),
        ipAddress: '192.168.1.102',
        userAgent: 'Python/3.9',
        details: 'AI API çağrısı',
        severity: 'low'
      }
    ];
    setEvents(mockEvents);

    // Mock API keys
    const mockApiKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk-1234567890abcdef',
        permissions: ['read_messages', 'write_messages', 'read_files'],
        createdAt: new Date(Date.now() - 86400000),
        lastUsed: new Date(Date.now() - 3600000),
        isActive: true,
        rateLimit: 100
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'sk-abcdef1234567890',
        permissions: ['read_messages', 'view_analytics'],
        createdAt: new Date(Date.now() - 172800000),
        isActive: true,
        rateLimit: 50
      }
    ];
    setApiKeys(mockApiKeys);

    calculateSecurityScore();
  }, []);

  const calculateSecurityScore = () => {
    let score = 0;
    
    if (settings.twoFactorEnabled) score += 20;
    if (settings.encryptionEnabled) score += 20;
    if (settings.auditLogEnabled) score += 15;
    if (settings.sessionTimeout <= 30) score += 10;
    if (settings.apiRateLimit <= 100) score += 15;
    if (settings.ipWhitelist.length > 0) score += 10;
    
    setSecurityScore(score);
  };

  const generateApiKey = async () => {
    setIsGeneratingKey(true);
    
    // Simulate API key generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      permissions: selectedPermissions,
      createdAt: new Date(),
      isActive: true,
      rateLimit: 100
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewApiKey(newKey.key);
    setSelectedPermissions([]);
    setIsGeneratingKey(false);
  };

  const revokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isActive: false } : key
    ));
  };

  const deleteApiKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const addIpToWhitelist = (ip: string) => {
    if (!ip.trim() || settings.ipWhitelist.includes(ip)) return;
    setSettings(prev => ({
      ...prev,
      ipWhitelist: [...prev.ipWhitelist, ip]
    }));
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(i => i !== ip)
    }));
  };

  const getSecurityScoreColor = () => {
    if (securityScore >= 80) return 'text-green-400';
    if (securityScore >= 60) return 'text-yellow-400';
    if (securityScore >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="security-center p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🔐 Güvenlik Merkezi</h2>
      
      {/* Security Score */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🛡️ Güvenlik Skoru</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">
            <span className={getSecurityScoreColor()}>{securityScore}%</span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-700 h-4 rounded-full">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  securityScore >= 80 ? 'bg-green-500' :
                  securityScore >= 60 ? 'bg-yellow-500' :
                  securityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {securityScore >= 80 ? 'Mükemmel' :
               securityScore >= 60 ? 'İyi' :
               securityScore >= 40 ? 'Orta' : 'Zayıf'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">⚙️ Güvenlik Ayarları</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>İki Faktörlü Kimlik Doğrulama</span>
              <button
                onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                className={`px-3 py-1 rounded ${
                  settings.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {settings.twoFactorEnabled ? '✅' : '❌'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Şifreleme</span>
              <button
                onClick={() => setSettings(prev => ({ ...prev, encryptionEnabled: !prev.encryptionEnabled }))}
                className={`px-3 py-1 rounded ${
                  settings.encryptionEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {settings.encryptionEnabled ? '✅' : '❌'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Audit Log</span>
              <button
                onClick={() => setSettings(prev => ({ ...prev, auditLogEnabled: !prev.auditLogEnabled }))}
                className={`px-3 py-1 rounded ${
                  settings.auditLogEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {settings.auditLogEnabled ? '✅' : '❌'}
              </button>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Oturum Zaman Aşımı (dakika)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 px-3 py-2 rounded"
                min="5"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">API Rate Limit (saat başına)</label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 px-3 py-2 rounded"
                min="10"
                max="1000"
              />
            </div>
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🌐 IP Beyaz Liste</h3>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="IP adresi ekle..."
                className="flex-1 bg-gray-700 px-3 py-2 rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addIpToWhitelist((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="IP adresi ekle..."]') as HTMLInputElement;
                  addIpToWhitelist(input.value);
                  input.value = '';
                }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
              >
                Ekle
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {settings.ipWhitelist.map(ip => (
              <div key={ip} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span>{ip}</span>
                <button
                  onClick={() => removeIpFromWhitelist(ip)}
                  className="text-red-400 hover:text-red-300"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🔑 API Anahtarları</h3>
        
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {permissions.map(permission => (
              <button
                key={permission}
                onClick={() => togglePermission(permission)}
                className={`px-2 py-1 rounded text-sm ${
                  selectedPermissions.includes(permission)
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {permission.replace('_', ' ')}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateApiKey}
              disabled={isGeneratingKey || selectedPermissions.length === 0}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {isGeneratingKey ? '🔄 Oluşturuluyor...' : '🔑 Anahtar Oluştur'}
            </button>
          </div>
          
          {newApiKey && (
            <div className="bg-gray-700 p-3 rounded mt-3">
              <div className="text-sm text-gray-400 mb-1">Yeni API Anahtarı:</div>
              <div className="font-mono text-sm break-all">{newApiKey}</div>
              <div className="text-xs text-red-400 mt-1">Bu anahtarı güvenli bir yere kaydedin!</div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {apiKeys.map(key => (
            <div key={key.id} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{key.name}</div>
                  <div className="font-mono text-sm text-gray-400">
                    {key.key.substring(0, 10)}...
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Oluşturuldu: {key.createdAt.toLocaleDateString()}
                    {key.lastUsed && ` • Son kullanım: ${key.lastUsed.toLocaleDateString()}`}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {key.permissions.map(permission => (
                      <span key={permission} className="bg-gray-600 px-2 py-1 rounded text-xs">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    key.isActive ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {key.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  {key.isActive ? (
                    <button
                      onClick={() => revokeApiKey(key.id)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      ⏸️
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📊 Güvenlik Olayları</h3>
        
        <div className="space-y-2">
          {events.map(event => {
            const eventType = eventTypes.find(t => t.value === event.type);
            return (
              <div key={event.id} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={eventType?.color}>{eventType?.label}</span>
                      <span className={`text-xs ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-medium">{event.userName}</div>
                    <div className="text-sm text-gray-400">{event.details}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.ipAddress} • {event.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
