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
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-6 h-12 rounded-xl flex items-center gap-2 font-medium text-base" onClick={() => setShowDialog(true)}>
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
              <CreateProjectDialog open={showDialog} onOpenChange={setShowDialog} folders={folders} onCreateProject={onCreateProject} />
            </>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length === 0 ? <div className="flex flex-col items-center justify-center py-14">
            <File className="mx-auto h-12 w-12 text-gray-300 mb-5" />
            <div className="text-xl font-medium text-gray-500 mb-2">No projects yet</div>
            <div className="mb-6 text-gray-400 text-base">Start your first project to begin collaborating and making music!</div>
            {isOwnProfile && onCreateProject && <Button variant="outline" size="lg" className="px-6 py-3 rounded-xl flex items-center gap-3 border-2 border-gray-200 text-lg font-semibold" onClick={() => setShowDialog(true)}>
                <Plus className="w-5 h-5" />
                New Project
              </Button>}
          </div> : <div className="space-y-4">
            {projects.map(project => {
          const projectStatus = getProjectStatus(project);
          return <div key={project.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50 transition-all">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="rounded-full bg-purple-100 p-2 flex items-center justify-center">
                      <Music className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base truncate">{project.title || project.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.collaborators?.length || 0} collaborators</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{project.bpm ? `${project.bpm} BPM` : 'No BPM'}</span>
                        </div>
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
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{
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