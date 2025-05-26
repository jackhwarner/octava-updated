
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Music, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/hooks/useProjects';

interface ProjectsTabProps {
  projects: Project[];
}

export const ProjectsTab = ({ projects }: ProjectsTabProps) => {
  const navigate = useNavigate();

  const getProjectStatus = (project: Project) => {
    if (!project.phases || project.phases.length === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-700' };
    }
    
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    
    if (currentPhase === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-700' };
    } else if (currentPhase >= totalPhases - 1) {
      return { label: 'Completed', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentPhase = (project: Project) => {
    return project.phases?.[project.current_phase_index || 0] || 'Unknown';
  };

  const getPhaseProgress = (project: Project) => {
    if (!project.phases) return 0;
    return (((project.current_phase_index || 0) + 1) / project.phases.length) * 100;
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Button onClick={() => navigate('/projects')}>
            Create Your First Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const projectStatus = getProjectStatus(project);
        
        return (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{project.title || project.name}</h3>
                    <Badge className={projectStatus.color}>
                      {projectStatus.label}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.description || 'No description available'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="ml-4"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Music className="w-4 h-4" />
                  <span>{project.genre || 'No genre'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{project.bpm ? `${project.bpm} BPM` : 'No BPM'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{project.collaborators?.length || 0} collaborators</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Current Phase: {getCurrentPhase(project)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(project.current_phase_index || 0) + 1} of {project.phases?.length || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getPhaseProgress(project)}%` }}
                  ></div>
                </div>
              </div>

              {(project.key || project.mood) && (
                <div className="flex gap-2 mt-3">
                  {project.key && (
                    <Badge variant="outline" className="text-xs">
                      Key: {project.key}
                    </Badge>
                  )}
                  {project.mood && (
                    <Badge variant="outline" className="text-xs">
                      {project.mood}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
