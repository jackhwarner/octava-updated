
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const notifications = [
    {
      id: 1,
      title: 'New collaboration request',
      message: 'Sarah Johnson wants to collaborate on "Summer Vibes"',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Project update',
      message: 'Marcus Williams uploaded new files to "Midnight Drive"',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Message received',
      message: 'Emma Chen sent you a message',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      title: 'Project completed',
      message: 'Your project "City Lights" has been marked as complete',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 5,
      title: 'New follower',
      message: 'David Kim started following you',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                notification.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                    {notification.unread && (
                      <Badge className="bg-blue-600 text-xs px-2 py-0">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            Mark all as read
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
