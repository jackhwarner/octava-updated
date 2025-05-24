
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
import AuthWrapper from '@/components/AuthWrapper';

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
    navigate(`/${activeTab}`);
  }, [activeTab, navigate]);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromPath = getTabFromPath();
    if (tabFromPath !== activeTab) {
      setActiveTab(tabFromPath);
    }
  }, [location.pathname]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
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
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-white flex">
        <div className="fixed top-0 left-0 h-screen z-10">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <main className="flex-1 ml-[90px] overflow-auto">
          {renderContent()}
        </main>
      </div>
    </AuthWrapper>
  );
};

export default Index;
