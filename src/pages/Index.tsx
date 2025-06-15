import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Browse from '../components/Browse';
import Messages from '../components/Messages';
import Projects from '../components/Projects';
import Following from '../components/Following';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import Support from '../components/Support';
import AuthWrapper from '../components/AuthWrapper';
import TutorialOverlay from '../components/TutorialOverlay';
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Extract the active tab from the URL path, handling specific cases
  const getTabFromPath = (pathname: string) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/projects/folder/')) return 'projects'; // Treat folder view as projects tab
    if (pathname.startsWith('/projects/')) return 'projects'; // Treat project detail view as projects tab
    if (pathname === '/browse') return 'browse';
    if (pathname === '/messages' || pathname.startsWith('/messages/')) return 'messages';
    if (pathname === '/projects') return 'projects';
    if (pathname === '/following') return 'following';
    if (pathname === '/profile' || pathname.startsWith('/profile/')) return 'profile'; // Treat user profile view as profile tab
    if (pathname === '/settings') return 'settings';
    if (pathname === '/support') return 'support';
    // Add other main paths here as needed
    return 'dashboard'; // Default to dashboard if path doesn't match any known tab
  };

  // Initialize activeTab based on the current path
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromPath = getTabFromPath(location.pathname);
    if (tabFromPath !== activeTab) {
      setActiveTab(tabFromPath);
    }
  }, [location.pathname]); // Dependency array includes only location.pathname

  const handleNavigate = (tab: string) => {
    // Update active tab state and navigate
    setActiveTab(tab);
    // Construct the correct path based on the tab
    let path = `/${tab}`;
    if (tab === 'dashboard') {
      path = '/dashboard'; // Navigate to /dashboard for the dashboard tab
    }

     if (location.pathname !== path) {
         navigate(path);
     }
    // Handle navigation for sub-routes like /projects/folder/:folderId within specific components
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
        // The Projects component will need to read route params (like folderId) itself
        return <Projects />;
      case 'following':
        return <Following />;
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

  // Block on mobile devices
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full p-6 text-center border rounded-xl shadow bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Octava does not support mobile devices</h2>
          <p className="text-gray-700 mb-2">Please use a desktop or laptop browser to access Octava.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-white flex relative">
        <div className="fixed top-0 left-0 h-screen z-10">
          <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} />
        </div>
        <main className="flex-1 ml-[90px] overflow-auto">
          {renderContent()}
        </main>
        
        {/* Tutorial Overlay */}
        <TutorialOverlay />
      </div>
    </AuthWrapper>
  );
};

export default Index;
