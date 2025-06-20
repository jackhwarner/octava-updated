
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/project';
import { mapProjectDataToDatabase, mapProjectUpdatesToDatabase, mapDatabaseProjectToProject } from '@/utils/projectMapper';

export const useProjectOperations = () => {
  const { toast } = useToast();

  const addProject = async (projectData: {
    title: string;
    name?: string;
    description?: string;
    genre?: string;
    visibility?: 'public' | 'private' | 'connections_only';
    deadline?: string;
    budget?: number;
    folder_id?: string;
    mood?: string;
    phases?: string[];
    version_approval_enabled?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbData = mapProjectDataToDatabase(projectData, user.id);

      const { data, error } = await supabase
        .from('projects')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProject = async (id: string, updates: {
    title?: string;
    name?: string;
    description?: string;
    genre?: string;
    status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
    visibility?: 'public' | 'private' | 'connections_only';
    deadline?: string;
    budget?: number;
    folder_id?: string;
    mood?: string;
    phases?: string[];
    current_phase_index?: number;
    version_approval_enabled?: boolean;
  }) => {
    try {
      const cleanUpdates = {
        ...mapProjectUpdatesToDatabase(updates),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedProject = mapDatabaseProjectToProject(data);

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      return mappedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const addProjectToFolder = async (projectId: string, folderId: string) => {
    try {
      await updateProject(projectId, { folder_id: folderId });
    } catch (error) {
      console.error('Error adding project to folder:', error);
      throw error;
    }
  };

  return {
    addProject,
    updateProject,
    deleteProject,
    addProjectToFolder
  };
};
