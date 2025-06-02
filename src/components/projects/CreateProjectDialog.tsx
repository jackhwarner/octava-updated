import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState, ChangeEvent } from 'react';
import type { Folder } from '@/hooks/useFolders';

interface CreateProjectDialogProps {
  folders: Folder[];
  onCreateProject: (projectData: any) => Promise<void>;
}

interface ProjectFormData {
  title: string;
  description: string;
  genre: string;
  visibility: 'private' | 'public' | 'connections_only';
  deadline: string;
  folder_id: string;
}

export const CreateProjectDialog = ({ folders, onCreateProject }: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState<ProjectFormData>({
    title: '',
    description: '',
    genre: '',
    visibility: 'private',
    deadline: '',
    folder_id: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewProject(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof ProjectFormData, value: string) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        genre: newProject.genre,
        visibility: newProject.visibility,
        deadline: newProject.deadline || undefined,
        folder_id: newProject.folder_id || undefined
      };
      
      await onCreateProject(projectData);
      setIsOpen(false);
      setNewProject({
        title: '',
        description: '',
        genre: '',
        visibility: 'private',
        deadline: '',
        folder_id: ''
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                value={newProject.title} 
                onChange={handleInputChange}
                placeholder="Enter project title" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select 
                value={newProject.genre} 
                onValueChange={(value) => handleSelectChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="R&B">R&B</SelectItem>
                  <SelectItem value="Jazz">Jazz</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                  <SelectItem value="Country">Country</SelectItem>
                  <SelectItem value="Folk">Folk</SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Blues">Blues</SelectItem>
                  <SelectItem value="Reggae">Reggae</SelectItem>
                  <SelectItem value="Soul">Soul</SelectItem>
                  <SelectItem value="Funk">Funk</SelectItem>
                  <SelectItem value="Gospel">Gospel</SelectItem>
                  <SelectItem value="World">World</SelectItem>
                  <SelectItem value="Experimental">Experimental</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newProject.description} 
              onChange={handleInputChange}
              placeholder="Describe your project..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={newProject.deadline} 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="folder">Folder</Label>
              <Select 
                value={newProject.folder_id} 
                onValueChange={(value) => handleSelectChange('folder_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <Select 
              value={newProject.visibility} 
              onValueChange={(value) => handleSelectChange('visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="connections_only">Connections Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
