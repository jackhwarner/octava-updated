import { useState, useEffect } from 'react';
import type { Project } from '@/types/project';
import { useProjectOperations } from './useProjectOperations';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { mapDatabaseProjectToProject } from '@/utils/projectMapper'; // Import mapper

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addProject: projectOperationsAddProject, updateProject: projectOperationsUpdateProject, deleteProject: projectOperationsDeleteProject, addProjectToFolder } = useProjectOperations();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching projects...');
      // Fetch projects and related collaborators
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_collaborators(*)'); 

      if (error) throw error;

      // Map database data to frontend Project type
      // Assuming mapDatabaseProjectToProject can handle the structure with embedded collaborators
      const mappedProjects = data.map(project => mapDatabaseProjectToProject(project, project.project_collaborators || []));
      console.log('📊 Projects fetched:', mappedProjects.length);
      setProjects(mappedProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []); // Fetch projects on component mount

  const handleAddProject = async (projectData: Parameters<typeof projectOperationsAddProject>[0]) => {
    try {
      setLoading(true); // Indicate loading during operation
      const result = await projectOperationsAddProject(projectData);
      await fetchProjects(); // Refresh the list
      return result;
    } catch (err) {
      setError('Failed to add project'); // Set error if needed
      throw err; // Re-throw to allow calling component to handle
    } finally {
       setLoading(false);
    }
  };

  const handleUpdateProject = async (id: string, updates: Parameters<typeof projectOperationsUpdateProject>[1]) => {
     try {
      setLoading(true); // Indicate loading during operation
      const result = await projectOperationsUpdateProject(id, updates);
      await fetchProjects(); // Refresh the list
      return result; // Return updated project data
    } catch (err) {
       setError('Failed to update project'); // Set error if needed
       throw err; // Re-throw to allow calling component to handle
    } finally {
       setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      setLoading(true); // Indicate loading during operation
      await projectOperationsDeleteProject(id);
      // Update local state immediately instead of refetching
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError('Failed to delete project'); // Set error if needed
      throw err; // Re-throw to allow calling component to handle
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectToFolder = async (projectId: string, folderId: string) => {
     try {
      setLoading(true); // Indicate loading during operation
      await addProjectToFolder(projectId, folderId);
      await fetchProjects(); // Refresh the list
    } catch (err) {
       setError('Failed to add project to folder'); // Set error if needed
       throw err; // Re-throw to allow calling component to handle
    } finally {
       setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    addProject: handleAddProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    addProjectToFolder: handleAddProjectToFolder,
    refetch: fetchProjects // Provide refetch function
  };
};
