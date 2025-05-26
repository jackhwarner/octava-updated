
import { useEffect } from 'react';
import type { Project } from '@/types/project';
import { useProjectData } from './useProjectData';
import { useProjectOperations } from './useProjectOperations';

export { type Project } from '@/types/project';

export const useProjects = () => {
  const { projects, loading, setProjects, fetchProjects } = useProjectData();
  const { addProject, updateProject, deleteProject, addProjectToFolder } = useProjectOperations();

  const handleAddProject = async (projectData: Parameters<typeof addProject>[0]) => {
    const result = await addProject(projectData);
    await fetchProjects(); // Refresh the list
    return result;
  };

  const handleUpdateProject = async (id: string, updates: Parameters<typeof updateProject>[1]) => {
    const result = await updateProject(id, updates);
    setProjects(prev => prev.map(project => project.id === id ? result : project));
    return result;
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject: handleAddProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    addProjectToFolder,
    refetch: fetchProjects
  };
};
