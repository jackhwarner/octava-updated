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
import ConversationList from './messages/ConversationList';
import ChatWindow from './messages/ChatWindow';
const Messages = () => {
  const {
    threadId
  } = useParams<{
    threadId: string;
  }>();
  const navigate = useNavigate();
  const {
    threads,
    messages,
    loading,
    sendMessage,
    updateThreadName,
    currentUser,
    fetchThreads
  } = useMessages();
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
        navigate(`/messages/${selectedThreadId}`, {
          replace: true
        });
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
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto"
      });
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
      const {
        error
      } = await supabase.from('message_threads').delete().eq('id', selectedThreadId);
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
    return <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 p-6 sm:p-8 flex flex-col">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 max-w-6xl ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 ">Messages</h1>
          <p className="text-gray-600 text-base">Keep in touch with your collaborators. Manage your conversations and start new chats.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewMessageDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Main card area */}
      <div className="flex-1 flex justify-center items-stretch">
        <Card className="flex w-full max-w-6xl flex-1 min-h-[600px] rounded-2xl border bg-white overflow-hidden \n">
          {/* Conversations List */}
          <ConversationList threads={threads} selectedThreadId={selectedThreadId} handleThreadClick={handleThreadClick} getOtherParticipant={getOtherParticipant} formatDistanceToNow={formatDistanceToNow} />

          {/* Vertical line - thin, no spacing */}
          <Separator orientation="vertical" className="w-px bg-gray-200" />

          {/* Messages view */}
          {selectedThread ? <ChatWindow selectedThread={selectedThread} threadMessages={threadMessages} messagesEndRef={messagesEndRef} isCurrentUser={isCurrentUser} formatDistanceToNow={formatDistanceToNow} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} handleEditChatName={handleEditChatName} handleDeleteChat={handleDeleteChat} handleReportChat={handleReportChat} getOtherParticipant={getOtherParticipant} /> : <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>}
        </Card>
      </div>

      {/* Dialogs */}
      <NewMessageDialog isOpen={showNewMessageDialog} onClose={() => setShowNewMessageDialog(false)} />

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
              <Input id="chat-name" value={editChatName} onChange={e => setEditChatName(e.target.value)} placeholder="Enter chat name..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditChatDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChatName} className="bg-purple-600 hover:bg-purple-700" disabled={!editChatName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Messages;