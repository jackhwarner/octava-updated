
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bell, Music, Users, MessageCircle, Star } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const notifications = [
    {
      id: 1,
      type: 'project',
      title: 'New project invitation',
      message: 'Sarah Johnson invited you to collaborate on "Summer Vibes"',
      time: '5 min ago',
      read: false,
      icon: Music,
    },
    {
      id: 2,
      type: 'message',
      title: 'New message',
      message: 'Marcus Williams sent you a message',
      time: '1 hour ago',
      read: false,
      icon: MessageCircle,
    },
    {
      id: 3,
      type: 'connection',
      title: 'New connection request',
      message: 'Emma Chen wants to connect with you',
      time: '2 hours ago',
      read: true,
      icon: Users,
    },
    {
      id: 4,
      type: 'review',
      title: 'New review',
      message: 'David Kim left you a 5-star review',
      time: '1 day ago',
      read: true,
      icon: Star,
    },
    {
      id: 5,
      type: 'project',
      title: 'Project update',
      message: 'Midnight Drive project has been updated',
      time: '2 days ago',
      read: true,
      icon: Music,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 border-l">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card key={notification.id} className={`cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-4 h-4 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
