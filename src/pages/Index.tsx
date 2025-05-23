
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Browse from '@/components/Browse';
import Messages from '@/components/Messages';
import Projects from '@/components/Projects';
import Profile from '@/components/Profile';
import Settings from '@/components/Settings';
import Support from '@/components/Support';
import Availability from '@/components/Availability';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the active tab from the URL path
  const getTabFromPath = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    if (path === '') return 'dashboard';
    return path;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  // Update URL when tab changes
  useEffect(() => {
    navigate(`/${activeTab === 'dashboard' ? 'dashboard' : activeTab}`);
  }, [activeTab, navigate]);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromPath = getTabFromPath();
    if (tabFromPath !== activeTab) {
      setActiveTab(tabFromPath);
    }
  }, [location.pathname]);

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
      case 'availability':
        return <Availability />;
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
    <div className="min-h-screen bg-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
