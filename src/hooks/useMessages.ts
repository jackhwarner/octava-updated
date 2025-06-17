import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import { useMessageLimits } from './useMessageLimits';
import { useNotifications } from './useNotifications';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string | null;
  thread_id: string | null;
  project_id: string | null;
  event_invite_id: string | null;
  file_urls: string[] | null;
  read_at: string | null;
  created_at: string | null;
  sender_profile?: {
    name: string | null;
    username: string | null;
  } | null;
  recipient_profile?: {
    name: string | null;
    username: string | null;
  } | null;
}

export interface MessageThread {
  id: string;
  name: string | null;
  is_group: boolean | null;
  created_by: string;
  created_at: string | null;
  participants?: Array<{
    user_id: string;
    joined_at: string;
    profiles: {
      name: string | null;
      username: string | null;
    } | null;
  }>;
  latest_message?: Message;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const { checkMessageLimit, updateMessageLimit } = useMessageLimits();
  const { notifyNewMessage } = useNotifications();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const fetchMessages = async () => {
    try {
      const user = currentUser || (await supabase.auth.getUser()).data.user;
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
      const user = currentUser || (await supabase.auth.getUser()).data.user;
      if (!user) return;

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
                name: p.sender_profile?.name || null,
                username: p.sender_profile?.username || null
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
      const user = currentUser || (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // If we have a thread ID but no recipient ID, get the recipient from the thread
      if (threadId && !recipientId) {
        const thread = threads.find(t => t.id === threadId);
        if (thread && !thread.is_group && thread.participants?.length === 2) {
          const otherParticipant = thread.participants.find(p => p.user_id !== user.id);
          if (otherParticipant) {
            recipientId = otherParticipant.user_id;
          }
        }
      }

      // Check message limits for 1-on-1 threads with non-connected users
      if (threadId && !projectId) {
        const thread = threads.find(t => t.id === threadId);
        if (thread && !thread.is_group && thread.participants?.length === 2) {
          const otherParticipant = thread.participants.find(p => p.user_id !== user.id);
          if (otherParticipant) {
            const { canSend, messageCount } = await checkMessageLimit(otherParticipant.user_id);
            if (!canSend) {
              toast({
                title: "Message Limit Reached",
                description: `You can only send 3 messages to users you're not connected with. Connect with this user to send unlimited messages.`,
                variant: "destructive",
              });
              throw new Error('Message limit reached');
            }
          }
        }
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          sender_id: user.id,
          recipient_id: recipientId,
          thread_id: threadId,
          project_id: projectId
        }])
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
        .single();

      if (error) throw error;

      // Update message limit for non-connected users
      if (threadId && !projectId) {
        const thread = threads.find(t => t.id === threadId);
        if (thread && !thread.is_group && thread.participants?.length === 2) {
          const otherParticipant = thread.participants.find(p => p.user_id !== user.id);
          if (otherParticipant) {
            await updateMessageLimit(otherParticipant.user_id);
          }
        }
      }

      // Create notification for the recipient using the useNotifications hook
      if (recipientId && data.sender_profile) {
        await notifyNewMessage(
          recipientId,
          data.sender_profile.name || data.sender_profile.username || 'Someone',
          content
        );
      }

      setMessages(prev => [data, ...prev]);
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
      const user = currentUser || (await supabase.auth.getUser()).data.user;
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

      const allParticipants = [user.id, ...participantIds];
      const uniqueParticipants = Array.from(new Set(allParticipants));

      const { error: participantsError } = await supabase
        .from('thread_participants')
        .insert(
          uniqueParticipants.map(userId => ({
            thread_id: thread.id,
            user_id: userId
          }))
        );

      if (participantsError) throw participantsError;

      // Fetch the complete thread data with participants and latest message
      const { data: completeThread, error: fetchError } = await supabase
        .from('message_threads')
        .select(`
          *,
          participants:thread_participants(
            user_id,
            joined_at,
            profiles:profiles!thread_participants_user_id_fkey(
              name,
              username
            )
          )
        `)
        .eq('id', thread.id)
        .single();

      if (fetchError) throw fetchError;

      // Update local state with the new thread
      setThreads(prev => [{
        ...completeThread,
        participants: completeThread.participants.map((p: any) => ({
          user_id: p.user_id,
          joined_at: p.joined_at,
          profiles: p.profiles
        }))
      }, ...prev]);

      return completeThread;
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

    if (!currentUser?.id) return;

    // Set up real-time subscriptions
    const messagesChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          console.log('New message detected:', payload);
          // Fetch the complete message data with profiles
          const { data: newMessage, error } = await supabase
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
            .eq('id', payload.new.id)
            .single();

          if (!error && newMessage) {
            // Update messages state immediately
            setMessages(prev => {
              // Check if message already exists
              if (prev.some(m => m.id === newMessage.id)) {
                return prev;
              }
              return [newMessage, ...prev];
            });
            
            // Immediately fetch threads to update the latest message
            await fetchThreads();
          }
        }
      )
      .subscribe();

    const threadsChannel = supabase
      .channel('threads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_threads'
        },
        async (payload) => {
          console.log('Thread change detected:', payload);
          // Immediately fetch threads and messages
          await Promise.all([fetchThreads(), fetchMessages()]);
        }
      )
      .subscribe();

    const participantsChannel = supabase
      .channel('thread_participants')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thread_participants'
        },
        async (payload) => {
          console.log('Participant change detected:', payload);
          // Always fetch threads and messages on participant changes
          await Promise.all([fetchThreads(), fetchMessages()]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(threadsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [currentUser?.id]);

  return {
    messages,
    threads,
    loading,
    sendMessage,
    createThread,
    updateThreadName,
    currentUser,
    fetchMessages,
    fetchThreads,
  };
};
