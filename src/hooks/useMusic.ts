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

      // First, create the storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const musicBucket = buckets?.find(bucket => bucket.name === 'music');
      
      if (!musicBucket) {
        console.log('Creating music bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('music', {
          public: true,
          allowedMimeTypes: ['audio/*'],
          fileSizeLimit: 100 * 1024 * 1024 // 100MB
        });
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
        }
      }

      // Upload file to storage with unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to:', filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('music')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(filePath);

      console.log('File uploaded, public URL:', publicUrl);

      // Create audio element to get duration
      const audio = document.createElement('audio');
      const audioBlob = URL.createObjectURL(file);
      audio.src = audioBlob;
      
      const duration = await new Promise<number>((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration) || 0);
          URL.revokeObjectURL(audioBlob);
        });
        audio.addEventListener('error', () => {
          console.error('Error loading audio metadata');
          resolve(0);
          URL.revokeObjectURL(audioBlob);
        });
      });

      console.log('Audio duration:', duration);

      // Insert record into database
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

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Track record created:', data);
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
        description: `Failed to upload track: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const incrementPlayCount = async (trackId: string, userId: string) => {
    try {
      const currentTrack = tracks.find(t => t.id === trackId);
      if (!currentTrack) return;

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Only increment if the user is not the owner of the track
      if (user.id !== currentTrack.user_id) {
      // Increment track play count
      const { error: trackError } = await supabase
        .from('songs')
        .update({ play_count: currentTrack.play_count + 1 })
        .eq('id', trackId);

      if (trackError) throw trackError;

      // Update local state
      setTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, play_count: track.play_count + 1 }
          : track
      ));

      // Increment user's total play count
        // This part increments the profile's total_plays, which is for the track owner.
        // We should only increment this if the track owner's profile needs to reflect plays by others.
        // If the goal is for the owner's profile total_plays to reflect ALL plays, including their own, 
        // then this logic is fine. If not, this also needs a check.
        // Assuming for now that total_plays on profile means plays *by others*.
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_plays')
        .eq('id', userId)
        .single();

      const newTotalPlays = (profileData?.total_plays || 0) + 1;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ total_plays: newTotalPlays })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating user play count:', profileError);
        }
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
