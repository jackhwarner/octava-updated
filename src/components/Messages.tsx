
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Plus } from 'lucide-react';
import NewMessageDialog from './NewMessageDialog';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Hey! I loved your latest track...',
      time: '2 min ago',
      unread: 2,
      avatar: null,
    },
    {
      id: 2,
      name: 'Marcus Williams',
      lastMessage: 'The guitar part sounds perfect!',
      time: '1 hour ago',
      unread: 0,
      avatar: null,
    },
    {
      id: 3,
      name: 'Emma Chen',
      lastMessage: 'Thanks for the collaboration opportunity',
      time: '3 hours ago',
      unread: 1,
      avatar: null,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hey! I loved your latest track. Would you be interested in collaborating?',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thank you! I checked out your work too, really impressive production quality.',
      time: '10:35 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'I have this idea for a pop track that could really benefit from your style. Want to hop on a call?',
      time: '10:38 AM',
      isMe: false,
    },
  ];

  return (
    <div className="p-10 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowNewMessageDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? 'bg-purple-50 border-r-2 border-r-purple-600' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{chat.name}</h4>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                <p className="text-sm text-gray-500">Producer • Online now</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMe
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isMe ? 'text-purple-200' : 'text-gray-500'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewMessageDialog 
        isOpen={showNewMessageDialog} 
        onClose={() => setShowNewMessageDialog(false)} 
      />
    </div>
  );
};

export default Messages;
