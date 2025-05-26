
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MusicTrack {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  duration: number;
  file_size: number;
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  user_id: string;
  play_count: number;
}

export const useMusic = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTracks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load tracks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadTrack = async (file: File, title: string) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `music/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('music')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(filePath);

      // Create audio element to get duration
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration));
        });
      });

      const { data, error } = await supabase
        .from('songs')
        .insert([{
          title,
          file_url: publicUrl,
          file_type: file.type,
          duration,
          file_size: file.size,
          user_id: user.id,
          visibility: 'public' as const,
          play_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setTracks(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Track uploaded successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error uploading track:', error);
      toast({
        title: "Error",
        description: "Failed to upload track",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const incrementPlayCount = async (trackId: string, userId: string) => {
    try {
      // Increment track play count using raw SQL
      const { error: trackError } = await supabase
        .from('songs')
        .update({ play_count: tracks.find(t => t.id === trackId)?.play_count + 1 || 1 })
        .eq('id', trackId);

      if (trackError) throw trackError;

      // Update local state
      setTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, play_count: track.play_count + 1 }
          : track
      ));

      // Increment user's total play count
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ total_plays: (await supabase.from('profiles').select('total_plays').eq('id', userId).single()).data?.total_plays + 1 || 1 })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating user play count:', profileError);
      }
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  };

  const deleteTrack = async (trackId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.filter(track => track.id !== trackId));
      toast({
        title: "Success",
        description: "Track deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      toast({
        title: "Error",
        description: "Failed to delete track",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return {
    tracks,
    loading,
    uploading,
    uploadTrack,
    deleteTrack,
    incrementPlayCount,
    refetch: fetchTracks
  };
};
