import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface ProjectChatProps {
  projectId: string;
}
const ProjectChat = ({
  projectId
}: ProjectChatProps) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchMessages();
    getCurrentUser();
  }, [projectId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time listener for new messages
  useEffect(() => {
    if (!projectId) return;
    const channel = supabase.channel('project-messages').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `project_id=eq.${projectId}`
    }, payload => {
      console.log('New message received:', payload);
      fetchMessages(); // Refetch to get complete data with profiles
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);
  const getCurrentUser = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };
  const fetchMessages = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('messages').select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            name,
            username
          )
        `).eq('project_id', projectId).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      if (!currentUser) throw new Error('User not authenticated');
      const {
        data,
        error
      } = await supabase.from('messages').insert([{
        content: newMessage,
        sender_id: currentUser.id,
        project_id: projectId
      }]).select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            name,
            username
          )
        `).single();
      if (error) throw error;

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
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
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  const isCurrentUser = (senderId: string) => {
    return currentUser?.id === senderId;
  };
  if (loading) {
    return <Card className="h-full flex flex-col flex-1 min-h-0">
        <CardHeader>
          <CardTitle>Project Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading messages...</div>
        </CardContent>
      </Card>;
  }
  return <Card className="h-full flex flex-col flex-1 min-h-0">
      <CardHeader>
        <CardTitle>Project Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 ? <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div> : messages.map(message => {
          const currentUserMessage = isCurrentUser(message.sender_id);
          return <div key={message.id} className={`flex ${currentUserMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-3 max-w-[70%] ${currentUserMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!currentUserMessage && <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-purple-700">
                          {getInitials(message.sender_profile?.name || 'User')}
                        </span>
                      </div>}
                    
                    <div className="flex flex-col">
                      <div className={`px-4 py-2 rounded-lg ${currentUserMessage ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        {!currentUserMessage && <p className="text-xs font-medium mb-1 opacity-75">
                            {message.sender_profile?.name || 'User'}
                          </p>}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <span className={`text-xs text-gray-500 mt-1 ${currentUserMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>;
        })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="flex-1" disabled={sending} />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ProjectChat;
