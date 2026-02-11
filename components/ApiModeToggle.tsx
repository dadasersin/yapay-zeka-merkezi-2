// API Mode Toggle Component
import React, { useState, createContext, useContext } from 'react';

interface ApiModeContextType {
  isApiMode: boolean;
  toggleApiMode: () => void;
}

const ApiModeContext = createContext<ApiModeContextType | undefined>(undefined);

export const useApiMode = () => {
  const context = useContext(ApiModeContext);
  if (!context) {
    throw new Error('useApiMode must be used within ApiModeProvider');
  }
  return context;
};

export const ApiModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isApiMode, setIsApiMode] = useState(() => {
    // localStorage'dan ayarı oku
    const saved = localStorage.getItem('api_mode');
    return saved !== 'false'; // default: true
  });

  const toggleApiMode = () => {
    const newMode = !isApiMode;
    setIsApiMode(newMode);
    localStorage.setItem('api_mode', newMode.toString());
  };

  return (
    <ApiModeContext.Provider value={{ isApiMode, toggleApiMode }}>
      {children}
    </ApiModeContext.Provider>
  );
};

// Toggle Button Component
export const ApiModeToggle: React.FC = () => {
  const { isApiMode, toggleApiMode } = useApiMode();

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-3">
      <button
        onClick={toggleApiMode}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          isApiMode 
            ? 'bg-cyan-500 text-black hover:bg-cyan-400' 
            : 'bg-gray-600 text-white hover:bg-gray-500'
        }`}
      >
        {isApiMode ? '🌐 API Modu' : '🎭 Simülasyon Modu'}
      </button>
      <div className="text-xs text-gray-400 mt-2 text-center">
        {isApiMode ? 'Gerçek AI' : 'Demo Modu'}
      </div>
    </div>
  );
};
