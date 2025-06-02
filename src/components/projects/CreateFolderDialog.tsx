import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderPlus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFolders } from '@/hooks/useFolders';
import FolderColorPicker from '@/components/folder/FolderColorPicker';

interface CreateFolderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCreateFolder: () => void;
}

export const CreateFolderDialog = ({ isOpen, setIsOpen, onCreateFolder }: CreateFolderDialogProps) => {
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
  });
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const { createFolder, loading: creating, refetch } = useFolders();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolder.name.trim()) return;

    console.log('📝 Starting folder creation process');
    try {
      console.log('📁 Creating folder with data:', { 
        name: newFolder.name.trim(), 
        description: newFolder.description || undefined, 
        color: selectedColor 
      });
      
      await createFolder(newFolder.name.trim(), newFolder.description || undefined, selectedColor);
      
      console.log('✅ Folder created, resetting form');
      // Reset form
      setNewFolder({ name: '', description: '' });
      setSelectedColor('#3b82f6');
      
      console.log('📁 Closing dialog');
      // Close dialog
      setIsOpen(false);
      
      console.log('🔄 Refetching folders');
      // Refetch folders to update the list
      await refetch();
      
      console.log('📁 Calling onCreateFolder callback');
      // Call the onCreateFolder callback
      onCreateFolder();
      
      toast({
        title: "Success",
        description: "Folder created successfully.",
      });
      console.log('✅ Folder creation process complete');
    } catch (error) {
      console.error('❌ Error in folder creation process:', error);
      toast({
        title: "Error",
        description: "Failed to create folder.",
        variant: "destructive",
      });
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
          <FolderColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={creating || !newFolder.name.trim()}>
              {creating ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
