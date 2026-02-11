import React, { useState, useRef } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface VideoClip {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
  name: string;
}

interface VideoEditorProps {
  apiKeyReady: boolean;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ apiKeyReady }) => {
  const { isApiMode } = useApiMode();
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitles, setSubtitles] = useState<Array<{ time: number; text: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    
    for (let file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      const newClip: VideoClip = {
        id: Date.now().toString() + Math.random(),
        url,
        startTime: 0,
        endTime: 10, // Default 10 seconds
        name: file.name
      };
      
      setClips(prev => [...prev, newClip]);
      
      // AI ile subtitle oluştur (API modunda)
      if (isApiMode) {
        try {
          const subtitleText = await mockDataGenerators.generateChatResponse(`Generate subtitles for video: ${file.name}`);
          setSubtitles(prev => [...prev, { time: 0, text: subtitleText }]);
        } catch (error) {
          console.error('Subtitle generation failed:', error);
        }
      }
    }
    
    setIsProcessing(false);
  };

  const handleMerge = async () => {
    if (clips.length < 2) return;
    
    setIsProcessing(true);
    
    // Simüle edilmiş video birleştirme
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mergedUrl = `data:video/mp4;base64,mock_merged_video_${Date.now()}`;
    const mergedClip: VideoClip = {
      id: Date.now().toString(),
      url: mergedUrl,
      startTime: 0,
      endTime: clips.reduce((sum, clip) => sum + (clip.endTime - clip.startTime), 0),
      name: 'Merged Video'
    };
    
    setClips([mergedClip]);
    setIsProcessing(false);
  };

  const addEffect = (effect: string) => {
    // Video efekti ekleme simülasyonu
    console.log(`Adding ${effect} effect to clip ${selectedClip}`);
  };

  return (
    <div className="video-editor p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🎬 Video Editör</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mr-2"
        >
          📁 Video Yükle
        </button>
        <button
          onClick={handleMerge}
          disabled={clips.length < 2 || isProcessing}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          🔄 Birleştir
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">⏱️ Zaman Çizelgesi</h3>
        <div className="space-y-2">
          {clips.map(clip => (
            <div
              key={clip.id}
              onClick={() => setSelectedClip(clip.id)}
              className={`p-2 rounded cursor-pointer ${
                selectedClip === clip.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{clip.name}</span>
                <span>{clip.startTime}s - {clip.endTime}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Effects Panel */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">✨ Efektler</h3>
        <div className="grid grid-cols-4 gap-2">
          {['Blur', 'Brightness', 'Contrast', 'Saturation', 'Sepia', 'Grayscale', 'Fade', 'Speed'].map(effect => (
            <button
              key={effect}
              onClick={() => addEffect(effect)}
              disabled={!selectedClip}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm disabled:opacity-50"
            >
              {effect}
            </button>
          ))}
        </div>
      </div>

      {/* Subtitles */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">💬 Altyazılar</h3>
        <div className="space-y-2">
          {subtitles.map((subtitle, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded">
              <span className="text-sm text-gray-400">{subtitle.time}s:</span> {subtitle.text}
            </div>
          ))}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">İşleniyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;
