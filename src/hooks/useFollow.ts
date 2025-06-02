import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useFollow = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const follow = async (userId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to follow users",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create follower relationship
      const { error: followerError } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: userId
        });

      if (followerError) {
        console.error('Error creating follower relationship:', followerError);
        throw followerError;
      }

      // Create connection request
      const { error: connectionError } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          status: 'pending'
        });

      if (connectionError) {
        console.error('Error creating connection request:', connectionError);
        throw connectionError;
      }

      toast({
        title: "Success",
        description: "Follow request sent successfully",
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

  const unfollow = async (userId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to unfollow users",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Delete follower relationship
      const { error: followerError } = await supabase
        .from('followers')
        .delete()
        .match({
          follower_id: user.id,
          following_id: userId
        });

      if (followerError) {
        console.error('Error deleting follower relationship:', followerError);
        throw followerError;
      }

      // Delete any pending connection requests
      const { error: connectionError } = await supabase
        .from('connection_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${userId}`)
        .eq('status', 'pending');

      if (connectionError) {
        console.error('Error deleting connection requests:', connectionError);
        throw connectionError;
      }

      toast({
        title: "Success",
        description: "Unfollowed successfully",
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

  return {
    follow,
    unfollow,
    loading
  };
}; 