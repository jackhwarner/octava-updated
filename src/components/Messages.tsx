import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Search, Plus, MoreHorizontal, Trash2, Flag, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import NewMessageDialog from './NewMessageDialog';
import GroupAvatar from './GroupAvatar';
import { useMessages } from '../hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Separator } from './ui/separator';

const Messages = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { threads, messages, loading, sendMessage, updateThreadName, currentUser, fetchThreads } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threadId || null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showEditChatDialog, setShowEditChatDialog] = useState(false);
  const [editChatName, setEditChatName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedThread = threads.find(thread => thread.id === selectedThreadId);
  const threadMessages = messages.filter(msg => msg.thread_id === selectedThreadId);

  // Update selected thread when URL changes
  useEffect(() => {
    if (threadId) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setSelectedThreadId(threadId);
      } else {
        // If thread not found, fetch threads and try again
        fetchThreads();
      }
    }
  }, [threadId, threads, fetchThreads]);

  // Update URL when selected thread changes
  useEffect(() => {
    if (selectedThreadId) {
      const thread = threads.find(t => t.id === selectedThreadId);
      if (thread) {
        navigate(`/messages/${selectedThreadId}`, { replace: true });
      }
    }
  }, [selectedThreadId, threads, navigate]);

  // Handle new messages and thread updates
  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId) {
      const mostRecentThread = threads[0];
      setSelectedThreadId(mostRecentThread.id);
    }
  }, [threads, selectedThreadId]);

  // Scroll to bottom only when thread changes or on initial load
  useEffect(() => {
    if (threadMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedThreadId, threadMessages.length]); // Also scroll when messages change

  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const isCurrentUser = (senderId: string) => {
    return currentUser?.id === senderId;
  };

  // Helper to find the other participant in a 1-on-1 thread
  const getOtherParticipant = (thread: any) => {
    if (!currentUser || thread?.is_group) return null;
    return thread?.participants?.find((p: any) => p.user_id !== currentUser.id)?.profiles;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThreadId) return;
    
    try {
      await sendMessage(newMessage, undefined, selectedThreadId);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedThreadId) return;
    try {
      const { error } = await supabase
        .from('message_threads')
        .delete()
        .eq('id', selectedThreadId);
      if (error) throw error;
      setSelectedThreadId(null);
      navigate('/messages');
      await fetchThreads();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
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
      <div className="p-8 h-screen flex flex-col bg-gray-50">
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
    <div className="p-8 min-h-screen flex flex-col bg-gray-50">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">
              Keep in touch with your collaborators. Manage your conversations and start new chats.
            </p>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowNewMessageDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Big card with 4 rounded corners */}
      <div className="flex-1 flex justify-center items-stretch">
        <Card className="flex w-full max-w-6xl flex-1 min-h-[600px] rounded-2xl shadow border bg-white overflow-hidden">
          {/* Conversations List */}
          <div className="flex flex-col w-72 min-w-[220px] max-w-xs bg-white">
            <CardHeader className="border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <ScrollArea className="flex-1 h-96">
                {threads.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-200">
                    {threads.map((thread) => {
                      const otherParticipant = getOtherParticipant(thread);
                      return (
                        <li
                          key={thread.id}
                          role="listitem"
                          onClick={() => handleThreadClick(thread.id)}
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
                                {otherParticipant?.name?.[0] || otherParticipant?.username?.[0] || '?'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">
                                  {thread.name || otherParticipant?.name || otherParticipant?.username || 'Unknown'}
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
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ScrollArea>
            </CardContent>
          </div>

          {/* Vertical line without a gap, just a thin divider */}
          <Separator orientation="vertical" className="w-px bg-gray-200" />

          {/* Messages view */}
          <div className="flex-1 flex flex-col min-w-0">
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
                          {getOtherParticipant(selectedThread)?.name?.[0] || getOtherParticipant(selectedThread)?.username?.[0] || '?'}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {selectedThread.name || getOtherParticipant(selectedThread)?.name || getOtherParticipant(selectedThread)?.username || 'Unknown'}
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
                        [...threadMessages].reverse().map((message) => {
                          const isMyMessage = isCurrentUser(message.sender_id);
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isMyMessage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isMyMessage ? 'text-purple-200' : 'text-gray-500'
                                  }`}
                                >
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
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
          </div>
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
