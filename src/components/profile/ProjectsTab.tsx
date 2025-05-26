import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';

interface ProjectsTabProps {
  userId: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            collaborators (
              id,
              user_id,
              role,
              status,
              profiles (
                name,
                username
              )
            )
          `);

        if (error) {
          throw new Error(error.message);
        }

        setProjects(data || []);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'success';
      case 'on_hold':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        {/* <Button>Add Project</Button> */}
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.genre && (
                <Badge variant="outline">{project.genre}</Badge>
              )}
              <Badge variant="outline">{project.visibility}</Badge>
            </div>

            {project.collaborators && project.collaborators.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators</h4>
                <div className="flex flex-wrap gap-2">
                  {project.collaborators.map((collab, index) => (
                    <span key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {collab.profiles?.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
              <span>Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
            </div>
          </div>
        ))}
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && projects.length === 0 && <p>No projects found.</p>}
    </div>
  );
};

export default ProjectsTab;
