
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  thread_id?: string;
  project_id?: string;
  event_invite_id?: string;
  file_urls?: string[];
  read_at?: string;
  created_at: string;
  sender_profile?: {
    name: string;
    username: string;
  };
  recipient_profile?: {
    name: string;
    username: string;
  };
}

export interface MessageThread {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  participants?: Array<{
    user_id: string;
    joined_at: string;
    profiles: {
      name: string;
      username: string;
    };
  }>;
  latest_message?: Message;
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

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            name,
            username
          ),
          recipient_profile:profiles!messages_recipient_id_fkey (
            name,
            username
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
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

  const fetchThreads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get threads where user is a participant
      const { data: threadParticipants, error: participantError } = await supabase
        .from('thread_participants')
        .select(`
          thread_id,
          message_threads (
            id,
            name,
            is_group,
            created_by,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .is('left_at', null);

      if (participantError) throw participantError;

      const threadIds = threadParticipants?.map(tp => tp.thread_id) || [];
      
      if (threadIds.length === 0) {
        setThreads([]);
        return;
      }

      // Get all participants for these threads
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('thread_participants')
        .select(`
          thread_id,
          user_id,
          joined_at,
          sender_profile:profiles!thread_participants_user_id_fkey (
            name,
            username
          )
        `)
        .in('thread_id', threadIds)
        .is('left_at', null);

      if (allParticipantsError) throw allParticipantsError;

      // Get latest messages for threads
      const { data: latestMessages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            name,
            username
          )
        `)
        .in('thread_id', threadIds)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Combine the data
      const threadsData: MessageThread[] = threadParticipants
        ?.map(tp => {
          const thread = tp.message_threads;
          if (!thread) return null;

          const participants = allParticipants
            ?.filter(p => p.thread_id === thread.id)
            ?.map(p => ({
              user_id: p.user_id,
              joined_at: p.joined_at,
              profiles: {
                name: p.sender_profile?.name || '',
                username: p.sender_profile?.username || ''
              }
            })) || [];

          const latestMessage = latestMessages?.find(m => m.thread_id === thread.id);

          return {
            ...thread,
            participants,
            latest_message: latestMessage
          };
        })
        .filter(Boolean) as MessageThread[];

      setThreads(threadsData);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast({
        title: "Error",
        description: "Failed to load message threads",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string, recipientId?: string, threadId?: string, projectId?: string) => {
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
          project_id: projectId
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchMessages();
      await fetchThreads();
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

  const createThread = async (name: string, participantIds: string[], isGroup: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

      // Add participants including the creator
      const allParticipants = [user.id, ...participantIds];
      const { error: participantsError } = await supabase
        .from('thread_participants')
        .insert(
          allParticipants.map(userId => ({
            thread_id: thread.id,
            user_id: userId
          }))
        );

      if (participantsError) throw participantsError;

      await fetchThreads();
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to create thread",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateThreadName = async (threadId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('message_threads')
        .update({ name: newName })
        .eq('id', threadId);

      if (error) throw error;

      await fetchThreads();
      toast({
        title: "Success",
        description: "Thread name updated successfully",
      });
    } catch (error) {
      console.error('Error updating thread name:', error);
      toast({
        title: "Error",
        description: "Failed to update thread name",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchThreads();
  }, []);

  return {
    messages,
    threads,
    loading,
    sendMessage,
    createThread,
    updateThreadName,
    refetch: () => {
      fetchMessages();
      fetchThreads();
    }
  };
};
