import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast'; // Corrected import path

export interface SuggestedProject {
  id: string; // Project ID is string
  title: string | null; // Can be null
  description: string | null; // Can be null
  genre?: string | null; // Can be null
  budget?: number | null; // Can be null
  created_at: string | null; // Can be null
  profiles: { // To get the owner's name and username
    name: string | null; // Can be null
    username: string | null; // Can be null
  } | null; // Profile can be null
  project_collaborators: Array<{ // To get collaborator count
    id: string; // Collaborator ID is string
  }>;
  project_looking_for: Array<{ // To get looking for roles
    id: string; // Looking for ID is string
    role: string | null; // Role can be null
  }>;
}

export const useSuggestedProjects = () => {
  const [suggestedProjects, setSuggestedProjects] = useState<SuggestedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSuggestedProjects = async () => {
    try {
      setLoading(true);
      // Fetch public projects, their owner's name, collaborator count, budget, and looking_for roles
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          genre,
          budget,
          created_at,
          profiles ( name, username ),
          project_collaborators ( id ),
          project_looking_for ( id, role )
        `)
        .eq('visibility', 'public') // Only fetch public projects
        .order('created_at', { ascending: false })
        .limit(20); // Limit the number of suggested projects

      if (error) throw error;

      // Calculate collaborator count for each project
      const projectsWithCounts: SuggestedProject[] = (data || []).map(project => ({
        ...project,
        project_collaborators: project.project_collaborators || [], // Ensure it's an array
        project_looking_for: project.project_looking_for || [], // Ensure it's an array
      }));

      setSuggestedProjects(projectsWithCounts);

    } catch (error) {
      console.error('Error fetching suggested projects:', error);
      toast({
        title: "Error",
        description: "Failed to load suggested projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedProjects();
  }, []);

  return {
    suggestedProjects,
    loading,
    refetch: fetchSuggestedProjects
  };
}; 