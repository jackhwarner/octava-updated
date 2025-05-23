
import { 
  Home, 
  Search, 
  MessageCircle, 
  FolderOpen, 
  Settings, 
  HelpCircle,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="w-24 bg-white border-r border-gray-200 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2" onClick={() => setActiveTab('dashboard')}>
                <img 
                  src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
                  alt="Octava Logo" 
                  className="w-12 h-12" 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Octava</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Divider */}
      <div className="w-16 h-px bg-gray-200 mb-8"></div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-8">
        <TooltipProvider>
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
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
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Notifications Button */}
      <div className="mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => {}}
                aria-label="Notifications"
              >
                <Bell className="w-7 h-7" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* User Menu - Bottom of Sidebar */}
      <div className="mt-auto">
        <TooltipProvider>
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-300 transition-all"
                    aria-label="User menu"
                  >
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>User Profile</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-72 p-3">
              <div className="flex items-center p-3 mb-2">
                <div className="w-14 h-14 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-base">Alex Rodriguez</p>
                  <p className="text-sm text-gray-500">@alex_producer</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('profile')} className="py-3 cursor-pointer">
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('settings')} className="py-3 cursor-pointer">
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('support')} className="py-3 cursor-pointer">
                <HelpCircle className="w-5 h-5 mr-3" />
                <span>Support</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
