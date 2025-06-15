
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
}

export const ProjectsTab = ({
  projects,
  showHeader = false,
  onCreateProject,
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

  return (
    <Card>
      <CardHeader className="pt-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-gray-900">Projects</CardTitle>
        {onCreateProject && (
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
      <CardContent className="p-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <File className="mx-auto h-16 w-16 text-gray-300 mb-6" />
            <div className="text-2xl font-medium text-gray-500 mb-2">No projects yet</div>
            <div className="mb-6 text-gray-400 text-base">Start your first project to begin collaborating and making music!</div>
            {onCreateProject && (
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-3 rounded-xl flex items-center gap-3 border-2 border-gray-200 text-lg font-semibold"
                onClick={() => setShowDialog(true)}
              >
                <Plus className="w-5 h-5" />
                New Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const projectStatus = getProjectStatus(project);
              return (
                <Card key={project.id} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold truncate max-w-xs">{project.title || project.name}</h3>
                      <Badge className={`${projectStatus.color} text-xs px-3 py-1 rounded-full`}>
                        {projectStatus.label}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {project.description || 'No description available'}
                    </p>
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
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Current Phase: {getCurrentPhase(project)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(project.current_phase_index || 0) + 1} of {project.phases?.length || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPhaseProgress(project)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="ml-4"
                        aria-label="Open project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
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
