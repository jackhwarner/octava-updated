
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Availability {
  id: string;
  user_id: string;
  day_of_week?: number; // 0-6 (Sunday-Saturday) for recurring
  period: 'morning' | 'afternoon' | 'evening' | 'custom';
  start_time?: string;
  end_time?: string;
  availability_type: string; // e.g. "Available to record", "Available for mixing"
  is_active?: boolean;
  created_at: string;
  is_recurring?: boolean; // New field to distinguish between recurring and one-time
  specific_date?: string; // For one-time availability
  title?: string; // For one-time events
  notes?: string; // Additional notes
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
        .eq('is_active', true)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      
      setAvailabilities(data || []);
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

      setAvailabilities(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Availability added successfully",
      });
      return data;
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
