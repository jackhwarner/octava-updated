
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, Calendar, Music } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectsTabProps {
  projects: Project[];
}

export const ProjectsTab = ({ projects }: ProjectsTabProps) => {
  const publicProjects = projects.filter(p => p.visibility === 'public');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Public Projects ({publicProjects.length})
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {publicProjects.length > 0 ? (
          <div className="grid gap-6">
            {publicProjects.map((project) => (
              <div key={project.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-lg">{project.title || project.name}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {formatStatus(project.status)}
                      </Badge>
                    </div>
                    
                    {project.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      {project.genre && (
                        <div className="flex items-center space-x-1">
                          <Music className="w-4 h-4" />
                          <span>{project.genre}</span>
                        </div>
                      )}
                      
                      {project.collaborators && project.collaborators.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project.collaborators.length} collaborator{project.collaborators.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(project.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="flex items-center space-x-3 pt-3 border-t">
                    <span className="text-sm text-gray-500">Collaborators:</span>
                    <div className="flex items-center space-x-2">
                      {project.collaborators.slice(0, 5).map((collab) => (
                        <div key={collab.id} className="flex items-center space-x-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {collab.profiles?.name?.[0] || collab.profiles?.username?.[0] || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">
                            {collab.profiles?.name || collab.profiles?.username || 'Unknown'}
                          </span>
                        </div>
                      ))}
                      {project.collaborators.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{project.collaborators.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {project.deadline && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-600">
                        Deadline: <span className="font-medium">{formatDate(project.deadline)}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No public projects yet</h3>
            <p className="text-gray-500 mb-6">Share your work with the community by making your projects public.</p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
