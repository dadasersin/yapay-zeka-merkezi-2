import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  content: string;
  media?: string[];
  hashtags: string[];
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  createdAt: Date;
  postedAt?: Date;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  avatar: string;
  followers: number;
  isConnected: boolean;
  lastPosted?: Date;
}

interface ContentCalendar {
  id: string;
  date: Date;
  posts: SocialPost[];
  theme?: string;
}

const SocialMediaManager: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [calendar, setCalendar] = useState<ContentCalendar[]>([]);
  const [newPost, setNewPost] = useState({
    platform: 'twitter' as const,
    content: '',
    hashtags: '',
    scheduledTime: '',
    media: [] as string[]
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: '🐦', maxLength: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxLength: 3000 },
    { id: 'instagram', name: 'Instagram', icon: '📷', maxLength: 2200 },
    { id: 'facebook', name: 'Facebook', icon: '📘', maxLength: 63206 }
  ];

  const contentTemplates = [
    '🚀 Yeni özellik yayında! {feature} hakkında ne düşünüyorsunuz?',
    '💡 Bu hafta öğrendiklerimizi paylaşalım: {insight}',
    '🎯 Hedeflerimize bir adım daha yaklaştık! {achievement}',
    '🤖 AI ile neler yapılabileceğini gösteriyoruz! {demo}',
    '📊 Analizlerimiz şunu gösteriyor: {data}'
  ];

  useEffect(() => {
    // Mock social accounts
    const mockAccounts: SocialAccount[] = [
      {
        id: '1',
        platform: 'Twitter',
        username: '@quantum_ai',
        avatar: '🐦',
        followers: 12478,
        isConnected: true,
        lastPosted: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        platform: 'LinkedIn',
        username: 'quantum-ai-company',
        avatar: '💼',
        followers: 8934,
        isConnected: true
      },
      {
        id: '3',
        platform: 'Instagram',
        username: '@quantum_ai_official',
        avatar: '📷',
        followers: 45678,
        isConnected: false
      }
    ];
    setAccounts(mockAccounts);

    // Mock posts
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'twitter',
        content: '🚀 Yeni AI video üretim özelliğimiz yayında! Denemek için hemen siteyi ziyaret edin. #AI #Video #Teknoloji',
        hashtags: ['AI', 'Video', 'Teknoloji'],
        status: 'posted',
        engagement: { likes: 234, shares: 45, comments: 12 },
        createdAt: new Date(Date.now() - 7200000),
        postedAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        platform: 'linkedin',
        content: '💡 Yapay zeka destekli veri analizi platformumuzla iş verimliliğinizi artırın. Detaylı raporlar ve AI içgörüleri bekliyor.',
        hashtags: ['YapayZeka', 'VeriAnalizi', 'İş'],
        status: 'scheduled',
        scheduledTime: new Date(Date.now() + 86400000),
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdAt: new Date()
      }
    ];
    setPosts(mockPosts);

    // Mock calendar
    const mockCalendar: ContentCalendar[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      mockCalendar.push({
        id: Date.now().toString() + i,
        date,
        posts: i === 0 ? [mockPosts[1]] : [],
        theme: i === 0 ? 'Product Launch' : undefined
      });
    }
    setCalendar(mockCalendar);
  }, []);

  const generateContent = async () => {
    setIsGeneratingContent(true);
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
    const generatedContent = template
      .replace('{feature}', 'gelişmiş video editörü')
      .replace('{insight}', 'AI kullanımının %45 arttığı')
      .replace('{achievement}', '10K kullanıcı hedefine ulaştık')
      .replace('{demo}', 'yeni multi-modal AI özelliklerimiz')
      .replace('{data}', 'kullanıcı memnuniyeti %92');
    
    setNewPost(prev => ({ ...prev, content: generatedContent }));
    setIsGeneratingContent(false);
  };

  const createPost = async () => {
    if (!newPost.content.trim()) return;
    
    const post: SocialPost = {
      id: Date.now().toString(),
      platform: newPost.platform,
      content: newPost.content,
      hashtags: newPost.hashtags.split(' ').filter(h => h.trim()),
      scheduledTime: newPost.scheduledTime ? new Date(newPost.scheduledTime) : undefined,
      status: newPost.scheduledTime ? 'scheduled' : 'draft',
      engagement: { likes: 0, shares: 0, comments: 0 },
      createdAt: new Date()
    };
    
    setPosts(prev => [post, ...prev]);
    
    // Reset form
    setNewPost({
      platform: 'twitter',
      content: '',
      hashtags: '',
      scheduledTime: '',
      media: []
    });
  };

  const publishPost = async (postId: string) => {
    setIsPosting(true);
    
    // Simulate posting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            status: 'posted', 
            postedAt: new Date(),
            engagement: {
              likes: Math.floor(Math.random() * 100),
              shares: Math.floor(Math.random() * 50),
              comments: Math.floor(Math.random() * 25)
            }
          }
        : post
    ));
    
    setIsPosting(false);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const getPlatformIcon = (platform: string) => {
    const p = platforms.find(pl => pl.id === platform);
    return p?.icon || '📱';
  };

  const getStatusColor = (status: SocialPost['status']) => {
    switch (status) {
      case 'posted': return 'text-green-400';
      case 'scheduled': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(post => post.platform === selectedPlatform);

  const totalEngagement = posts.reduce((sum, post) => 
    sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
  );

  return (
    <div className="social-media-manager p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">📢 Sosyal Medya Yönetimi</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold">{posts.length}</div>
          <div className="text-sm text-gray-400">Toplam Gönderi</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Toplam Etkileşim</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold">
            {accounts.filter(a => a.isConnected).length}
          </div>
          <div className="text-sm text-gray-400">Bağlı Hesap</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold">
            {posts.filter(p => p.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-400">Planlanmış</div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">📱 Bağlı Hesaplar</h3>
        <div className="grid grid-cols-3 gap-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{account.avatar}</span>
                <div className="flex-1">
                  <div className="font-medium">{account.platform}</div>
                  <div className="text-sm text-gray-400">@{account.username}</div>
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  account.isConnected ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
              <div className="text-sm text-gray-400">
                {account.followers.toLocaleString()} takipçi
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Create Post */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">✍️ Gönderi Oluştur</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Platform</label>
              <select
                value={newPost.platform}
                onChange={(e) => setNewPost(prev => ({ ...prev, platform: e.target.value as any }))}
                className="w-full bg-gray-700 px-3 py-2 rounded"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.icon} {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">İçerik</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Gönderi içeriği..."
                className="w-full bg-gray-700 px-3 py-2 rounded"
                rows={4}
                maxLength={platforms.find(p => p.id === newPost.platform)?.maxLength}
              />
              <div className="text-xs text-gray-400 mt-1">
                {newPost.content.length} / {platforms.find(p => p.id === newPost.platform)?.maxLength}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Hashtag'ler</label>
              <input
                type="text"
                value={newPost.hashtags}
                onChange={(e) => setNewPost(prev => ({ ...prev, hashtags: e.target.value }))}
                placeholder="#AI #Teknoloji"
                className="w-full bg-gray-700 px-3 py-2 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Planlama (opsiyonel)</label>
              <input
                type="datetime-local"
                value={newPost.scheduledTime}
                onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full bg-gray-700 px-3 py-2 rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={generateContent}
                disabled={isGeneratingContent}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm disabled:opacity-50"
              >
                {isGeneratingContent ? '🔄 Üretiliyor...' : '🤖 İçerik Üret'}
              </button>
              <button
                onClick={createPost}
                disabled={!newPost.content.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm disabled:opacity-50"
              >
                ✅ Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">📋 Gönderiler</h3>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-gray-700 px-3 py-1 rounded text-sm"
            >
              <option value="all">Tüm Platformlar</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span>{getPlatformIcon(post.platform)}</span>
                    <span className={`text-xs ${getStatusColor(post.status)}`}>
                      {post.status === 'posted' && '✅ Yayınlandı'}
                      {post.status === 'scheduled' && '⏰ Planlandı'}
                      {post.status === 'draft' && '📝 Taslak'}
                      {post.status === 'failed' && '❌ Başarısız'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {post.status === 'draft' && (
                      <button
                        onClick={() => publishPost(post.id)}
                        disabled={isPosting}
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        {isPosting ? '🔄' : '📤'}
                      </button>
                    )}
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="text-sm mb-2">{post.content}</div>
                
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.hashtags.map((tag, index) => (
                      <span key={index} className="bg-gray-600 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {post.scheduledTime && (
                  <div className="text-xs text-blue-400 mb-2">
                    ⏰ {post.scheduledTime.toLocaleString()}
                  </div>
                )}
                
                {post.status === 'posted' && (
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>❤️ {post.engagement.likes}</span>
                    <span>🔄 {post.engagement.shares}</span>
                    <span>💬 {post.engagement.comments}</span>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  {post.createdAt.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">📅 İçerik Takvimi</h3>
        
        <div className="grid grid-cols-7 gap-2">
          {calendar.map((day, index) => (
            <div key={day.id} className="bg-gray-700 p-3 rounded">
              <div className="text-sm font-medium mb-1">
                {day.date.toLocaleDateString('tr', { weekday: 'short' })}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {day.date.getDate()}
              </div>
              
              {day.theme && (
                <div className="text-xs text-blue-400 mb-2">
                  🎯 {day.theme}
                </div>
              )}
              
              <div className="space-y-1">
                {day.posts.map(post => (
                  <div key={post.id} className="text-xs bg-gray-600 p-1 rounded">
                    {getPlatformIcon(post.platform)} {post.platform}
                  </div>
                ))}
              </div>
              
              {day.posts.length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  Gönderi yok
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManager;
