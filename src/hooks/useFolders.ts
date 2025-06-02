import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { Database } from '../integrations/supabase/types';

// Define the base Folder type from Supabase types
export type Folder = Database['public']['Tables']['project_folders']['Row'];

// Define a new type for Folder with project count
export interface FolderWithProjectCount extends Folder {
  project_count: number; // Add project_count property
}

export const useFolders = () => {
  const [folders, setFolders] = useState<FolderWithProjectCount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFolders = async () => {
    console.log('🔄 Fetching folders...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No user found, stopping folder fetch');
        setLoading(false);
        return;
      }

      console.log('👤 User found, fetching folders for:', user.id);
      const { data, error } = await supabase
        .from('project_folders')
        .select(`
          *,
          projects(count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📁 Folders fetched:', data?.length || 0);
      const foldersWithCount: FolderWithProjectCount[] = (data || []).map((folder: any) => ({
        ...folder,
        project_count: folder.projects ? folder.projects[0]?.count || 0 : 0
      }));

      console.log('✅ Setting folders state with:', foldersWithCount.length, 'folders');
      setFolders(foldersWithCount);
    } catch (error) {
      console.error('❌ Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string, description?: string, color?: string) => {
    console.log('📁 Creating new folder:', { name, description, color });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('👤 User authenticated, creating folder for:', user.id);
      const { data, error } = await supabase
        .from('project_folders')
        .insert([{
          name,
          description,
          owner_id: user.id,
          color: color || '#3b82f6',
          created_at: new Date().toISOString()
        }])
        .select(`
          *,
          projects(count)
        `)
        .single();

      if (error) throw error;

      console.log('✅ Folder created successfully:', data);
      const newFolderWithCount: FolderWithProjectCount = {
        ...data,
        project_count: data.projects ? data.projects[0]?.count || 0 : 0
      };

      console.log('📁 Updating folders state with new folder');
      setFolders(prev => {
        const updated = [...prev, newFolderWithCount];
        console.log('📁 New folders state:', updated.length, 'folders');
        return updated;
      });
      
      return newFolderWithCount;
    } catch (error) {
      console.error('❌ Error creating folder:', error);
      console.error('Detailed error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const updateFolder = async (folderId: string, updates: Partial<Omit<FolderWithProjectCount, 'project_count'>>) => {
    console.log('🔄 Attempting to update folder:', folderId, 'with updates:', updates);
    try {
      const { data, error } = await supabase
        .from('project_folders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', folderId)
        .select(`
          *,
          projects(count)
        `)
        .single();

      if (error) {
        console.error('❌ Supabase error updating folder:', error);
        throw error;
      }

      console.log('✅ Folder updated successfully in Supabase. Response data:', data);
      const updatedFolderWithCount: FolderWithProjectCount = {
        ...data,
        project_count: data.projects ? data.projects[0]?.count || 0 : 0
      };

      console.log('📁 Updating local folders state with:', updatedFolderWithCount);
      setFolders(prev => prev.map(folder => folder.id === folderId ? updatedFolderWithCount : folder));
      return updatedFolderWithCount;
    } catch (error) {
      console.error('❌ Error updating folder:', error);
      console.error('Detailed error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const deleteFolder = async (folderId: string) => {
    console.log('🗑️ Deleting folder:', folderId);
    try {
      console.log('📁 Updating projects in folder:', folderId);
      await supabase
        .from('projects')
        .update({ folder_id: null })
        .eq('folder_id', folderId);

      console.log('🗑️ Deleting folder from database');
      const { error } = await supabase
        .from('project_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      // First update local state
      setFolders(prev => {
        const updated = prev.filter(folder => folder.id !== folderId);
        console.log('📁 New folders state after deletion:', updated.length, 'folders');
        return updated;
      });

      // Then fetch fresh data from the server
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: fetchError } = await supabase
        .from('project_folders')
        .select(`
          *,
          projects(count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const foldersWithCount: FolderWithProjectCount[] = (data || []).map((folder: any) => ({
        ...folder,
        project_count: folder.projects ? folder.projects[0]?.count || 0 : 0
      }));

      console.log('📁 Setting final folders state:', foldersWithCount.length, 'folders');
      setFolders(foldersWithCount);
      
      console.log('✅ Folder deletion complete');
    } catch (error) {
      console.error('❌ Error deleting folder:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('🔄 Initial folders fetch');
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
