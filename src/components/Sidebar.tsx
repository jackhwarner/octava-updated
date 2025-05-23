
import { 
  Home, 
  Search, 
  MessageCircle, 
  FolderOpen, 
  Settings, 
  HelpCircle,
  User,
  ChevronDown,
  Disc
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
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2" onClick={() => setActiveTab('dashboard')}>
              <Disc className="w-8 h-8 text-purple-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Octava</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Divider */}
      <div className="w-8 h-px bg-gray-200 mb-8"></div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-6">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* User Menu - Bottom of Sidebar */}
      <div className="mt-auto">
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button 
                  className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                  aria-label="User menu"
                >
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>User Profile</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setActiveTab('profile')}>
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab('settings')}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveTab('support')}>
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Support</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
