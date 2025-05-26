
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Save } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProjectSettingsProps {
  project: any;
}

const ProjectSettings = ({ project }: ProjectSettingsProps) => {
  const [projectName, setProjectName] = useState(project.title || project.name || '');
  const [projectGenre, setProjectGenre] = useState(project.genre || '');
  const [projectDescription, setProjectDescription] = useState(project.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { updateProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpdateProject = async () => {
    setIsUpdating(true);
    try {
      await updateProject(project.id, {
        title: projectName,
        name: projectName,
        genre: projectGenre,
        description: projectDescription
      });
      toast({
        title: "Success",
        description: "Project settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      navigate('/projects');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Blues', 'Country', 'Electronic',
    'Classical', 'Folk', 'Reggae', 'Funk', 'Soul', 'Punk', 'Metal', 'Indie',
    'Alternative', 'House', 'Techno', 'Trap', 'Lo-fi', 'Ambient', 'Other'
  ];

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <Label htmlFor="project-genre">Genre</Label>
            <Select value={projectGenre} onValueChange={setProjectGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleUpdateProject}
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Project ID</span>
            <span className="text-sm text-gray-900 font-mono">{project.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Created</span>
            <span className="text-sm text-gray-900">{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Last Updated</span>
            <span className="text-sm text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Owner</span>
            <span className="text-sm text-gray-900">You</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Delete Project</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete a project, there is no going back. This will permanently delete all files, messages, and collaborator data.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
