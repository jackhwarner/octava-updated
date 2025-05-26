
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
  folder_id?: string;
  bpm?: number;
  key?: string;
  daw?: string;
  mood?: string;
  phases?: string[];
  current_phase_index?: number;
  version_approval_enabled?: boolean;
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

      // Get projects owned by user
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

      if (ownedError) {
        console.error('Owned projects error:', ownedError);
        throw ownedError;
      }

      // Get collaborator data separately
      const projectIds = ownedProjects?.map(p => p.id) || [];
      let collaboratorsData: any[] = [];
      
      if (projectIds.length > 0) {
        const { data: collabData, error: collabError } = await supabase
          .from('project_collaborators')
          .select(`
            id,
            user_id,
            role,
            status,
            project_id,
            profiles (
              name,
              username
            )
          `)
          .in('project_id', projectIds);

        if (!collabError) {
          collaboratorsData = collabData || [];
        }
      }

      // Get projects where user is a collaborator
      const { data: userCollabProjects, error: userCollabError } = await supabase
        .from('project_collaborators')
        .select(`
          project_id,
          projects (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      let collabProjects: any[] = [];
      if (!userCollabError && userCollabProjects) {
        collabProjects = userCollabProjects
          .map(cp => cp.projects)
          .filter(p => p !== null);
      }

      // Combine all projects
      const allProjects = [...(ownedProjects || []), ...collabProjects];

      // Map to our interface
      const mappedProjects: Project[] = allProjects.map(project => {
        const projectCollaborators = collaboratorsData.filter(c => c.project_id === project.id);
        
        return {
          ...project,
          status: project.status === 'paused' ? 'on_hold' : project.status as 'active' | 'completed' | 'on_hold' | 'cancelled',
          visibility: project.visibility === 'unlisted' ? 'connections_only' : project.visibility as 'public' | 'private' | 'connections_only',
          collaborators: projectCollaborators || []
        };
      });

      setProjects(mappedProjects);
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
    folder_id?: string;
    bpm?: number;
    key?: string;
    daw?: string;
    mood?: string;
    phases?: string[];
    version_approval_enabled?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map our interface values to database values with proper typing
      const dbData = {
        title: projectData.title,
        name: projectData.name || projectData.title,
        description: projectData.description,
        genre: projectData.genre,
        visibility: (projectData.visibility === 'connections_only' ? 'unlisted' : projectData.visibility || 'private') as 'public' | 'private' | 'unlisted',
        owner_id: user.id,
        deadline: projectData.deadline,
        budget: projectData.budget,
        status: 'active' as const,
        folder_id: projectData.folder_id,
        bpm: projectData.bpm,
        key: projectData.key,
        daw: projectData.daw,
        mood: projectData.mood,
        phases: projectData.phases || ['Demo', 'Production', 'Mixing', 'Mastering', 'Complete'],
        current_phase_index: 0,
        version_approval_enabled: projectData.version_approval_enabled || false
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([dbData])
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
    folder_id?: string;
    bpm?: number;
    key?: string;
    daw?: string;
    mood?: string;
    phases?: string[];
    current_phase_index?: number;
    version_approval_enabled?: boolean;
  }) => {
    try {
      // Map our interface values to database values with proper typing
      const dbUpdates: any = {
        ...updates,
        status: updates.status === 'on_hold' ? 'paused' : updates.status,
        visibility: updates.visibility === 'connections_only' ? 'unlisted' : updates.visibility
      };

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(dbUpdates).filter(([_, value]) => value !== undefined)
      );

      const { data, error } = await supabase
        .from('projects')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Map back for our interface
      const mappedProject: Project = {
        ...data,
        status: data.status === 'paused' ? 'on_hold' : data.status as 'active' | 'completed' | 'on_hold' | 'cancelled',
        visibility: data.visibility === 'unlisted' ? 'connections_only' : data.visibility as 'public' | 'private' | 'connections_only'
      };

      setProjects(prev => prev.map(project => project.id === id ? mappedProject : project));
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

  const addProjectToFolder = async (projectId: string, folderId: string) => {
    try {
      await updateProject(projectId, { folder_id: folderId });
    } catch (error) {
      console.error('Error adding project to folder:', error);
      throw error;
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
    addProjectToFolder,
    refetch: fetchProjects
  };
};
