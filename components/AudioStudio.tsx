import React, { useState, useRef } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  type: 'voice' | 'music' | 'effect';
  volume: number;
  startTime: number;
}

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  tracks: AudioTrack[];
  coverImage?: string;
}

const AudioStudio: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [musicPrompt, setMusicPrompt] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const newTrack: AudioTrack = {
          id: Date.now().toString(),
          name: `Recording ${Date.now()}`,
          url,
          type: 'voice',
          volume: 1,
          startTime: currentTime
        };
        setTracks(prev => [...prev, newTrack]);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const generateMusic = async () => {
    if (!musicPrompt.trim()) return;
    
    // Simüle edilmiş müzik üretimi
    const musicUrl = await mockDataGenerators.generateChatResponse(`Generate music for: ${musicPrompt}`);
    const newTrack: AudioTrack = {
      id: Date.now().toString(),
      name: `AI Music: ${musicPrompt}`,
      url: `data:audio/wav;base64,mock_music_${Date.now()}`,
      type: 'music',
      volume: 0.5,
      startTime: currentTime
    };
    
    setTracks(prev => [...prev, newTrack]);
    setMusicPrompt('');
  };

  const addEffect = (effectType: string) => {
    console.log(`Adding ${effectType} effect to track ${selectedTrack}`);
  };

  const createPodcast = () => {
    const newPodcast: PodcastEpisode = {
      id: Date.now().toString(),
      title: `Podcast ${podcasts.length + 1}`,
      description: 'AI generated podcast episode',
      tracks: [...tracks],
      coverImage: `https://picsum.photos/300/300?random=${Date.now()}`
    };
    
    setPodcasts(prev => [...prev, newPodcast]);
    setTracks([]);
  };

  const soundEffects = [
    'Applause', 'Thunder', 'Rain', 'Wind', 'Birds', 'Traffic', 'Ocean', 'Fire'
  ];

  return (
    <div className="audio-studio p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🎵 Ses Stüdyosu</h2>
      
      {/* Recording Controls */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🎙️ Kayıt</h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-lg ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? '⏹️ Dur' : '🎤 Kaydet'}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            {isPlaying ? '⏸️ Duraklat' : '▶️ Oynat'}
          </button>
        </div>
        
        {/* Timeline */}
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-sm text-gray-400">Süre: {currentTime}s</div>
          <div className="w-full bg-gray-600 h-2 rounded-full mt-1">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(currentTime / 300) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Music Generation */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🎹 AI Müzik Üretimi</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={musicPrompt}
            onChange={(e) => setMusicPrompt(e.target.value)}
            placeholder="Müzik tarzını描述 edin (örn: 'huzurlu piyano')"
            className="flex-1 bg-gray-700 px-3 py-2 rounded"
          />
          <button
            onClick={generateMusic}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            🎼 Üret
          </button>
        </div>
      </div>

      {/* Tracks List */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📼 Parçalar</h3>
        <div className="space-y-2">
          {tracks.map(track => (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`p-3 rounded cursor-pointer ${
                selectedTrack === track.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{track.name}</span>
                  <span className="ml-2 text-sm text-gray-400">
                    {track.type === 'voice' ? '🎤' : track.type === 'music' ? '🎵' : '🔊'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={track.volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, volume: newVolume } : t
                      ));
                    }}
                    className="w-20"
                  />
                  <span className="text-sm">{Math.round(track.volume * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Effects */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">🔊 Ses Efektleri</h3>
        <div className="grid grid-cols-4 gap-2">
          {soundEffects.map(effect => (
            <button
              key={effect}
              onClick={() => addEffect(effect)}
              className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm"
            >
              {effect}
            </button>
          ))}
        </div>
      </div>

      {/* Podcast Creation */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📻 Podcast Oluştur</h3>
        <button
          onClick={createPodcast}
          disabled={tracks.length === 0}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          🎙️ Podcast Oluştur
        </button>
        
        {/* Podcast Episodes */}
        <div className="mt-4 space-y-2">
          {podcasts.map(podcast => (
            <div key={podcast.id} className="bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-3">
                <img src={podcast.coverImage} alt={podcast.title} className="w-12 h-12 rounded" />
                <div>
                  <div className="font-medium">{podcast.title}</div>
                  <div className="text-sm text-gray-400">{podcast.tracks.length} parça</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioStudio;
