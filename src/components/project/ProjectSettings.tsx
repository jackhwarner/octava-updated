import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';

interface ProjectSettingsProps {
  project: any;
}

const ProjectSettings = ({ project }: ProjectSettingsProps) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    genre: project.genre || '',
    status: project.status || 'active',
    visibility: project.visibility || 'private',
    deadline: project.deadline || '',
    budget: project.budget || '',
    mood: project.mood || '',
    version_approval_enabled: project.version_approval_enabled || false
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { updateProject, deleteProject } = useProjects();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(project.id, {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        status: formData.status as any,
        visibility: formData.visibility as any,
        deadline: formData.deadline || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        mood: formData.mood,
        version_approval_enabled: formData.version_approval_enabled
      });
      toast({
        title: "Settings saved",
        description: "Project settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(project.id);
        toast({
          title: "Project deleted",
          description: "The project has been permanently deleted."
        });
        // Navigate back will be handled by the hook
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => handleInputChange('title', e.target.value)} 
                placeholder="Enter project title" 
              />
            </div>
            
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input 
                id="genre" 
                value={formData.genre} 
                onChange={e => handleInputChange('genre', e.target.value)} 
                placeholder="e.g., Pop, Rock, Hip Hop" 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={e => handleInputChange('description', e.target.value)} 
              placeholder="Describe your project..." 
              rows={3} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={formData.visibility} onValueChange={value => handleInputChange('visibility', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="connections_only">Connections Only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={formData.deadline} 
                onChange={e => handleInputChange('deadline', e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="version-approval">Replacement Mode</Label>
              <p className="text-sm text-gray-500">If you upload a file with the same name, the old file is replaced.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600 mb-2">Delete Project</h4>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. All project data, files, and collaborations will be permanently deleted.
              </p>
              <Button variant="destructive" onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
