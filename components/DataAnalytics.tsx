import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface DataPoint {
  id: string;
  label: string;
  value: number;
  timestamp: Date;
}

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: DataPoint[];
}

interface Dashboard {
  id: string;
  name: string;
  charts: ChartConfig[];
  createdAt: Date;
}

const DataAnalytics: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const [dataQuery, setDataQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const generateSampleData = (type: string): DataPoint[] => {
    const data: DataPoint[] = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      data.push({
        id: `${type}-${i}`,
        label: `${type} ${i + 1}`,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date(now.getTime() - (9 - i) * 24 * 60 * 60 * 1000)
      });
    }
    
    return data;
  };

  const createChart = (type: ChartConfig['type']) => {
    const newChart: ChartConfig = {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      data: generateSampleData(type)
    };

    if (selectedDashboard) {
      setDashboards(prev => prev.map(dashboard => 
        dashboard.id === selectedDashboard 
          ? { ...dashboard, charts: [...dashboard.charts, newChart] }
          : dashboard
      ));
    }
  };

  const createDashboard = () => {
    const newDashboard: Dashboard = {
      id: Date.now().toString(),
      name: `Dashboard ${dashboards.length + 1}`,
      charts: [],
      createdAt: new Date()
    };
    
    setDashboards(prev => [...prev, newDashboard]);
    setSelectedDashboard(newDashboard.id);
  };

  const analyzeData = async () => {
    if (!dataQuery.trim() || uploadedData.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // AI ile veri analizi simülasyonu
      const insights = [
        "Veri setinde %15 artış trendi tespit edildi.",
        "En yüksek değer Salı günlerinde görülüyor.",
        "Ay sonunda düşüş öngörülüyor.",
        "Anomali tespiti: 3 veri noktası normal aralığın dışında.",
        "Korelasyon: X ve Y değişkenleri arasında %73 ilişki var."
      ];
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simüle edilmiş veri yükleme
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      category: `Category ${Math.floor(Math.random() * 5) + 1}`,
      value: Math.floor(Math.random() * 1000),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Data point ${i + 1}`
    }));
    
    setUploadedData(mockData);
  };

  const generateReport = async () => {
    const reportContent = `
# Veri Analizi Raporu

## Özet
Toplam ${uploadedData.length} veri noktası analiz edildi.

## Temel İstatistikler
- Ortalama: ${(uploadedData.reduce((sum, item) => sum + item.value, 0) / uploadedData.length).toFixed(2)}
- Maksimum: ${Math.max(...uploadedData.map(item => item.value))}
- Minimum: ${Math.min(...uploadedData.map(item => item.value))}

## AI İçgörüleri
${aiInsights.map(insight => `- ${insight}`).join('\n')}

## Öneriler
1. Trenddeki artış devam ederse, kapasite planlaması yapılmalıdır.
2. Anomali noktaları ayrıntılı incelenmelidir.
3. Yüksek korelasyonlu değişkenler birlikte analiz edilmelidir.

Oluşturulma: ${new Date().toLocaleString()}
    `;
    
    // Rapor indirme simülasyonu
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-analysis-report-${Date.now()}.md`;
    a.click();
  };

  const chartTypes: ChartConfig['type'][] = ['line', 'bar', 'pie', 'scatter'];

  return (
    <div className="data-analytics p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">📊 Veri Analizi</h2>
      
      {/* Dashboard Management */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📈 Dashboard'lar</h3>
          <button
            onClick={createDashboard}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            ➕ Yeni Dashboard
          </button>
        </div>
        
        <div className="flex gap-2">
          {dashboards.map(dashboard => (
            <button
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard.id)}
              className={`px-3 py-1 rounded ${
                selectedDashboard === dashboard.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {dashboard.name}
            </button>
          ))}
        </div>
      </div>

      {/* Data Upload */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📁 Veri Yükle</h3>
        <input
          type="file"
          accept=".csv,.json,.xlsx"
          onChange={handleFileUpload}
          className="mb-3"
        />
        {uploadedData.length > 0 && (
          <div className="text-sm text-gray-400">
            {uploadedData.length} veri noktası yüklendi
          </div>
        )}
      </div>

      {/* Chart Creation */}
      {selectedDashboard && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">📊 Grafik Oluştur</h3>
          <div className="grid grid-cols-4 gap-2">
            {chartTypes.map(type => (
              <button
                key={type}
                onClick={() => createChart(type)}
                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🤖 AI Analizi</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={dataQuery}
            onChange={(e) => setDataQuery(e.target.value)}
            placeholder="Veri hakkında soru sorun (örn: 'En trend kategori hangisi?')"
            className="flex-1 bg-gray-700 px-3 py-2 rounded"
          />
          <button
            onClick={analyzeData}
            disabled={isAnalyzing || uploadedData.length === 0}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {isAnalyzing ? '🔄 Analiz Ediliyor...' : '🔍 Analiz Et'}
          </button>
        </div>
        
        {aiInsights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">💡 AI İçgörüleri:</h4>
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                {insight}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Display */}
      {selectedDashboard && dashboards.find(d => d.id === selectedDashboard)?.charts.map((chart, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-3">{chart.title}</h4>
          <div className="bg-gray-700 p-8 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">
                {chart.type === 'line' && '📈'}
                {chart.type === 'bar' && '📊'}
                {chart.type === 'pie' && '🥧'}
                {chart.type === 'scatter' && '⚡'}
              </div>
              <div>{chart.type.toUpperCase()} Chart</div>
              <div className="text-sm mt-2">{chart.data.length} data points</div>
            </div>
          </div>
        </div>
      ))}

      {/* Report Generation */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📄 Rapor Oluştur</h3>
        <button
          onClick={generateReport}
          disabled={uploadedData.length === 0 || aiInsights.length === 0}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
        >
          📥 Rapor İndir
        </button>
      </div>
    </div>
  );
};

export default DataAnalytics;
