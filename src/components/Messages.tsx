
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Plus, Paperclip, MoreHorizontal, Trash2, Flag, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import NewMessageDialog from './NewMessageDialog';
import GroupAvatar from './GroupAvatar';
import { useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const { threads, messages, loading, sendMessage, updateThreadName } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showEditChatDialog, setShowEditChatDialog] = useState(false);
  const [editChatName, setEditChatName] = useState('');

  const selectedThread = threads.find(thread => thread.id === selectedThreadId);
  const threadMessages = messages.filter(msg => msg.thread_id === selectedThreadId);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThreadId) return;
    
    try {
      await sendMessage(newMessage, undefined, selectedThreadId);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendFile = () => {
    console.log('Send file clicked');
  };

  const handleDeleteChat = () => {
    console.log('Delete chat clicked');
  };

  const handleReportChat = () => {
    console.log('Report chat clicked');
  };

  const handleEditChatName = () => {
    if (selectedThread) {
      setEditChatName(selectedThread.name || '');
      setShowEditChatDialog(true);
    }
  };

  const handleSaveChatName = async () => {
    if (selectedThreadId && editChatName.trim()) {
      try {
        await updateThreadName(selectedThreadId, editChatName.trim());
        setShowEditChatDialog(false);
        setEditChatName('');
      } catch (error) {
        console.error('Failed to update chat name:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-10 h-screen flex flex-col">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
              {threads.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedThreadId === thread.id ? 'bg-purple-50 border-r-2 border-r-purple-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {thread.is_group ? (
                        <GroupAvatar 
                          participants={thread.participants?.map(p => ({
                            name: p.profiles.name,
                            username: p.profiles.username
                          })) || []} 
                          size="md" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {thread.participants?.[0]?.profiles?.name?.[0] || '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">
                            {thread.name || thread.participants?.[0]?.profiles?.name || 'Unknown'}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {thread.latest_message && formatDistanceToNow(new Date(thread.latest_message.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {thread.latest_message?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedThread ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedThread.is_group ? (
                      <GroupAvatar 
                        participants={selectedThread.participants?.map(p => ({
                          name: p.profiles.name,
                          username: p.profiles.username
                        })) || []} 
                        size="md" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {selectedThread.participants?.[0]?.profiles?.name?.[0] || '?'}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {selectedThread.name || selectedThread.participants?.[0]?.profiles?.name || 'Unknown'}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {selectedThread.is_group 
                          ? `${selectedThread.participants?.length || 0} members` 
                          : 'Producer • Online now'
                        }
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
                      {selectedThread.is_group && (
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
                    {threadMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No messages in this conversation yet
                      </div>
                    ) : (
                      threadMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_profile?.name ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_profile?.name
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-purple-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_profile?.name ? 'text-gray-500' : 'text-purple-200'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSendFile}
                      className="h-10 w-10 p-0"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
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
