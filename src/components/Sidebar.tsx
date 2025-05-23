
import { 
  Home, 
  Search, 
  MessageCircle, 
  FolderOpen, 
  Settings, 
  HelpCircle,
  User,
  Bell,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'availability', label: 'Availability', icon: Calendar },
  ];

  const notifications = [
    { id: 1, text: 'David Kim wants to connect with you', time: '2 hours ago' },
    { id: 2, text: 'Your track was commented on', time: '1 day ago' },
    { id: 3, text: 'New project invitation received', time: '2 days ago' },
  ];

  return (
    <div className="w-[90px] bg-white border-r border-gray-200 flex flex-col items-center py-3 h-full">
      {/* Logo */}
      <div className="mb-4">
        <Link to="/" onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}>
          <img 
            src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
            alt="Octava Logo" 
            className="w-16 h-16" 
          />
        </Link>
      </div>
      
      {/* Divider */}
      <div className="w-16 h-px bg-gray-200 mb-5"></div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-5">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-7 h-7" />
            </button>
          );
        })}
      </nav>

      {/* Notifications Button */}
      <div className="mb-3">
        <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className={`p-3 rounded-lg transition-colors ${
                isNotificationsOpen ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-7 h-7" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-3 mr-20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Notifications</h3>
              <button className="text-xs text-purple-600">Mark all as read</button>
            </div>
            <DropdownMenuSeparator />
            {notifications.map(notification => (
              <div key={notification.id} className="py-2">
                <p className="text-sm">{notification.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                {notification.id !== notifications.length && <DropdownMenuSeparator className="mt-2" />}
              </div>
            ))}
            <DropdownMenuSeparator />
            <button className="w-full text-center text-sm text-purple-600 py-2">
              View all notifications
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Menu - Bottom of Sidebar */}
      <div className="mt-auto mb-3">
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-300 transition-all"
              aria-label="User menu"
            >
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-3 mr-20">
            <div className="flex items-center p-3 mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-base">Alex Rodriguez</p>
                <p className="text-sm text-gray-500">@alex_producer</p>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
