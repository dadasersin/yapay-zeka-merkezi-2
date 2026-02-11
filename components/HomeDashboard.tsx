import React, { useState, useEffect } from 'react';
import { WorkspaceView } from '../types';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
  component: string;
  stats?: {
    users: number;
    usage: number;
    growth: number;
  };
}

const HomeDashboard: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 15420,
    activeProjects: 893,
    apiCalls: 1247834,
    uptime: 99.97
  });

  const allFeatures: FeatureCard[] = [
    // AI & Chat
    {
      id: 'chat',
      title: 'AI Sohbet',
      description: 'Multi-provider AI ile akıllı sohbet',
      icon: '💬',
      category: 'ai',
      isNew: false,
      isPopular: true,
      component: 'ChatView',
      stats: { users: 8934, usage: 45678, growth: 23.4 }
    },
    {
      id: 'multimodal',
      title: 'Multi-Modal AI',
      description: 'Görüntü, ses, metin birleştirme',
      icon: '🧠',
      category: 'ai',
      isNew: true,
      isPopular: true,
      component: 'MultiModalAI',
      stats: { users: 3421, usage: 12478, growth: 67.8 }
    },
    
    // Media & Content
    {
      id: 'video',
      title: 'Video Üretim',
      description: 'AI ile video oluşturma ve düzenleme',
      icon: '🎬',
      category: 'media',
      isNew: false,
      isPopular: true,
      component: 'VideoView',
      stats: { users: 5678, usage: 23456, growth: 45.6 }
    },
    {
      id: 'video-editor',
      title: 'Video Editör',
      description: 'Profesyonel video düzenleme',
      icon: '✂️',
      category: 'media',
      isNew: true,
      isPopular: false,
      component: 'VideoEditor',
      stats: { users: 1234, usage: 5678, growth: 89.2 }
    },
    {
      id: 'audio',
      title: 'Ses Stüdyosu',
      description: 'Podcast ve müzik üretimi',
      icon: '🎵',
      category: 'media',
      isNew: true,
      isPopular: false,
      component: 'AudioStudio',
      stats: { users: 2147, usage: 8934, growth: 34.5 }
    },
    {
      id: 'creative',
      title: 'Görsel Üretim',
      description: 'AI ile görsel oluşturma',
      icon: '🎨',
      category: 'media',
      isNew: false,
      isPopular: true,
      component: 'CreativeView',
      stats: { users: 7890, usage: 34567, growth: 12.3 }
    },
    {
      id: 'art-studio',
      title: 'Sanat Stüdyosu',
      description: 'Dijital sanat ve NFT',
      icon: '🖼️',
      category: 'media',
      isNew: true,
      isPopular: false,
      component: 'ArtStudio',
      stats: { users: 890, usage: 3456, growth: 123.4 }
    },
    
    // Data & Analytics
    {
      id: 'analytics',
      title: 'Veri Analizi',
      description: 'AI destekli veri analizi',
      icon: '📊',
      category: 'data',
      isNew: true,
      isPopular: true,
      component: 'DataAnalytics',
      stats: { users: 3456, usage: 12478, growth: 78.9 }
    },
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Kapsamlı metrikler ve raporlar',
      icon: '📈',
      category: 'data',
      isNew: true,
      isPopular: false,
      component: 'AnalyticsDashboard',
      stats: { users: 1234, usage: 5678, growth: 45.6 }
    },
    
    // Development & Automation
    {
      id: 'workflow',
      title: 'İş Akış Stüdyosu',
      description: 'Otomasyon ve iş akışları',
      icon: '⚙️',
      category: 'dev',
      isNew: false,
      isPopular: true,
      component: 'WorkflowStudio',
      stats: { users: 4567, usage: 23456, growth: 23.4 }
    },
    {
      id: 'automation',
      title: 'Otomasyon Akışları',
      description: 'Webhook ve zamanlayıcılar',
      icon: '🔄',
      category: 'dev',
      isNew: true,
      isPopular: false,
      component: 'AutomationStudio',
      stats: { users: 890, usage: 3456, growth: 156.7 }
    },
    {
      id: 'game-dev',
      title: 'Oyun Geliştirme',
      description: 'Level editör ve AI karakterler',
      icon: '🎮',
      category: 'dev',
      isNew: true,
      isPopular: false,
      component: 'GameDevStudio',
      stats: { users: 567, usage: 2345, growth: 234.5 }
    },
    
    // Collaboration & Communication
    {
      id: 'team',
      title: 'Ekip Çalışması',
      description: 'Gerçek zamanlı işbirliği',
      icon: '👥',
      category: 'collab',
      isNew: true,
      isPopular: true,
      component: 'TeamCollaboration',
      stats: { users: 6789, usage: 45678, growth: 67.8 }
    },
    {
      id: 'chat-advanced',
      title: 'Gelişmiş Sohbet',
      description: 'Sesli/görüntülü görüşme',
      icon: '💬',
      category: 'collab',
      isNew: true,
      isPopular: false,
      component: 'AdvancedChat',
      stats: { users: 2345, usage: 12345, growth: 89.3 }
    },
    
    // Integration & Security
    {
      id: 'integrations',
      title: 'Entegrasyonlar',
      description: 'Dış servis bağlantıları',
      icon: '🔗',
      category: 'tools',
      isNew: true,
      isPopular: false,
      component: 'IntegrationsHub',
      stats: { users: 1234, usage: 5678, growth: 45.6 }
    },
    {
      id: 'security',
      title: 'Güvenlik Merkezi',
      description: '2FA, API anahtarları, audit',
      icon: '🔐',
      category: 'tools',
      isNew: true,
      isPopular: false,
      component: 'SecurityCenter',
      stats: { users: 3456, usage: 12478, growth: 34.5 }
    },
    {
      id: 'social',
      title: 'Sosyal Medya',
      description: 'Otomatik paylaşım ve planlama',
      icon: '📢',
      category: 'tools',
      isNew: true,
      isPopular: false,
      component: 'SocialMediaManager',
      stats: { users: 890, usage: 3456, growth: 123.4 }
    },
    
    // Existing Features
    {
      id: 'live',
      title: 'Canlı Yayın',
      description: 'AI destekli canlı yayın',
      icon: '📹',
      category: 'media',
      isNew: false,
      isPopular: false,
      component: 'LiveView',
      stats: { users: 1234, usage: 5678, growth: 12.3 }
    },
    {
      id: 'crypto',
      title: 'Kripto',
      description: 'Blockchain analiz',
      icon: '₿',
      category: 'data',
      isNew: false,
      isPopular: false,
      component: 'CryptoView',
      stats: { users: 567, usage: 2345, growth: 8.9 }
    },
    {
      id: 'request',
      title: 'API İstek',
      description: 'API test ve analiz',
      icon: '🌐',
      category: 'dev',
      isNew: false,
      isPopular: false,
      component: 'RequestView',
      stats: { users: 890, usage: 3456, growth: 15.6 }
    },
    {
      id: 'builder',
      title: 'Builder',
      description: 'Kod üretici',
      icon: '🔧',
      category: 'dev',
      isNew: false,
      isPopular: false,
      component: 'BuilderView',
      stats: { users: 456, usage: 1234, growth: 23.4 }
    },
    {
      id: 'system',
      title: 'Sistem',
      description: 'Sistem bilgileri',
      icon: '⚙️',
      category: 'tools',
      isNew: false,
      isPopular: false,
      component: 'SystemView',
      stats: { users: 234, usage: 567, growth: 5.6 }
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🌟' },
    { id: 'ai', name: 'AI & Sohbet', icon: '🤖' },
    { id: 'media', name: 'Medya & İçerik', icon: '🎬' },
    { id: 'data', name: 'Veri & Analiz', icon: '📊' },
    { id: 'dev', name: 'Geliştirme', icon: '⚙️' },
    { id: 'collab', name: 'İşbirliği', icon: '👥' },
    { id: 'tools', name: 'Araçlar', icon: '🔧' }
  ];

  useEffect(() => {
    // Mock recent activity
    const activities = [
      '🎬 Video üretimi tamamlandı',
      '💬 Yeni mesaj geldi',
      '📊 Analiz raporu hazır',
      '👥 Ekip üyesi katıldı',
      '🔄 Otomasyon çalıştı',
      '🔐 Güvenlik taraması yapıldı'
    ];
    
    setRecentActivity(activities);
  }, []);

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getGrowthColor = (growth: number) => {
    if (growth > 50) return 'text-green-400';
    if (growth > 20) return 'text-blue-400';
    if (growth > 0) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="home-dashboard p-6 bg-gray-900 text-white rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🚀 Quantum AI Merkezi</h1>
        <p className="text-gray-400">
          Yapay zeka destekli kapsamlı platform - 15+ özellik ile tam entegre çözüm
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👥</span>
            <div>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Toplam Kullanıcı</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📁</span>
            <div>
              <div className="text-2xl font-bold">{systemStats.activeProjects.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Aktif Proje</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌐</span>
            <div>
              <div className="text-2xl font-bold">{(systemStats.apiCalls / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-400">API Çağrı</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-2xl font-bold">{systemStats.uptime}%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Özellik ara..."
            className="w-full bg-gray-800 px-4 py-2 rounded-lg"
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {filteredFeatures.map(feature => (
          <div key={feature.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                {feature.isNew && (
                  <span className="bg-green-600 text-xs px-2 py-1 rounded">YENİ</span>
                )}
                {feature.isPopular && (
                  <span className="bg-blue-600 text-xs px-2 py-1 rounded">POPÜLER</span>
                )}
              </div>
            </div>
            
            {feature.stats && (
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div>
                  <div className="text-gray-400">Kullanıcı</div>
                  <div className="font-medium">{feature.stats.users.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Kullanım</div>
                  <div className="font-medium">{feature.stats.usage.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Büyüme</div>
                  <div className={`font-medium ${getGrowthColor(feature.stats.growth)}`}>
                    +{feature.stats.growth}%
                  </div>
                </div>
              </div>
            )}
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Aç
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📊 Son Aktivite</h3>
        <div className="grid grid-cols-3 gap-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded text-sm">
              {activity}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 text-center text-gray-400">
        <p>
          🎯 <strong>{allFeatures.length}</strong> özellik • 
          🚀 <strong>{allFeatures.filter(f => f.isNew).length}</strong> yenilik • 
          ⭐ <strong>{allFeatures.filter(f => f.isPopular).length}</strong> popüler
        </p>
      </div>
    </div>
  );
};

export default HomeDashboard;
