
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

interface RecentProjectsProps {
  onNavigate: (tab: string) => void;
}

const RecentProjects = ({
  onNavigate
}: RecentProjectsProps) => {
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

  // Get the 2 most recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 2);

  const getProjectStatus = (project: any) => {
    if (!project.phases || project.phases.length === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-800' };
    }
    
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    
    if (currentPhase === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-800' };
    } else if (currentPhase >= totalPhases - 1) {
      return { label: 'Completed', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 14) return '1 week ago';
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects yet. Start by creating your first project!</p>
            </div>
          ) : (
            recentProjects.map(project => {
              const projectStatus = getProjectStatus(project);
              return (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{project.title || project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.collaborators?.length || 0} collaborators
                      </div>
                      <div>Updated {formatTimeAgo(project.updated_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={projectStatus.color}>
                      {projectStatus.label}
                    </Badge>
                    <Button size="sm" onClick={() => handleProjectClick(project.id)} className="bg-purple-600 hover:bg-purple-700">
                      View Project
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
