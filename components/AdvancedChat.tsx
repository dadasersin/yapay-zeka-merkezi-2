import React, { useState, useRef, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  isTyping: boolean;
}

interface VoiceCall {
  id: string;
  participants: string[];
  startTime: Date;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct' | 'channel';
  participants: string[];
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  reactions: { emoji: string; users: string[] }[];
  replyTo?: string;
}

const AdvancedChat: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<VoiceCall | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👏', '🙏'];

  useEffect(() => {
    // Mock data
    const mockUsers: ChatUser[] = [
      { id: '1', name: 'Sen', avatar: '👤', status: 'online', isTyping: false },
      { id: '2', name: 'Ayşe', avatar: '👩', status: 'online', isTyping: false },
      { id: '3', name: 'Mehmet', avatar: '👨', status: 'away', isTyping: false },
      { id: '4', name: 'Zeynep', avatar: '👩‍💼', status: 'offline', isTyping: false }
    ];
    setUsers(mockUsers);

    const mockRooms: ChatRoom[] = [
      {
        id: '1',
        name: 'Genel Sohbet',
        type: 'group',
        participants: ['1', '2', '3', '4'],
        unreadCount: 0,
        lastMessage: 'Merhaba herkese!',
        lastMessageTime: new Date()
      },
      {
        id: '2',
        name: 'Ayşe',
        type: 'direct',
        participants: ['1', '2'],
        unreadCount: 2,
        lastMessage: 'Proje nasıl gidiyor?',
        lastMessageTime: new Date()
      },
      {
        id: '3',
        name: 'AI Geliştirme',
        type: 'channel',
        participants: ['1', '2', '3'],
        unreadCount: 5,
        lastMessage: 'Yeni model trained!',
        lastMessageTime: new Date()
      }
    ];
    setRooms(mockRooms);
    setSelectedRoom('1');

    const mockMessages: Message[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Ayşe',
        content: 'Merhaba! Nasılsın?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        reactions: [{ emoji: '👍', users: ['1'] }]
      },
      {
        id: '2',
        userId: '1',
        userName: 'Sen',
        content: 'İyiyim, teşekkürler! Sen?',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        reactions: []
      },
      {
        id: '3',
        userId: '3',
        userName: 'Mehmet',
        content: 'Yeni özellikler harika görünüyor!',
        timestamp: new Date(Date.now() - 2400000),
        type: 'text',
        reactions: [{ emoji: '❤️', users: ['2', '4'] }]
      }
    ];
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Sen',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      reactions: []
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update room last message
    setRooms(prev => prev.map(room => 
      room.id === selectedRoom 
        ? { ...room, lastMessage: newMessage, lastMessageTime: new Date() }
        : room
    ));

    // Simulate typing response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        userId: '2',
        userName: 'Ayşe',
        content: 'Mesajını aldım! 👍',
        timestamp: new Date(),
        type: 'text',
        reactions: []
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const startVoiceCall = async (isVideo: boolean = false) => {
    if (!selectedRoom) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideo 
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const call: VoiceCall = {
        id: Date.now().toString(),
        participants: ['1', '2'],
        startTime: new Date(),
        isVideoEnabled: isVideo,
        isAudioEnabled: true
      };

      setCurrentCall(call);
      setIsInCall(true);
    } catch (error) {
      console.error('Call failed:', error);
    }
  };

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }

    setIsInCall(false);
    setCurrentCall(null);
    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
        });
      } catch (error) {
        console.error('Screen sharing failed:', error);
      }
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes('1')) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== '1') }
                  : r
              ).filter(r => r.users.length > 0)
            };
          } else {
            // Add user to existing reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, '1'] }
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: ['1'] }]
          };
        }
      }
      return msg;
    }));
  };

  const searchMessages = () => {
    if (!searchQuery.trim()) return messages;
    
    return messages.filter(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);
  const filteredMessages = searchMessages();

  return (
    <div className="advanced-chat p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">💬 Gelişmiş Sohbet</h2>
      
      {/* Call Interface */}
      {isInCall && currentCall && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                📞 {currentCall.isVideoEnabled ? 'Video' : 'Sesli'} Arama
              </h3>
              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                📞 Aramayı Bitir
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Sen</h4>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-48 bg-gray-700 rounded"
                />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Diğer Taraf</h4>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-full h-48 bg-gray-700 rounded"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleScreenShare}
                className={`px-3 py-2 rounded ${
                  isScreenSharing ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                🖥️ Ekran Paylaş
              </button>
              <button className="bg-gray-600 px-3 py-2 rounded">🎤 Sessiz</button>
              <button className="bg-gray-600 px-3 py-2 rounded">📹 Kamera Kapat</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Chat Rooms */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">💬 Odalar</h3>
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
              ➕
            </button>
          </div>
          
          <div className="space-y-2">
            {rooms.map(room => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-3 rounded cursor-pointer ${
                  selectedRoom === room.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {room.type === 'group' && '👥 '}
                      {room.type === 'direct' && '💬 '}
                      {room.type === 'channel' && '📢 '}
                      {room.name}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {room.lastMessage}
                    </div>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-600 text-xs px-2 py-1 rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {room.participants.length} üye
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedRoomData?.name}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => startVoiceCall(false)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
              >
                📞
              </button>
              <button
                onClick={() => startVoiceCall(true)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
              >
                📹
              </button>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded h-96 overflow-y-auto mb-4">
            {filteredMessages.map(message => (
              <div key={message.id} className="mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {users.find(u => u.id === message.userId)?.avatar}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.userName}</span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-600 p-2 rounded text-sm">
                      {message.content}
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {message.reactions.map(reaction => (
                          <button
                            key={reaction.emoji}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className={`text-xs px-2 py-1 rounded ${
                              reaction.users.includes('1')
                                ? 'bg-blue-600'
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                          >
                            {reaction.emoji} {reaction.users.length}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Mesaj yazın..."
              className="flex-1 bg-gray-700 px-3 py-2 rounded"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded"
            >
              😊
            </button>
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Gönder
            </button>
          </div>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="bg-gray-700 p-2 rounded mt-2">
              <div className="grid grid-cols-5 gap-1">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg hover:bg-gray-600 p-1 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Users & Search */}
        <div className="space-y-4">
          {/* Online Users */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🟢 Çevrimiçi</h3>
            <div className="space-y-2">
              {users.filter(u => u.status === 'online').map(user => (
                <div key={user.id} className="flex items-center gap-2">
                  <span className="text-lg">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                    {user.isTyping && (
                      <div className="text-xs text-gray-400 italic">yazıyor...</div>
                    )}
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🔍 Arama</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mesajlarda ara..."
              className="w-full bg-gray-700 px-3 py-2 rounded mb-2"
            />
            <div className="text-sm text-gray-400">
              {filteredMessages.length} sonuç bulundu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChat;
