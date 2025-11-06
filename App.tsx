
import React, { useState } from 'react';
import ChatBot from './components/ChatBot';
import ImageGenerator from './components/ImageGenerator';
import LowLatencyDemo from './components/LowLatencyDemo';
import ThinkingMode from './components/ThinkingMode';
import { ChatIcon, ImageIcon, BoltIcon, BrainIcon } from './components/Icons';

type Tab = 'chat' | 'image' | 'low-latency' | 'thinking';

const TABS: { id: Tab; label: string; icon: React.FC<{className?:string}> }[] = [
  { id: 'chat', label: 'Chat Bot', icon: ChatIcon },
  { id: 'image', label: 'Image Generator', icon: ImageIcon },
  { id: 'low-latency', label: 'Low-Latency Stream', icon: BoltIcon },
  { id: 'thinking', label: 'Thinking Mode', icon: BrainIcon },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatBot />;
      case 'image':
        return <ImageGenerator />;
      case 'low-latency':
        return <LowLatencyDemo />;
      case 'thinking':
        return <ThinkingMode />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gemini-dark text-gemini-text font-sans flex flex-col p-2 md:p-4">
      <header className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gemini-blue to-gemini-purple">
          Gemini AI Showcase
        </h1>
      </header>
      
      <div className="flex justify-center mb-4">
        <div className="bg-gemini-light-dark p-1 rounded-full flex flex-wrap justify-center gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base font-medium rounded-full transition-all duration-300 flex items-center gap-2 ${
                activeTab === id ? 'bg-gemini-blue text-white shadow-lg' : 'text-gemini-text hover:bg-gemini-grey'
              }`}
            >
              <Icon className="w-5 h-5"/>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto" style={{height: 'calc(100vh - 120px)'}}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
