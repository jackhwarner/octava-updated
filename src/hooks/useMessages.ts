
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  thread_id?: string;
  read_at?: string;
  created_at: string;
  sender: {
    name: string;
    username?: string;
  };
}

export interface MessageThread {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  participants: Array<{
    id: string;
    user_id: string;
    profiles: {
      name: string;
      username?: string;
    };
  }>;
  last_message?: Message;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch direct messages
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            name,
            username
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .is('thread_id', null)
        .order('created_at', { ascending: false });

      if (directError) {
        console.error('Direct messages error:', directError);
      } else if (directMessages) {
        const formattedMessages: Message[] = directMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          recipient_id: msg.recipient_id,
          thread_id: msg.thread_id,
          read_at: msg.read_at,
          created_at: msg.created_at,
          sender: {
            name: msg.profiles?.name || 'Unknown User',
            username: msg.profiles?.username
          }
        }));
        setMessages(formattedMessages);
      }

      // Fetch message threads
      const { data: messageThreads, error: threadsError } = await supabase
        .from('message_threads')
        .select(`
          *,
          thread_participants (
            id,
            user_id,
            profiles (
              name,
              username
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (!threadsError && messageThreads) {
        const formattedThreads: MessageThread[] = messageThreads.map(thread => ({
          id: thread.id,
          name: thread.name,
          is_group: thread.is_group,
          created_by: thread.created_by,
          created_at: thread.created_at,
          participants: thread.thread_participants || []
        }));
        setThreads(formattedThreads);
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, recipientId?: string, threadId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          sender_id: user.id,
          recipient_id: recipientId,
          thread_id: threadId,
        }])
        .select(`
          *,
          profiles:sender_id (
            name,
            username
          )
        `)
        .single();

      if (error) throw error;

      const newMessage: Message = {
        id: data.id,
        content: data.content,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        thread_id: data.thread_id,
        read_at: data.read_at,
        created_at: data.created_at,
        sender: {
          name: data.profiles?.name || 'Unknown User',
          username: data.profiles?.username
        }
      };

      setMessages(prev => [newMessage, ...prev]);
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createThread = async (name: string, participantIds: string[], isGroup: boolean = true) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: thread, error: threadError } = await supabase
        .from('message_threads')
        .insert([{
          name,
          is_group: isGroup,
          created_by: user.id,
        }])
        .select()
        .single();

      if (threadError) throw threadError;

      // Add participants
      const participants = [user.id, ...participantIds].map(userId => ({
        thread_id: thread.id,
        user_id: userId,
      }));

      const { error: participantsError } = await supabase
        .from('thread_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      await fetchMessages(); // Refresh
      
      toast({
        title: "Success",
        description: "Group chat created successfully",
      });
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to create group chat",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateThreadName = async (threadId: string, name: string) => {
    try {
      const { error } = await supabase
        .from('message_threads')
        .update({ name })
        .eq('id', threadId);

      if (error) throw error;

      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, name } : thread
      ));

      toast({
        title: "Success",
        description: "Chat name updated successfully",
      });
    } catch (error) {
      console.error('Error updating thread name:', error);
      toast({
        title: "Error",
        description: "Failed to update chat name",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    threads,
    loading,
    sendMessage,
    createThread,
    updateThreadName,
    refetch: fetchMessages
  };
};
