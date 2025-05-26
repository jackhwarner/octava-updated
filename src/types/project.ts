
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
  folder_id?: string;
  bpm?: number;
  key?: string;
  daw?: string;
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
