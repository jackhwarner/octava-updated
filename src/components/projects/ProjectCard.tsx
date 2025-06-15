import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Music, Folder as FolderIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectActions } from './ProjectActions';
import type { Project } from '@/types/project';
import type { Folder } from '@/hooks/useFolders';
interface ProjectCardProps {
  project: Project;
  folders: Folder[];
  searchTerm: string;
  onProjectUpdate: (project: Project) => void;
  onProjectDelete: (project: Project) => void;
  onShare: (project: Project) => void;
}
export const ProjectCard = ({
  project,
  folders,
  searchTerm,
  onProjectUpdate,
  onProjectDelete,
  onShare
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const getProjectStatus = (project: Project) => {
    if (!project.phases || project.phases.length === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-800'
      };
    }
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    if (currentPhase === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-800'
      };
    } else if (currentPhase >= totalPhases - 1) {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  const projectStatus = getProjectStatus(project);
  const folder = folders.find(f => f.id === project.folder_id);
  return <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title || project.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={projectStatus.color}>
                {projectStatus.label}
              </Badge>
              {project.genre && <Badge variant="outline">{project.genre}</Badge>}
            </div>
            {folder && searchTerm && <div className="flex items-center text-sm text-gray-500 mb-2">
                <div className="w-3 h-3 rounded-full mr-2" style={{
              backgroundColor: folder.color || '#3b82f6'
            }} />
                {folder.name}
              </div>}
          </div>
          <ProjectActions project={project} folders={folders} onUpdate={onProjectUpdate} onDelete={onProjectDelete} onShare={onShare} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || 'No description'}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Created {formatDate(project.created_at)}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {project.collaborators?.length || 0} collaborators
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Updated {formatDate(project.updated_at)}
          </div>
          
          {(project.bpm || project.key) && <div className="flex items-center space-x-4 text-sm text-gray-500">
              {project.bpm && <div className="flex items-center">
                  <Music className="w-4 h-4 mr-1" />
                  {project.bpm} BPM
                </div>}
              {project.key && <span>Key: {project.key}</span>}
            </div>}
          
          {project.collaborators && project.collaborators.length > 0 && <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Team:</span>
              <div className="flex -space-x-2">
                {project.collaborators.slice(0, 3).map((collaborator, index) => <div key={index} className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-xs text-purple-700">
                      {getInitials(collaborator.profiles?.name || 'U')}
                    </span>
                  </div>)}
                {project.collaborators.length > 3 && <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-xs text-gray-600">+{project.collaborators.length - 3}</span>
                  </div>}
              </div>
            </div>}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)} className="w-full text-white hover:text-white bg-purple-600 hover:bg-purple-700 ">
            Open Project
          </Button>
        </div>
      </CardContent>
    </Card>;
};