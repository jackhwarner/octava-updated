
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMessageLimits = () => {
  const { toast } = useToast();

  const checkConnectionStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if users are connected
      const { data: connections } = await supabase
        .from('connections')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      const isConnected = connections?.some(c => 
        (c.user1_id === user.id && c.user2_id === userId) ||
        (c.user1_id === userId && c.user2_id === user.id)
      );

      return isConnected || false;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  };

  const checkMessageLimit = async (recipientId: string): Promise<{ canSend: boolean; messageCount: number }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { canSend: false, messageCount: 0 };

      // Check if users are connected
      const isConnected = await checkConnectionStatus(recipientId);
      if (isConnected) {
        return { canSend: true, messageCount: 0 };
      }

      // Check message limits for non-connected users
      const { data: limits } = await supabase
        .from('message_limits')
        .select('message_count')
        .eq('sender_id', user.id)
        .eq('receiver_id', recipientId)
        .single();

      const messageCount = limits?.message_count || 0;
      const canSend = messageCount < 3;

      return { canSend, messageCount };
    } catch (error) {
      console.error('Error checking message limit:', error);
      return { canSend: false, messageCount: 0 };
    }
  };

  const updateMessageLimit = async (recipientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();
      const { error } = await supabase
        .from('message_limits')
        .upsert({
          sender_id: user.id,
          receiver_id: recipientId,
          message_count: 1,
          updated_at: now
        }, {
          onConflict: 'sender_id,receiver_id',
          count: 'exact'
        });

      if (error) {
        // If upsert failed, try to increment existing record
        const { error: incrementError } = await supabase.rpc('increment_message_count', {
          p_sender_id: user.id,
          p_receiver_id: recipientId
        });

        if (incrementError) {
          console.error('Error updating message limit:', incrementError);
        }
      }
    } catch (error) {
      console.error('Error updating message limit:', error);
    }
  };

  return {
    checkConnectionStatus,
    checkMessageLimit,
    updateMessageLimit
  };
};
