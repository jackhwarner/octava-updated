
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Plus, Paperclip, Calendar, MoreHorizontal, Trash2, Flag, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import NewMessageDialog from './NewMessageDialog';
import GroupAvatar from './GroupAvatar';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showEditChatDialog, setShowEditChatDialog] = useState(false);
  const [editChatName, setEditChatName] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Hey! I loved your latest track...',
      time: '2 min ago',
      unread: 2,
      avatar: null,
      isGroup: false,
      participants: [{ name: 'Sarah Johnson', username: '@sarah_beats' }],
    },
    {
      id: 2,
      name: 'Marcus Williams',
      lastMessage: 'The guitar part sounds perfect!',
      time: '1 hour ago',
      unread: 0,
      avatar: null,
      isGroup: false,
      participants: [{ name: 'Marcus Williams', username: '@marcus_guitar' }],
    },
    {
      id: 3,
      name: 'Project Team - Summer Vibes',
      lastMessage: 'Emma: Thanks for the collaboration opportunity',
      time: '3 hours ago',
      unread: 1,
      avatar: null,
      isGroup: true,
      participants: [
        { name: 'Emma Chen', username: '@emma_writes' },
        { name: 'David Kim', username: '@david_keys' },
        { name: 'Sophia Martinez', username: '@sophia_voice' }
      ],
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

  const handleSendFile = () => {
    console.log('Send file clicked');
  };

  const handleScheduleEvent = () => {
    console.log('Schedule event clicked');
  };

  const handleDeleteChat = () => {
    console.log('Delete chat clicked');
  };

  const handleReportChat = () => {
    console.log('Report chat clicked');
  };

  const handleEditChatName = () => {
    const selectedChatData = chats.find(chat => chat.id === selectedChat);
    if (selectedChatData) {
      setEditChatName(selectedChatData.name);
      setShowEditChatDialog(true);
    }
  };

  const handleSaveChatName = () => {
    console.log('Save chat name:', editChatName);
    setShowEditChatDialog(false);
    setEditChatName('');
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

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
                    {chat.isGroup ? (
                      <GroupAvatar participants={chat.participants} size="md" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      </div>
                    )}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedChatData?.isGroup ? (
                  <GroupAvatar participants={selectedChatData.participants} size="md" />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{selectedChatData?.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {selectedChatData?.isGroup ? `${selectedChatData.participants.length} members` : 'Producer • Online now'}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {selectedChatData?.isGroup && (
                    <DropdownMenuItem onClick={handleEditChatName}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Chat Name
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleReportChat}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <div className="flex space-x-2 mb-3">
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
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSendFile}
                  className="flex-1"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Send File
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleScheduleEvent}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
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

      {/* Edit Chat Name Dialog */}
      <Dialog open={showEditChatDialog} onOpenChange={setShowEditChatDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Chat Name</DialogTitle>
            <DialogDescription>
              Change the name of this group chat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chat-name">Chat Name</Label>
              <Input
                id="chat-name"
                value={editChatName}
                onChange={(e) => setEditChatName(e.target.value)}
                placeholder="Enter chat name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditChatDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChatName}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!editChatName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
