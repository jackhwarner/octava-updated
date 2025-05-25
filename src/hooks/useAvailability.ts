
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Availability {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  category: string;
  title?: string;
  notes?: string;
  created_at: string;
}

export const useAvailability = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_availability')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Map the data to match our interface
      const mappedData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        date: item.date,
        start_time: item.start_time,
        end_time: item.end_time,
        category: item.category || 'open',
        title: item.title || undefined,
        notes: item.notes || undefined,
        created_at: item.created_at
      }));
      
      setAvailabilities(mappedData);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async (availability: Omit<Availability, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_availability')
        .insert([{ ...availability, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const mappedData = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        category: data.category || 'open',
        title: data.title || undefined,
        notes: data.notes || undefined,
        created_at: data.created_at
      };

      setAvailabilities(prev => [...prev, mappedData]);
      toast({
        title: "Success",
        description: "Availability added successfully",
      });
      return mappedData;
    } catch (error) {
      console.error('Error adding availability:', error);
      toast({
        title: "Error",
        description: "Failed to add availability",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_availability')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAvailabilities(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Availability deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast({
        title: "Error",
        description: "Failed to delete availability",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  return {
    availabilities,
    loading,
    addAvailability,
    deleteAvailability,
    refetch: fetchAvailabilities
  };
};
