import React, { useState, useRef } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface Artwork {
  id: string;
  name: string;
  type: 'painting' | '3d' | 'nft' | 'digital';
  imageUrl: string;
  metadata: {
    created: Date;
    tools: string[];
    style: string;
    price?: number;
    blockchain?: string;
  };
}

interface DrawingTool {
  type: 'brush' | 'eraser' | 'shape' | 'text';
  size: number;
  color: string;
  opacity: number;
}

const ArtStudio: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    type: 'brush',
    size: 5,
    color: '#000000',
    opacity: 1
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [aiPrompt, setAiPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const [nftMetadata, setNftMetadata] = useState({
    name: '',
    description: '',
    price: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tools = [
    { type: 'brush', icon: '🖌️', label: 'Fırça' },
    { type: 'eraser', icon: '🧹', label: 'Silgi' },
    { type: 'shape', icon: '⭕', label: 'Şekil' },
    { type: 'text', icon: '📝', label: 'Metin' }
  ];

  const artStyles = [
    'realistic', 'abstract', 'cartoon', 'oil-painting', 'watercolor', 
    'digital-art', 'pixel-art', 'anime', 'sketch', 'sculpture'
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.globalAlpha = selectedTool.opacity;
    ctx.strokeStyle = selectedTool.color;
    ctx.lineWidth = selectedTool.size;
    ctx.lineCap = 'round';
    
    if (selectedTool.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const generateAIArt = async () => {
    if (!aiPrompt.trim()) return;
    
    // Simüle edilmiş AI sanat üretimi
    const artworkUrl = await mockDataGenerators.generateImage(aiPrompt);
    
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      name: `AI Art: ${aiPrompt}`,
      type: 'digital',
      imageUrl: artworkUrl,
      metadata: {
        created: new Date(),
        tools: ['AI', artStyle],
        style: artStyle
      }
    };
    
    setArtworks(prev => [...prev, newArtwork]);
    setAiPrompt('');
  };

  const create3DModel = async () => {
    // Simüle edilmiş 3D model oluşturma
    const modelUrl = `https://example.com/3d-model-${Date.now()}.glb`;
    
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      name: `3D Model ${artworks.length + 1}`,
      type: '3d',
      imageUrl: modelUrl,
      metadata: {
        created: new Date(),
        tools: ['3D Modeler', 'Sculptor'],
        style: '3D'
      }
    };
    
    setArtworks(prev => [...prev, newArtwork]);
  };

  const mintNFT = async (artworkId: string) => {
    const artwork = artworks.find(a => a.id === artworkId);
    if (!artwork || !nftMetadata.name) return;
    
    // Simüle edilmiş NFT mintleme
    const nftArtwork: Artwork = {
      ...artwork,
      type: 'nft',
      metadata: {
        ...artwork.metadata,
        price: nftMetadata.price,
        blockchain: 'Ethereum',
        tokenId: Math.floor(Math.random() * 1000000)
      }
    };
    
    setArtworks(prev => prev.map(a => a.id === artworkId ? nftArtwork : a));
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  };

  const saveArtwork = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL();
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      name: `Drawing ${artworks.length + 1}`,
      type: 'painting',
      imageUrl: dataUrl,
      metadata: {
        created: new Date(),
        tools: [selectedTool.type],
        style: 'digital'
      }
    };
    
    setArtworks(prev => [...prev, newArtwork]);
  };

  return (
    <div className="art-studio p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🎨 Sanat Stüdyosu</h2>
      
      {/* Drawing Tools */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🖌️ Çizim Araçları</h3>
        
        {/* Tool Selection */}
        <div className="flex gap-2 mb-4">
          {tools.map(tool => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(prev => ({ ...prev, type: tool.type as any }))}
              className={`px-3 py-2 rounded ${
                selectedTool.type === tool.type 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>
        
        {/* Tool Settings */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Boyut</label>
            <input
              type="range"
              min="1"
              max="50"
              value={selectedTool.size}
              onChange={(e) => setSelectedTool(prev => ({ ...prev, size: parseInt(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-400">{selectedTool.size}px</span>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Opaklık</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedTool.opacity}
              onChange={(e) => setSelectedTool(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-400">{Math.round(selectedTool.opacity * 100)}%</span>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Renk</label>
            <div className="flex gap-1 flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedTool(prev => ({ ...prev, color }))}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedTool.color === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Canvas Actions */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            🗑️ Temizle
          </button>
          <button
            onClick={saveArtwork}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
          >
            💾 Kaydet
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📐 Tuval</h3>
        <div className="bg-white rounded">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair"
          />
        </div>
      </div>

      {/* AI Art Generation */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🤖 AI Sanat Üretimi</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Prompt</label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Sanat eseri tanımı..."
              className="w-full bg-gray-700 px-3 py-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Stil</label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="w-full bg-gray-700 px-3 py-2 rounded"
            >
              {artStyles.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={generateAIArt}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            🎨 AI Sanat Üret
          </button>
          <button
            onClick={create3DModel}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
              🎭 3D Model Oluştur
          </button>
        </div>
      </div>

      {/* Artworks Gallery */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🖼️ Galeri</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {artworks.map(artwork => (
            <div key={artwork.id} className="bg-gray-700 p-3 rounded">
              <div className="bg-gray-600 h-32 rounded mb-2 flex items-center justify-center">
                {artwork.type === '3d' ? '🎭' : 
                 artwork.type === 'nft' ? '🪙' : 
                 <img src={artwork.imageUrl} alt={artwork.name} className="max-h-full max-w-full" />}
              </div>
              
              <div className="text-sm">
                <div className="font-medium truncate">{artwork.name}</div>
                <div className="text-gray-400">{artwork.type}</div>
                <div className="text-gray-400">{artwork.metadata.style}</div>
                
                {artwork.type === 'nft' && (
                  <div className="mt-2">
                    <div className="text-green-400">💰 {artwork.metadata.price} ETH</div>
                    <div className="text-xs text-gray-400">Token: #{artwork.metadata.tokenId}</div>
                  </div>
                )}
              </div>
              
              <div className="mt-2 flex gap-1">
                {artwork.type !== 'nft' && (
                  <button
                    onClick={() => {
                      setNftMetadata({ ...nftMetadata, name: artwork.name });
                      mintNFT(artwork.id);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
                  >
                    🪙 NFT
                  </button>
                )}
                <button className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs">
                  📥 İndir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Minting */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🪙 NFT Mintleme</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">NFT Adı</label>
            <input
              type="text"
              value={nftMetadata.name}
              onChange={(e) => setNftMetadata(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 px-3 py-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Fiyat (ETH)</label>
            <input
              type="number"
              value={nftMetadata.price}
              onChange={(e) => setNftMetadata(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full bg-gray-700 px-3 py-2 rounded"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm mb-1">Açıklama</label>
          <textarea
            value={nftMetadata.description}
            onChange={(e) => setNftMetadata(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-gray-700 px-3 py-2 rounded"
            rows={3}
            placeholder="NFT açıklaması..."
          />
        </div>
      </div>
    </div>
  );
};

export default ArtStudio;
