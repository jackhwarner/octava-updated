
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Conflict {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  created_at: string;
}

export const useConflicts = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConflicts = async () => {
    try {
      const { data, error } = await supabase
        .from('conflicts')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setConflicts(data || []);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
      toast({
        title: "Error",
        description: "Failed to load conflicts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addConflict = async (conflict: {
    title: string;
    description?: string;
    start_date: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    is_all_day?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conflicts')
        .insert([{ 
          ...conflict, 
          user_id: user.id,
          is_all_day: conflict.is_all_day ?? false
        }])
        .select()
        .single();

      if (error) throw error;

      setConflicts(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Conflict added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding conflict:', error);
      toast({
        title: "Error",
        description: "Failed to add conflict",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteConflict = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conflicts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConflicts(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Conflict deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting conflict:', error);
      toast({
        title: "Error",
        description: "Failed to delete conflict",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  return {
    conflicts,
    loading,
    addConflict,
    deleteConflict,
    refetch: fetchConflicts
  };
};
