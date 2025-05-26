
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
  payload?: any;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (userId: string, title: string, message: string, type?: string, payload?: any) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          payload
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Notification helper functions
  const notifyProjectInvitation = async (userId: string, projectTitle: string, inviterName: string) => {
    await createNotification(
      userId,
      'Project Invitation',
      `${inviterName} invited you to collaborate on "${projectTitle}"`,
      'project_invitation',
      { type: 'project_invitation' }
    );
  };

  const notifyProjectShare = async (userId: string, projectTitle: string, sharedBy: string) => {
    await createNotification(
      userId,
      'Project Shared',
      `${sharedBy} shared the project "${projectTitle}" with you`,
      'project_share',
      { type: 'project_share' }
    );
  };

  const notifyNewMessage = async (userId: string, senderName: string, messagePreview: string) => {
    await createNotification(
      userId,
      'New Message',
      `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      'message',
      { type: 'message' }
    );
  };

  const notifyCollaborationRequest = async (userId: string, requesterName: string, projectTitle: string) => {
    await createNotification(
      userId,
      'Collaboration Request',
      `${requesterName} wants to collaborate on "${projectTitle}"`,
      'collaboration_request',
      { type: 'collaboration_request' }
    );
  };

  const notifyFileUpload = async (userId: string, fileName: string, uploaderName: string, projectTitle: string) => {
    await createNotification(
      userId,
      'New File Uploaded',
      `${uploaderName} uploaded "${fileName}" to "${projectTitle}"`,
      'file_upload',
      { type: 'file_upload' }
    );
  };

  const notifyTaskAssignment = async (userId: string, taskTitle: string, assignerName: string, projectTitle: string) => {
    await createNotification(
      userId,
      'Task Assigned',
      `${assignerName} assigned you the task "${taskTitle}" in "${projectTitle}"`,
      'task_assignment',
      { type: 'task_assignment' }
    );
  };

  const notifyEventInvitation = async (userId: string, eventName: string, inviterName: string) => {
    await createNotification(
      userId,
      'Event Invitation',
      `${inviterName} invited you to "${eventName}"`,
      'event_invitation',
      { type: 'event_invitation' }
    );
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.' + supabase.auth.getUser().then(({ data }) => data.user?.id)
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    // Notification creators
    notifyProjectInvitation,
    notifyProjectShare,
    notifyNewMessage,
    notifyCollaborationRequest,
    notifyFileUpload,
    notifyTaskAssignment,
    notifyEventInvitation,
    createNotification
  };
};
