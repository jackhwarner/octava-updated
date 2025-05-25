
import { useState } from 'react';

interface FakeProject {
  id: string;
  title: string;
  name: string;
  description: string;
  genre: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'connections_only';
  created_at: string;
  updated_at: string;
  collaborators: Array<{
    user_id: string;
    name: string;
    username: string;
  }>;
}

export const useFakeProjects = () => {
  const [projects] = useState<FakeProject[]>([
    {
      id: '1',
      title: 'Summer Vibes',
      name: 'Summer Vibes',
      description: 'Upbeat pop track perfect for summer playlists',
      genre: 'Pop',
      status: 'active',
      visibility: 'public',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T15:30:00Z',
      collaborators: [
        { user_id: '1', name: 'Sarah Johnson', username: '@sarah_beats' },
        { user_id: '2', name: 'Marcus Williams', username: '@marcus_guitar' }
      ]
    },
    {
      id: '2',
      title: 'Midnight Drive',
      name: 'Midnight Drive',
      description: 'Chill synthwave instrumental for late night drives',
      genre: 'Electronic',
      status: 'on_hold',
      visibility: 'private',
      created_at: '2024-01-10T14:00:00Z',
      updated_at: '2024-01-18T09:15:00Z',
      collaborators: [
        { user_id: '3', name: 'Emma Chen', username: '@emma_writes' }
      ]
    },
    {
      id: '3',
      title: 'Urban Stories',
      name: 'Urban Stories',
      description: 'Hip-hop album telling stories from the city',
      genre: 'Hip-Hop',
      status: 'active',
      visibility: 'connections_only',
      created_at: '2024-01-05T12:00:00Z',
      updated_at: '2024-01-22T11:45:00Z',
      collaborators: [
        { user_id: '4', name: 'Jackson Lee', username: '@j_producer' },
        { user_id: '5', name: 'Maya Patel', username: '@maya_violin' },
        { user_id: '6', name: 'Alex Thompson', username: '@alex_drums' }
      ]
    },
    {
      id: '4',
      title: 'Jazz Fusion Experiment',
      name: 'Jazz Fusion Experiment',
      description: 'Modern take on classic jazz fusion',
      genre: 'Jazz',
      status: 'completed',
      visibility: 'public',
      created_at: '2023-12-20T16:00:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      collaborators: [
        { user_id: '7', name: 'David Kim', username: '@david_keys' },
        { user_id: '8', name: 'Sophia Martinez', username: '@sophia_voice' }
      ]
    },
    {
      id: '5',
      title: 'Acoustic Sessions',
      name: 'Acoustic Sessions',
      description: 'Intimate acoustic performances',
      genre: 'Folk',
      status: 'active',
      visibility: 'private',
      created_at: '2024-01-12T09:00:00Z',
      updated_at: '2024-01-21T16:10:00Z',
      collaborators: []
    },
    {
      id: '6',
      title: 'Electronic Dreams',
      name: 'Electronic Dreams',
      description: 'Ambient electronic soundscapes',
      genre: 'Electronic',
      status: 'cancelled',
      visibility: 'public',
      created_at: '2023-12-15T13:00:00Z',
      updated_at: '2024-01-08T10:30:00Z',
      collaborators: [
        { user_id: '9', name: 'Zoe Wang', username: '@zoe_synth' }
      ]
    }
  ]);

  const [loading] = useState(false);

  // Mock functions to match the real useProjects interface
  const addProject = async (projectData: Partial<FakeProject>) => {
    console.log('Adding project:', projectData);
    // In a real implementation, this would add to the projects array
  };

  const deleteProject = async (projectId: string) => {
    console.log('Deleting project:', projectId);
    // In a real implementation, this would remove from the projects array
  };

  return {
    projects,
    loading,
    addProject,
    deleteProject
  };
};
