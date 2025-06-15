import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, ExternalLink, Calendar, Users, Clock, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/hooks/useProjects';
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useFolders } from '@/hooks/useFolders';
import { useState } from 'react';

interface ProjectsTabProps {
  projects: Project[];
  showHeader?: boolean;
  onCreateProject?: (projectData: any) => Promise<void>;
  compact?: boolean; // add compact prop (streamlined for profile modal)
}

export const ProjectsTab = ({
  projects,
  showHeader = false,
  onCreateProject,
  compact = false,
}: ProjectsTabProps) => {
  const navigate = useNavigate();
  const { folders } = useFolders();
  const [showDialog, setShowDialog] = useState(false);

  // Utility functions for project details (status, dates, etc)
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
    return (((project.current_phase_index || 0) + 1) / project.phases.length) * 100;
  };

  // Compact/streamlined design for full profile popup
  return (
    <Card>
      <CardHeader className="pt-4 pb-0 flex-row items-center justify-between" style={{display: compact ? 'none' : undefined}}>
        {!compact && (
          <CardTitle className="text-2xl font-bold text-gray-900">Projects</CardTitle>
        )}
        {/* No new project button if compact */}
        {!compact && !!onCreateProject && (
          <>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 h-12 rounded-xl flex items-center gap-2 font-medium text-base"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
            <CreateProjectDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              folders={folders}
              onCreateProject={onCreateProject}
            />
          </>
        )}
      </CardHeader>
      <CardContent className={`p-0 ${compact ? '' : 'p-8'}`}>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <File className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <div className="text-lg font-medium text-gray-500 mb-1">No projects yet</div>
            <div className="mb-6 text-gray-400 text-base">No past collaborations or projects to show.</div>
          </div>
        ) : (
          <div className={`flex flex-col gap-4`}>
            {projects.map((project) => {
              const projectStatus = getProjectStatus(project);
              return (
                <Card key={project.id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold truncate max-w-xs">{project.title || project.name}</h3>
                      <Badge className={`${projectStatus.color} text-xs px-2 py-0.5 rounded-full`}>
                        {projectStatus.label}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Music className="w-4 h-4" />
                        <span>{project.genre || 'No genre'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{project.bpm ? `${project.bpm} BPM` : 'No BPM'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project.collaborators?.length || 0} collaborators</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Current Phase: {getCurrentPhase(project)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(project.current_phase_index || 0) + 1} of {project.phases?.length || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                      <div
                        className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${getPhaseProgress(project)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="ml-4 text-purple-600 hover:text-purple-800 bg-transparent flex items-center gap-1 text-xs font-semibold"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        aria-label="Open project"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
