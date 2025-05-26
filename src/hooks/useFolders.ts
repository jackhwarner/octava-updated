
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Folder {
  id: string;
  name: string;
  description?: string;
  color: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
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
        .order('created_at', { ascending: true });

      if (error) throw error;

      // If no folders exist, create the default ones
      if (!data || data.length === 0) {
        await createDefaultFolders(user.id);
        return;
      }

      setFolders(data);
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

  const createDefaultFolders = async (userId: string) => {
    try {
      const defaultFolders = [
        { name: 'Pop Projects', owner_id: userId },
        { name: 'Hip-Hop Projects', owner_id: userId },
        { name: 'Collaborations', owner_id: userId }
      ];

      const { data, error } = await supabase
        .from('project_folders')
        .insert(defaultFolders)
        .select();

      if (error) throw error;

      setFolders(data);
    } catch (error) {
      console.error('Error creating default folders:', error);
    }
  };

  const createFolder = async (name: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_folders')
        .insert([{
          name,
          description,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
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

  const updateFolder = async (folderId: string, updates: Partial<Pick<Folder, 'name' | 'description' | 'color'>>) => {
    try {
      const { data, error } = await supabase
        .from('project_folders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', folderId)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => prev.map(folder => folder.id === folderId ? data : folder));
      return data;
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      // First, remove all projects from this folder
      await supabase
        .from('projects')
        .update({ folder_id: null })
        .eq('folder_id', folderId);

      // Then delete the folder
      const { error } = await supabase
        .from('project_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== folderId));
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
      throw error;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    loading,
    createFolder,
    updateFolder,
    deleteFolder,
    refetch: fetchFolders
  };
};
