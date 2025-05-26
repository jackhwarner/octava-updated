
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/project';
import { mapDatabaseProjectToProject } from '@/utils/projectMapper';

export const useProjectData = () => {
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
      const mappedProjects: Project[] = allProjects.map(project => 
        mapDatabaseProjectToProject(project, collaboratorsData)
      );

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

  return {
    projects,
    loading,
    setProjects,
    fetchProjects
  };
};
