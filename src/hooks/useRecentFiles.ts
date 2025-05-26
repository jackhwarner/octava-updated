
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RecentFile {
  id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  created_at: string;
  project_id: string;
  uploader: {
    name: string;
    username: string;
  };
  projects: {
    title: string;
    name: string;
  };
}

export const useRecentFiles = () => {
  const [files, setFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecentFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('project_files')
        .select(`
          id,
          file_name,
          file_type,
          file_path,
          file_size,
          created_at,
          project_id,
          uploader:profiles!project_files_uploaded_by_fkey (
            name,
            username
          ),
          projects (
            title,
            name
          )
        `)
        .eq('uploaded_by', user.id)
        .eq('is_pending_approval', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching recent files:', error);
      toast({
        title: "Error",
        description: "Failed to load recent files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  return {
    files,
    loading,
    refetch: fetchRecentFiles
  };
};
