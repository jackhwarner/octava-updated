
import type { Project } from '@/types/project';

export const convertPhasesToStringArray = (phases: any): string[] => {
  if (Array.isArray(phases)) {
    return phases.filter(phase => typeof phase === 'string') as string[];
  }
  return ['Demo', 'Production', 'Mixing', 'Mastering', 'Complete'];
};

export const mapDatabaseProjectToProject = (project: any, collaboratorsData: any[] = []): Project => {
  const projectCollaborators = collaboratorsData.filter(c => c.project_id === project.id);
  
  return {
    ...project,
    status: project.status === 'paused' ? 'on_hold' : project.status as 'active' | 'completed' | 'on_hold' | 'cancelled',
    visibility: project.visibility === 'unlisted' ? 'connections_only' : project.visibility as 'public' | 'private' | 'connections_only',
    phases: convertPhasesToStringArray(project.phases),
    collaborators: projectCollaborators || []
  };
};

export const mapProjectDataToDatabase = (projectData: {
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
}, userId: string) => {
  return {
    title: projectData.title,
    name: projectData.name || projectData.title,
    description: projectData.description,
    genre: projectData.genre,
    visibility: (projectData.visibility === 'connections_only' ? 'unlisted' : projectData.visibility || 'private') as 'public' | 'private' | 'unlisted',
    owner_id: userId,
    deadline: projectData.deadline,
    budget: projectData.budget,
    status: 'active' as const,
    folder_id: projectData.folder_id,
    mood: projectData.mood,
    phases: projectData.phases || ['Demo', 'Production', 'Mixing', 'Mastering', 'Complete'],
    current_phase_index: 0,
    version_approval_enabled: projectData.version_approval_enabled || false
  };
};

export const mapProjectUpdatesToDatabase = (updates: {
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
  const dbUpdates: any = {
    ...updates,
    status: updates.status === 'on_hold' ? 'paused' : updates.status,
    visibility: updates.visibility === 'connections_only' ? 'unlisted' : updates.visibility
  };

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(dbUpdates).filter(([_, value]) => value !== undefined)
  );
};
