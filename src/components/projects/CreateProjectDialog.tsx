
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Folder } from '@/hooks/useFolders';

interface CreateProjectDialogProps {
  folders: Folder[];
  onCreateProject: (projectData: any) => Promise<void>;
}

export const CreateProjectDialog = ({ folders, onCreateProject }: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    genre: '',
    visibility: 'private',
    deadline: '',
    folder_id: '',
    bpm: '',
    key: '',
    daw: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        genre: newProject.genre,
        visibility: newProject.visibility as 'public' | 'private' | 'connections_only',
        deadline: newProject.deadline || undefined,
        folder_id: newProject.folder_id || undefined,
        bpm: newProject.bpm ? parseInt(newProject.bpm) : undefined,
        key: newProject.key,
        daw: newProject.daw
      };
      
      await onCreateProject(projectData);
      setIsOpen(false);
      setNewProject({
        title: '',
        description: '',
        genre: '',
        visibility: 'private',
        deadline: '',
        folder_id: '',
        bpm: '',
        key: '',
        daw: ''
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
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} 
                placeholder="Enter project title" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input 
                id="genre" 
                value={newProject.genre} 
                onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })} 
                placeholder="e.g., Hip-Hop, Pop, Rock" 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newProject.description} 
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
              placeholder="Describe your project..." 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bpm">BPM</Label>
              <Input 
                id="bpm" 
                type="number" 
                value={newProject.bpm} 
                onChange={(e) => setNewProject({ ...newProject, bpm: e.target.value })} 
                placeholder="120" 
              />
            </div>
            <div>
              <Label htmlFor="key">Key</Label>
              <Input 
                id="key" 
                value={newProject.key} 
                onChange={(e) => setNewProject({ ...newProject, key: e.target.value })} 
                placeholder="C Major" 
              />
            </div>
            <div>
              <Label htmlFor="daw">DAW</Label>
              <Input 
                id="daw" 
                value={newProject.daw} 
                onChange={(e) => setNewProject({ ...newProject, daw: e.target.value })} 
                placeholder="Pro Tools, Logic, etc." 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={newProject.deadline} 
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} 
              />
            </div>
            <div>
              <Label htmlFor="folder">Folder</Label>
              <Select value={newProject.folder_id} onValueChange={(value) => setNewProject({ ...newProject, folder_id: value })}>
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
            <Select value={newProject.visibility} onValueChange={(value) => setNewProject({ ...newProject, visibility: value })}>
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
