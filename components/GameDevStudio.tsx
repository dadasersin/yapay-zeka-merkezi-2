import React, { useState, useRef, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface GameObject {
  id: string;
  type: 'player' | 'enemy' | 'item' | 'wall' | 'npc';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    health?: number;
    speed?: number;
    color?: string;
    dialogue?: string[];
    behavior?: 'patrol' | 'chase' | 'static' | 'random';
  };
}

interface GameLevel {
  id: string;
  name: string;
  width: number;
  height: number;
  objects: GameObject[];
  spawnPoint: { x: number; y: number };
  objectives: string[];
}

interface GameCharacter {
  id: string;
  name: string;
  type: 'hero' | 'villain' | 'neutral';
  appearance: {
    sprite: string;
    color: string;
    size: number;
  };
  personality: string[];
  backstory: string;
  abilities: string[];
}

const GameDevStudio: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [characters, setCharacters] = useState<GameCharacter[]>([]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'player' | 'enemy' | 'wall' | 'item' | 'npc'>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [characterPrompt, setCharacterPrompt] = useState('');
  const [levelName, setLevelName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const tools = [
    { type: 'select', icon: '👆', label: 'Seç' },
    { type: 'player', icon: '🦸', label: 'Oyuncu' },
    { type: 'enemy', icon: '👾', label: 'Düşman' },
    { type: 'wall', icon: '🧱', label: 'Duvar' },
    { type: 'item', icon: '💎', label: 'Eşya' },
    { type: 'npc', icon: '🤖', label: 'NPC' }
  ];

  const createLevel = () => {
    if (!levelName.trim()) return;
    
    const newLevel: GameLevel = {
      id: Date.now().toString(),
      name: levelName,
      width: 800,
      height: 600,
      objects: [],
      spawnPoint: { x: 50, y: 50 },
      objectives: ['Finish the level']
    };
    
    setLevels(prev => [...prev, newLevel]);
    setSelectedLevel(newLevel.id);
    setLevelName('');
  };

  const generateAICharacter = async () => {
    if (!characterPrompt.trim()) return;
    
    // Simüle edilmiş AI karakter üretimi
    const characterTraits = ['brave', 'curious', 'mysterious', 'funny', 'serious', 'wise'];
    const abilities = ['jump', 'shoot', 'shield', 'teleport', 'invisible', 'heal'];
    
    const newCharacter: GameCharacter = {
      id: Date.now().toString(),
      name: `AI Character: ${characterPrompt}`,
      type: Math.random() > 0.5 ? 'hero' : 'neutral',
      appearance: {
        sprite: 'character.png',
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        size: 32
      },
      personality: [
        characterTraits[Math.floor(Math.random() * characterTraits.length)],
        characterTraits[Math.floor(Math.random() * characterTraits.length)]
      ],
      backstory: `Generated from prompt: ${characterPrompt}`,
      abilities: [
        abilities[Math.floor(Math.random() * abilities.length)],
        abilities[Math.floor(Math.random() * abilities.length)]
      ]
    };
    
    setCharacters(prev => [...prev, newCharacter]);
    setCharacterPrompt('');
  };

  const addObjectToLevel = (x: number, y: number) => {
    if (!selectedLevel || selectedTool === 'select') return;
    
    const newObject: GameObject = {
      id: Date.now().toString(),
      type: selectedTool as any,
      x,
      y,
      width: selectedTool === 'wall' ? 50 : 32,
      height: selectedTool === 'wall' ? 50 : 32,
      properties: getDefaultObjectProperties(selectedTool as any)
    };
    
    setLevels(prev => prev.map(level => 
      level.id === selectedLevel 
        ? { ...level, objects: [...level.objects, newObject] }
        : level
    ));
  };

  const getDefaultObjectProperties = (type: GameObject['type']) => {
    switch (type) {
      case 'player':
        return { health: 100, speed: 5, color: '#00FF00' };
      case 'enemy':
        return { health: 50, speed: 2, color: '#FF0000', behavior: 'patrol' };
      case 'wall':
        return { color: '#808080' };
      case 'item':
        return { color: '#FFFF00' };
      case 'npc':
        return { color: '#00FFFF', dialogue: ['Hello!', 'How can I help?'], behavior: 'static' };
      default:
        return {};
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !selectedLevel) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addObjectToLevel(x, y);
  };

  const startGame = () => {
    setIsPlaying(true);
    gameLoop();
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const gameLoop = () => {
    if (!isPlaying || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);
    
    // Draw level objects
    const level = levels.find(l => l.id === selectedLevel);
    if (level) {
      level.objects.forEach(obj => {
        ctx.fillStyle = obj.properties.color || '#FFFFFF';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        
        // Draw object type indicator
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const symbol = obj.type === 'player' ? 'P' : 
                      obj.type === 'enemy' ? 'E' : 
                      obj.type === 'wall' ? 'W' : 
                      obj.type === 'item' ? 'I' : 'N';
        ctx.fillText(symbol, obj.x + obj.width/2, obj.y + obj.height/2 + 4);
      });
    }
    
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const exportGame = () => {
    const gameData = {
      levels,
      characters,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-${Date.now()}.json`;
    a.click();
  };

  useEffect(() => {
    if (isPlaying) {
      gameLoop();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, selectedLevel]);

  return (
    <div className="game-dev-studio p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🎮 Oyun Geliştirme</h2>
      
      {/* Level Management */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🗺️ Level'ler</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="Level adı..."
              className="bg-gray-700 px-3 py-1 rounded"
            />
            <button
              onClick={createLevel}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              ➕ Level Ekle
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-3 py-1 rounded ${
                selectedLevel === level.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
        
        {/* Game Controls */}
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? stopGame : startGame}
            disabled={!selectedLevel}
            className={`px-3 py-1 rounded ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {isPlaying ? '⏹️ Dur' : '▶️ Oyna'}
          </button>
          
          <select
            value={gameSpeed}
            onChange={(e) => setGameSpeed(parseFloat(e.target.value))}
            className="bg-gray-700 px-3 py-1 rounded"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
          </select>
          
          <button
            onClick={exportGame}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
          >
            📦 Dışa Aktar
          </button>
        </div>
      </div>

      {/* Level Editor */}
      {selectedLevel && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">🛠️ Level Editör</h3>
          
          {/* Tool Selection */}
          <div className="flex gap-2 mb-4">
            {tools.map(tool => (
              <button
                key={tool.type}
                onClick={() => setSelectedTool(tool.type as any)}
                className={`px-3 py-2 rounded ${
                  selectedTool === tool.type 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {tool.icon} {tool.label}
              </button>
            ))}
          </div>
          
          {/* Canvas */}
          <div className="bg-gray-700 p-4 rounded">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="bg-white cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          <div className="text-sm text-gray-400 mt-2">
            Tıklayarak nesneler ekleyin. Seçili araç: {tools.find(t => t.type === selectedTool)?.label}
          </div>
        </div>
      )}

      {/* AI Character Generator */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🤖 AI Karakter Üretici</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={characterPrompt}
            onChange={(e) => setCharacterPrompt(e.target.value)}
            placeholder="Karakter tanımı (örn: 'cesur bir şövalye')"
            className="flex-1 bg-gray-700 px-3 py-2 rounded"
          />
          <button
            onClick={generateAICharacter}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            🎭 Karakter Üret
          </button>
        </div>
        
        {/* Characters List */}
        <div className="grid grid-cols-3 gap-4">
          {characters.map(character => (
            <div key={character.id} className="bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: character.appearance.color }}
                />
                <div>
                  <div className="font-medium text-sm">{character.name}</div>
                  <div className="text-xs text-gray-400">{character.type}</div>
                </div>
              </div>
              
              <div className="text-xs">
                <div className="mb-1">
                  <span className="text-gray-400">Kişilik:</span> {character.personality.join(', ')}
                </div>
                <div className="mb-1">
                  <span className="text-gray-400">Yetenekler:</span> {character.abilities.join(', ')}
                </div>
                <div className="text-gray-400 truncate">
                  {character.backstory}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Objects */}
      {selectedLevel && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">📦 Level Nesneleri</h3>
          
          <div className="space-y-2">
            {levels.find(l => l.id === selectedLevel)?.objects.map(obj => (
              <div key={obj.id} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                <div>
                  <span className="font-medium">{obj.type.toUpperCase()}</span>
                  <span className="ml-2 text-sm text-gray-400">
                    ({obj.x}, {obj.y}) - {obj.width}x{obj.height}
                  </span>
                </div>
                <div className="flex gap-2">
                  {obj.properties.health && (
                    <span className="text-sm">❤️ {obj.properties.health}</span>
                  )}
                  {obj.properties.speed && (
                    <span className="text-sm">⚡ {obj.properties.speed}</span>
                  )}
                  {obj.properties.behavior && (
                    <span className="text-sm">🎯 {obj.properties.behavior}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDevStudio;
