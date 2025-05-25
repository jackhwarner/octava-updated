
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MessageThread {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  participants?: Array<{
    user_id: string;
    profiles: {
      name: string;
      username: string;
    };
  }>;
  last_message?: {
    content: string;
    created_at: string;
    sender: {
      name: string;
    };
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  thread_id?: string;
  recipient_id?: string;
  created_at: string;
  read_at?: string;
  file_urls?: string[];
  sender: {
    name: string;
    username: string;
  };
}

export const useMessages = () => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThreads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          thread_participants (
            user_id,
            profiles (
              name,
              username
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter threads where user is a participant
      const userThreads = data?.filter(thread => 
        thread.thread_participants?.some((p: any) => p.user_id === user.id)
      ) || [];

      setThreads(userThreads);
    } catch (error) {
      console.error('Error fetching message threads:', error);
      toast({
        title: "Error",
        description: "Failed to load message threads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey (
            name,
            username
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string, threadId?: string, recipientId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          sender_id: user.id,
          thread_id: threadId,
          recipient_id: recipientId
        }])
        .select(`
          *,
          profiles!messages_sender_id_fkey (
            name,
            username
          )
        `)
        .single();

      if (error) throw error;

      if (threadId) {
        setMessages(prev => [...prev, data]);
      }

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

  const createThread = async (name: string, isGroup: boolean, participantIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the thread
      const { data: thread, error: threadError } = await supabase
        .from('message_threads')
        .insert([{
          name,
          is_group: isGroup,
          created_by: user.id
        }])
        .select()
        .single();

      if (threadError) throw threadError;

      // Add participants
      const participants = [user.id, ...participantIds].map(userId => ({
        thread_id: thread.id,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('thread_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      await fetchThreads();
      toast({
        title: "Success",
        description: "Chat created successfully",
      });
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateThreadName = async (threadId: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('message_threads')
        .update({ name })
        .eq('id', threadId)
        .select()
        .single();

      if (error) throw error;

      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, name } : thread
      ));

      toast({
        title: "Success",
        description: "Chat name updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating thread name:', error);
      toast({
        title: "Error",
        description: "Failed to update chat name",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      const { error } = await supabase
        .from('message_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;

      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return {
    threads,
    messages,
    loading,
    fetchMessages,
    sendMessage,
    createThread,
    updateThreadName,
    deleteThread,
    refetch: fetchThreads
  };
};
