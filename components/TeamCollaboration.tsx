import React, { useState, useEffect } from 'react';
import { useApiMode } from './ApiModeToggle';
import { mockDataGenerators } from '../mockService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  role: 'admin' | 'editor' | 'viewer';
}

interface Project {
  id: string;
  name: string;
  description: string;
  members: User[];
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
}

const TeamCollaboration: React.FC = () => {
  const { isApiMode } = useApiMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Mock users
    const mockUsers: User[] = [
      { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', avatar: '👨‍💼', status: 'online', role: 'admin' },
      { id: '2', name: 'Ayşe Kaya', email: 'ayse@example.com', avatar: '👩‍💻', status: 'online', role: 'editor' },
      { id: '3', name: 'Mehmet Demir', email: 'mehmet@example.com', avatar: '👨‍🎨', status: 'busy', role: 'editor' },
      { id: '4', name: 'Zeynep Çelik', email: 'zeynep@example.com', avatar: '👩‍🔬', status: 'offline', role: 'viewer' }
    ];
    setUsers(mockUsers);
    setOnlineUsers(['1', '2', '3']);

    // Mock project
    const mockProject: Project = {
      id: '1',
      name: 'AI Video Projesi',
      description: 'AI destekli video üretim platformu',
      members: mockUsers,
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false
    };
    setProjects([mockProject]);
    setSelectedProject('1');

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      { id: '1', userId: '1', userName: 'Ahmet Yılmaz', message: 'Projeye hoş geldiniz!', timestamp: new Date(), type: 'text' },
      { id: '2', userId: '2', userName: 'Ayşe Kaya', message: 'Teşekkürler! Heyecanlıyım.', timestamp: new Date(), type: 'text' }
    ];
    setChatMessages(mockMessages);
  }, []);

  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `Yeni Proje ${projects.length + 1}`,
      description: 'Yeni oluşturulan proje',
      members: users.filter(u => u.id === '1'), // Sadece admin
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false
    };
    
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject.id);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedProject) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'Ahmet Yılmaz',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const addMember = (userId: string) => {
    if (!selectedProject) return;
    
    setProjects(prev => prev.map(project => 
      project.id === selectedProject 
        ? { ...project, members: [...project.members, users.find(u => u.id === userId)!] }
        : project
    ));
  };

  const removeMember = (userId: string) => {
    if (!selectedProject) return;
    
    setProjects(prev => prev.map(project => 
      project.id === selectedProject 
        ? { ...project, members: project.members.filter(m => m.id !== userId) }
        : project
    ));
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: SharedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: 'Ahmet Yılmaz',
        uploadedAt: new Date(),
        url: URL.createObjectURL(file)
      };
      
      setSharedFiles(prev => [...prev, newFile]);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'Sistem',
        message: `📁 ${file.name} dosyası yüklendi`,
        timestamp: new Date(),
        type: 'system'
      };
      
      setChatMessages(prev => [...prev, systemMessage]);
    });
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="team-collaboration p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">👥 Ekip Çalışması</h2>
      
      {/* Project Management */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📁 Projeler</h3>
          <button
            onClick={createProject}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            ➕ Yeni Proje
          </button>
        </div>
        
        <div className="flex gap-2 mb-4">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`px-3 py-2 rounded ${
                selectedProject === project.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {project.name}
              <span className="ml-2 text-xs">
                ({project.members.length} üye)
              </span>
            </button>
          ))}
        </div>
        
        {selectedProjectData && (
          <div className="bg-gray-700 p-3 rounded">
            <h4 className="font-medium mb-2">{selectedProjectData.name}</h4>
            <p className="text-sm text-gray-400 mb-2">{selectedProjectData.description}</p>
            <div className="text-xs text-gray-400">
              Oluşturuldu: {selectedProjectData.createdAt.toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">👥 Ekip Üyeleri</h3>
          
          <div className="space-y-2 mb-4">
            {users.map(user => (
              <div key={user.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    user.status === 'online' ? 'bg-green-500' :
                    user.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-xs text-gray-400">{user.status}</span>
                  {selectedProjectData?.members.some(m => m.id === user.id) ? (
                    <button
                      onClick={() => removeMember(user.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Kaldır
                    </button>
                  ) : (
                    <button
                      onClick={() => addMember(user.id)}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      Ekle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-400">
            🟢 Çevrimiçi: {onlineUsers.length} üye
          </div>
        </div>

        {/* Real-time Chat */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">💬 Ekip Sohbeti</h3>
          
          <div className="bg-gray-700 p-3 rounded h-64 overflow-y-auto mb-4">
            {chatMessages.map(message => (
              <div key={message.id} className="mb-2">
                {message.type === 'system' ? (
                  <div className="text-center text-sm text-gray-400 italic">
                    {message.message}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.userName}</span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-600 p-2 rounded text-sm">
                      {message.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="text-sm text-gray-400 italic">
                Birisi yazıyor...
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Mesaj yazın..."
              className="flex-1 bg-gray-700 px-3 py-2 rounded"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Gönder
            </button>
          </div>
          
          <div>
            <input
              type="file"
              onChange={uploadFile}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Shared Files */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">📁 Paylaşılan Dosyalar</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {sharedFiles.map(file => (
            <div key={file.id} className="bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {file.uploadedBy} • {file.uploadedAt.toLocaleDateString()}
              </div>
              <button className="mt-2 text-blue-400 hover:text-blue-300 text-sm">
                İndir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;
