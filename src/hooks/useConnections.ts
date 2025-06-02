import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ConnectionStatus = 
  | 'none' 
  | 'following' 
  | 'followed_by' 
  | 'connected' 
  | 'requested' 
  | 'pending_request';

export interface ConnectionState {
  status: ConnectionStatus;
  isPrivate: boolean;
  requestMessage?: string;
  requestId?: string;
}

export const useConnections = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get the current connection state between current user and target user
  const getConnectionState = async (targetUserId: string): Promise<ConnectionState> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get target user's privacy setting
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('visibility')
        .eq('id', targetUserId)
        .single();

      const isPrivate = targetProfile?.visibility === 'private';

      // Check follow relationships
      const { data: followData } = await supabase
        .from('followers')
        .select('*')
        .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`)
        .eq('follower_id', targetUserId)
        .eq('following_id', user.id);

      // Check existing connections
      const { data: connections } = await supabase
        .from('connection_requests')
        .select('id, sender_id, receiver_id, message, status, created_at, updated_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${targetUserId}`)
        .or(`sender_id.eq.${targetUserId},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      const connection = connections?.[0];

      // Check connection requests
      const { data: connectionData } = await supabase
        .from('connection_requests')
        .select('id, sender_id, receiver_id, message, status, created_at, updated_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${targetUserId}`)
        .or(`sender_id.eq.${targetUserId},receiver_id.eq.${user.id}`)
        .eq('status', 'pending');

      let status: ConnectionStatus = 'none';

      if (connection) {
        status = 'connected';
      } else if (connectionData?.length > 0) {
        const request = connectionData[0];
        if (request.sender_id === user.id) {
          status = 'requested';
        } else {
          status = 'pending_request';
        }
      } else if (followData?.length > 0) {
        const follow = followData[0];
        if (follow.follower_id === user.id) {
          status = 'following';
        } else {
          status = 'followed_by';
        }
      }

      return {
        status,
        isPrivate,
        requestMessage: connectionData?.[0]?.message,
        requestId: connectionData?.[0]?.id
      };
    } catch (error) {
      console.error('Error getting connection state:', error);
      return { status: 'none', isPrivate: false };
    }
  };

  // Follow a user
  const followUser = async (userId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already following
      const { data: existingFollow } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      if (existingFollow) {
        toast({
          title: "Already Following",
          description: "You are already following this user",
        });
        return;
      }

      const { error: followError } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: userId,
          created_at: new Date().toISOString()
        });

      if (followError) throw followError;

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'follow',
          sender_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Success",
        description: "You are now following this user",
      });
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send connection request
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

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'connection_request',
          sender_id: user.id,
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      // Update request status
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ 
          status: 'accepted',
          updated_at: now
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'connection_accepted',
          sender_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        });

      if (notificationError) throw notificationError;

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

      const now = new Date().toISOString();
      const { error } = await supabase
        .from('connection_requests')
        .update({ 
          status: 'declined',
          updated_at: now
        })
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');

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
    followUser,
    unfollowUser,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection
  };
}; 