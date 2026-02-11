import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  avgSessionDuration: number;
}

interface UsageMetrics {
  apiCalls: number;
  messagesSent: number;
  filesUploaded: number;
  videosGenerated: number;
  audioProcessed: number;
}

interface PerformanceMetrics {
  responseTime: number;
  uptime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  growth: number;
  users: number;
}

interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

const AnalyticsDashboard: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['users', 'api', 'performance']);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const metrics = [
    { id: 'users', label: '👥 Kullanıcılar', icon: '👥' },
    { id: 'api', label: '🌐 API Kullanımı', icon: '🌐' },
    { id: 'performance', label: '⚡ Performans', icon: '⚡' },
    { id: 'features', label: '🚀 Özellikler', icon: '🚀' },
    { id: 'revenue', label: '💰 Gelir', icon: '💰' },
    { id: 'engagement', label: '📱 Etkileşim', icon: '📱' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user metrics
    const mockUserMetrics: UserMetrics = {
      totalUsers: 15420,
      activeUsers: 8934,
      newUsers: 1247,
      retentionRate: 78.5,
      avgSessionDuration: 1247 // seconds
    };
    setUserMetrics(mockUserMetrics);

    // Mock usage metrics
    const mockUsageMetrics: UsageMetrics = {
      apiCalls: 1247834,
      messagesSent: 89234,
      filesUploaded: 12478,
      videosGenerated: 3421,
      audioProcessed: 8934
    };
    setUsageMetrics(mockUsageMetrics);

    // Mock performance metrics
    const mockPerformanceMetrics: PerformanceMetrics = {
      responseTime: 234, // ms
      uptime: 99.97, // %
      errorRate: 0.12, // %
      throughput: 1247, // requests/sec
      memoryUsage: 67.8 // %
    };
    setPerformanceMetrics(mockPerformanceMetrics);

    // Mock feature usage
    const mockFeatureUsage: FeatureUsage[] = [
      { feature: 'AI Sohbet', usage: 45678, growth: 23.4, users: 8934 },
      { feature: 'Video Üretim', usage: 12478, growth: 45.6, users: 3421 },
      { feature: 'Ses İşleme', usage: 8934, growth: 12.3, users: 2147 },
      { feature: 'Veri Analizi', usage: 5678, growth: 67.8, users: 1234 },
      { feature: 'Otomasyon', usage: 3456, growth: 34.5, users: 890 }
    ];
    setFeatureUsage(mockFeatureUsage);

    // Mock time series data
    const mockTimeSeriesData: TimeSeriesData[] = [];
    const now = new Date();
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      mockTimeSeriesData.push({
        timestamp: date,
        value: Math.floor(Math.random() * 1000) + 500,
        label: date.toLocaleDateString()
      });
    }
    setTimeSeriesData(mockTimeSeriesData);
    
    setIsLoading(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPerformanceColor = (value: number, type: string): string => {
    switch (type) {
      case 'responseTime':
        return value < 500 ? 'text-green-400' : value < 1000 ? 'text-yellow-400' : 'text-red-400';
      case 'uptime':
        return value > 99.5 ? 'text-green-400' : value > 99 ? 'text-yellow-400' : 'text-red-400';
      case 'errorRate':
        return value < 1 ? 'text-green-400' : value < 5 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const exportReport = () => {
    const report = {
      userMetrics,
      usageMetrics,
      performanceMetrics,
      featureUsage,
      timeRange,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timeRange}-${Date.now()}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="analytics-dashboard p-6 bg-gray-900 text-white rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-4">Analytics yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard p-6 bg-gray-900 text-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📈 Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-800 px-3 py-2 rounded"
          >
            <option value="24h">Son 24 Saat</option>
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            🔄 Yenile
          </button>
          <button
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            📊 Rapor İndir
          </button>
        </div>
      </div>

      {/* Metrics Selection */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📊 Metrikler</h3>
        <div className="grid grid-cols-3 gap-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetrics(prev => 
                prev.includes(metric.id)
                  ? prev.filter(m => m !== metric.id)
                  : [...prev, metric.id]
              )}
              className={`p-3 rounded text-left ${
                selectedMetrics.includes(metric.id)
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{metric.icon}</span>
                <span>{metric.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Metrics */}
      {selectedMetrics.includes('users') && userMetrics && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">👥 Kullanıcı Metrikleri</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(userMetrics.totalUsers)}</div>
              <div className="text-sm text-gray-400">Toplam Kullanıcı</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(userMetrics.activeUsers)}</div>
              <div className="text-sm text-gray-400">Aktif Kullanıcı</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{userMetrics.retentionRate}%</div>
              <div className="text-sm text-gray-400">Retention Oranı</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">+{formatNumber(userMetrics.newUsers)}</div>
              <div className="text-sm text-gray-400">Yeni Kullanıcı</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatDuration(userMetrics.avgSessionDuration)}</div>
              <div className="text-sm text-gray-400">Ort. Oturum Süresi</div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Metrics */}
      {selectedMetrics.includes('api') && usageMetrics && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">🌐 Kullanım Metrikleri</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(usageMetrics.apiCalls)}</div>
              <div className="text-sm text-gray-400">API Çağrıları</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(usageMetrics.messagesSent)}</div>
              <div className="text-sm text-gray-400">Gönderilen Mesaj</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(usageMetrics.videosGenerated)}</div>
              <div className="text-sm text-gray-400">Üretilen Video</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(usageMetrics.audioProcessed)}</div>
              <div className="text-sm text-gray-400">İşlenen Ses</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(usageMetrics.filesUploaded)}</div>
              <div className="text-sm text-gray-400">Yüklenen Dosya</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {selectedMetrics.includes('performance') && performanceMetrics && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">⚡ Performans Metrikleri</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.responseTime, 'responseTime')}`}>
                {performanceMetrics.responseTime}ms
              </div>
              <div className="text-sm text-gray-400">Ortalama Yanıt Süresi</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.uptime, 'uptime')}`}>
                {performanceMetrics.uptime}%
              </div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.errorRate, 'errorRate')}`}>
                {performanceMetrics.errorRate}%
              </div>
              <div className="text-sm text-gray-400">Hata Oranı</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{formatNumber(performanceMetrics.throughput)}</div>
              <div className="text-sm text-gray-400">Throughput (req/s)</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold">{performanceMetrics.memoryUsage}%</div>
              <div className="text-sm text-gray-400">Bellek Kullanımı</div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Usage */}
      {selectedMetrics.includes('features') && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">🚀 Özellik Kullanımı</h3>
          <div className="space-y-2">
            {featureUsage.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{feature.feature}</div>
                    <div className="text-sm text-gray-400">
                      {formatNumber(feature.usage)} kullanım • {formatNumber(feature.users)} kullanıcı
                    </div>
                  </div>
                  <div className={`font-medium ${getGrowthColor(feature.growth)}`}>
                    {feature.growth > 0 ? '+' : ''}{feature.growth}%
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-600 h-2 rounded-full">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(feature.usage / 500, 1) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📈 Zaman Serisi</h3>
        <div className="bg-gray-700 p-8 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>Zaman Serisi Grafiği</div>
            <div className="text-sm text-gray-400 mt-2">
              {timeSeriesData.length} veri noktası
            </div>
            <div className="mt-4 space-y-1">
              {timeSeriesData.slice(0, 5).map((point, index) => (
                <div key={index} className="text-xs text-gray-400">
                  {point.label}: {point.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
