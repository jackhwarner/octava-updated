import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, ExternalLink, Calendar, Users, Clock, Plus, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/hooks/useProjects';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useFolders } from '@/hooks/useFolders';
import React, { useState } from 'react';
interface ProjectsTabProps {
  projects: Project[];
  showHeader?: boolean;
  onCreateProject?: (projectData: any) => Promise<void>;
  isOwnProfile?: boolean;
}
export const ProjectsTab = ({
  projects,
  showHeader = false,
  onCreateProject,
  isOwnProfile = true
}: ProjectsTabProps) => {
  const navigate = useNavigate();
  const {
    folders
  } = useFolders();
  const [showDialog, setShowDialog] = useState(false);

  // Utility functions for project details
  const getProjectStatus = (project: Project) => {
    if (!project.phases || project.phases.length === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-700'
      };
    }
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    if (currentPhase === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-700'
      };
    } else if (currentPhase >= totalPhases - 1) {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-700'
      };
    } else {
      return {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-700'
      };
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
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
    return ((project.current_phase_index || 0) + 1) / project.phases.length * 100;
  };
  return <Card>
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="flex items-center justify-between font-semibold text-2xl">
          Projects
          {isOwnProfile && onCreateProject && <>
              
              <CreateProjectDialog open={showDialog} onOpenChange={setShowDialog} folders={folders} onCreateProject={onCreateProject} />
            </>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length === 0 ? <div className="text-center py-8">
            <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-gray-500 mb-4 text-base">No projects yet</div>
            {isOwnProfile && onCreateProject}
          </div> : <div className="space-y-4">
            {projects.map(project => {
          const projectStatus = getProjectStatus(project);
          return <div key={project.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4 flex-1">
                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 cursor-default pointer-events-none">
                      <Music className="w-5 h-5 text-purple-600" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base">{project.title || project.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                        <span>•</span>
                        <Users className="w-4 h-4" />
                        <span>{project.collaborators?.length || 0} collaborators</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{project.bpm ? `${project.bpm} BPM` : 'No BPM'}</span>
                        <span>•</span>
                        <span>{projectStatus.label}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Current Phase: {getCurrentPhase(project)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(project.current_phase_index || 0) + 1} of {project.phases?.length || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                        <div className="bg-purple-600 h-1 rounded-full transition-all duration-300" style={{
                    width: `${getPhaseProgress(project)}%`
                  }}></div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)} className="ml-4" aria-label="Open project">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>;
        })}
          </div>}
      </CardContent>
    </Card>;
};