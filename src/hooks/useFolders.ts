
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const useFolders = () => {
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('project_folders')
        .select('*')
        .eq('owner_id', user.id)
        .order('name');

      if (error) throw error;

      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (folderData: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_folders')
        .insert([{
          name: folderData.name,
          description: folderData.description,
          color: folderData.color || '#6366f1',
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchFolders();
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFolder = async (id: string, updates: {
    name?: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('project_folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => prev.map(folder => 
        folder.id === id ? { ...folder, ...data } : folder
      ));
      
      toast({
        title: "Success",
        description: "Folder updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: "Error",
        description: "Failed to update folder",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== id));
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    loading,
    addFolder,
    updateFolder,
    deleteFolder,
    refetch: fetchFolders
  };
};
