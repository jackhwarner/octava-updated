
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ConnectionStatus = 
  | 'none' 
  | 'connected' 
  | 'requested' 
  | 'pending_request';

export interface ConnectionState {
  status: ConnectionStatus;
  requestId?: string;
  requestMessage?: string;
}

export const useConnections = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get the current connection state between current user and target user
  const getConnectionState = async (targetUserId: string): Promise<ConnectionState> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check existing connections
      const { data: connections } = await supabase
        .from('connections')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${targetUserId},user2_id.eq.${targetUserId}`);

      const connection = connections?.find(c => 
        (c.user1_id === user.id && c.user2_id === targetUserId) ||
        (c.user1_id === targetUserId && c.user2_id === user.id)
      );

      if (connection) {
        return { status: 'connected' };
      }

      // Check connection requests
      const { data: connectionData } = await supabase
        .from('connection_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
        .eq('status', 'pending');

      const request = connectionData?.find(r =>
        (r.sender_id === user.id && r.receiver_id === targetUserId) ||
        (r.sender_id === targetUserId && r.receiver_id === user.id)
      );

      if (request) {
        if (request.sender_id === user.id) {
          return { 
            status: 'requested',
            requestId: request.id,
            requestMessage: request.message
          };
        } else {
          return { 
            status: 'pending_request',
            requestId: request.id,
            requestMessage: request.message
          };
        }
      }

      return { status: 'none' };
    } catch (error) {
      console.error('Error getting connection state:', error);
      return { status: 'none' };
    }
  };

  // Send connection request with optional message
  const sendConnectionRequest = async (userId: string, message?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      const { error: requestError } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          message,
          status: 'pending',
          created_at: now,
          updated_at: now
        });

      if (requestError) throw requestError;

      // If there's a message, send it as well
      if (message && message.trim()) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            content: message,
            sender_id: user.id,
            recipient_id: userId,
            created_at: now
          });

        if (messageError) {
          console.error('Error sending connection message:', messageError);
          // Don't throw here, the request was successful
        }

        // Update message limits
        const { error: limitError } = await supabase
          .from('message_limits')
          .upsert({
            sender_id: user.id,
            receiver_id: userId,
            message_count: 1,
            updated_at: now
          }, {
            onConflict: 'sender_id,receiver_id'
          });

        if (limitError) {
          console.error('Error updating message limits:', limitError);
        }
      }

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'connection_request',
          actor_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Success",
        description: "Connection request sent",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Accept connection request
  const acceptConnectionRequest = async (requestId: string) => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ 
          status: 'accepted',
          updated_at: now
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Connection request accepted",
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Decline connection request
  const declineConnectionRequest = async (requestId: string) => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('connection_requests')
        .update({ 
          status: 'declined',
          updated_at: now
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request declined",
      });
    } catch (error) {
      console.error('Error declining connection request:', error);
      toast({
        title: "Error",
        description: "Failed to decline connection request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove connection
  const removeConnection = async (userId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete the connection
      const { error } = await supabase
        .from('connections')
        .delete()
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection removed",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getConnectionState,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection
  };
};
