
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Browse from '@/components/Browse';
import Messages from '@/components/Messages';
import Projects from '@/components/Projects';
import Profile from '@/components/Profile';
import Settings from '@/components/Settings';
import Support from '@/components/Support';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'browse':
        return <Browse />;
      case 'messages':
        return <Messages />;
      case 'projects':
        return <Projects />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
