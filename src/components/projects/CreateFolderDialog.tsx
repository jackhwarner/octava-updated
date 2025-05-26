
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderPlus } from 'lucide-react';
import { useState } from 'react';

interface CreateFolderDialogProps {
  onCreateFolder: (name: string, description?: string) => Promise<void>;
}

export const CreateFolderDialog = ({ onCreateFolder }: CreateFolderDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    color: '#6366f1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateFolder(newFolder.name, newFolder.description);
      setIsOpen(false);
      setNewFolder({
        name: '',
        description: '',
        color: '#6366f1'
      });
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-3">
          <FolderPlus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="folderName">Folder Name</Label>
            <Input 
              id="folderName" 
              value={newFolder.name} 
              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })} 
              placeholder="Enter folder name" 
              required 
            />
          </div>
          <div>
            <Label htmlFor="folderDescription">Description</Label>
            <Textarea 
              id="folderDescription" 
              value={newFolder.description} 
              onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })} 
              placeholder="Enter folder description" 
            />
          </div>
          <div>
            <Label htmlFor="folderColor">Color</Label>
            <Input 
              id="folderColor" 
              type="color" 
              value={newFolder.color} 
              onChange={(e) => setNewFolder({ ...newFolder, color: e.target.value })} 
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Folder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
