
import { Home, Search, MessageCircle, FolderOpen, Settings, HelpCircle, User, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationsPanel from './NotificationsPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { profile } = useProfile();

  // Get only recent notifications for the dropdown
  const recentNotifications = notifications.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const mainMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: Search
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen
    }
  ];

  const handleViewAllNotifications = () => {
    setIsNotificationsOpen(false);
    setShowNotificationsPanel(true);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="w-[90px] bg-white border-r border-gray-200 flex flex-col items-center py-3 h-full">
        {/* Logo */}
        <div className="mb-4">
          <Link to="/" onClick={e => {
          e.preventDefault();
          navigate('/');
        }}>
            <img alt="Octava Logo" className="w-14 h-14" src="/lovable-uploads/70dae72f-9be2-4a92-b512-0e30d0502a1d.png" />
          </Link>
        </div>
        
        {/* Divider */}
        <div className="w-16 h-px bg-gray-200 mb-5"></div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-5">
          {mainMenuItems.map(item => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} aria-label={item.label}>
                <Icon className="w-5 h-5" />
              </button>;
        })}
        </nav>

        {/* Notifications Button */}
        <div className="mb-3">
          <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <button className={`relative p-3 rounded-lg transition-colors ${isNotificationsOpen ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} aria-label="Notifications">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-3 mr-32">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Notifications</h3>
                <button 
                  className="text-xs text-purple-600"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
              </div>
              <DropdownMenuSeparator />
              {recentNotifications.length === 0 ? (
                <div className="py-4 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                recentNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`py-2 cursor-pointer hover:bg-gray-50 rounded px-2 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                    {index !== recentNotifications.length - 1 && <DropdownMenuSeparator className="mt-2" />}
                  </div>
                ))
              )}
              <DropdownMenuSeparator />
              <button className="w-full text-center text-sm text-purple-600 py-2" onClick={handleViewAllNotifications}>
                View all notifications
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Menu - Bottom of Sidebar */}
        <div className="mt-auto mb-3">
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-300 transition-all" aria-label="User menu">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={profile?.avatar_url || profile?.profile_picture_url} />
                  <AvatarFallback className="bg-gray-300 text-gray-700">
                    {getInitials(profile?.name || profile?.full_name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-3 mr-32">
              <div className="flex items-center p-3 mb-2">
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={profile?.avatar_url || profile?.profile_picture_url} />
                  <AvatarFallback className="bg-gray-300 text-gray-700">
                    {getInitials(profile?.name || profile?.full_name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-base">{profile?.name || profile?.full_name || 'User'}</p>
                  <p className="text-sm text-gray-500">@{profile?.username || 'username'}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('profile')} className="py-3 cursor-pointer">
                <User className="w-4 h-4 mr-3" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('settings')} className="py-3 cursor-pointer">
                <Settings className="w-4 h-4 mr-3" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('support')} className="py-3 cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-3" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="py-3 cursor-pointer text-red-600">
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NotificationsPanel isOpen={showNotificationsPanel} onClose={() => setShowNotificationsPanel(false)} />
    </>
  );
};

export default Sidebar;
