
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  name: string;
  description?: string;
  genre?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  visibility: 'public' | 'private' | 'connections_only';
  owner_id: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  budget?: number;
  collaborators?: Array<{
    id: string;
    user_id: string;
    role?: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    profiles: {
      name: string;
      username: string;
    };
  }>;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_collaborators (
            id,
            user_id,
            role,
            status,
            profiles (
              name,
              username
            )
          )
        `)
        .or(`owner_id.eq.${user.id},project_collaborators.user_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: {
    title: string;
    name?: string;
    description?: string;
    genre?: string;
    visibility?: 'public' | 'private' | 'connections_only';
    deadline?: string;
    budget?: number;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          name: projectData.name || projectData.title,
          description: projectData.description,
          genre: projectData.genre,
          visibility: projectData.visibility || 'private',
          owner_id: user.id,
          deadline: projectData.deadline,
          budget: projectData.budget,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchProjects(); // Refresh the list
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
  }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(project => project.id === id ? data : project));
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      return data;
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

      setProjects(prev => prev.filter(project => project.id !== id));
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

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};
