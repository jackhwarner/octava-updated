
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';

interface ProjectChatProps {
  projectId: string;
}

const ProjectChat = ({ projectId }: ProjectChatProps) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Sarah Johnson',
      senderUsername: '@sarah_beats',
      message: 'Hey everyone! I just uploaded the demo track. Let me know what you think!',
      timestamp: '2024-01-20T10:30:00Z',
      isCurrentUser: false
    },
    {
      id: '2',
      sender: 'You',
      senderUsername: '@alex_producer',
      message: 'Sounds great! Love the melody in the chorus. Should we work on the bridge next?',
      timestamp: '2024-01-20T10:45:00Z',
      isCurrentUser: true
    },
    {
      id: '3',
      sender: 'Marcus Williams',
      senderUsername: '@marcus_guitar',
      message: 'I can add some guitar layers to the bridge. Give me a day or two.',
      timestamp: '2024-01-20T11:15:00Z',
      isCurrentUser: false
    },
    {
      id: '4',
      sender: 'Sarah Johnson',
      senderUsername: '@sarah_beats',
      message: 'Perfect! I\'ll work on the vocal arrangement in the meantime.',
      timestamp: '2024-01-20T11:20:00Z',
      isCurrentUser: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: 'You',
      senderUsername: '@alex_producer',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Project Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[70%] ${message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isCurrentUser && (
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-purple-700">
                      {getInitials(message.sender)}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isCurrentUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {!message.isCurrentUser && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm">{message.message}</p>
                  </div>
                  
                  <span className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectChat;
