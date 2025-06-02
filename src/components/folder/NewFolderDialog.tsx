import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useFolders } from '@/hooks/useFolders';
import FolderColorPicker from './FolderColorPicker';
import { FolderPlus } from 'lucide-react';

interface NewFolderDialogProps {
  // Remove props: isOpen, onClose, projectId, onCreateFolder
}

const NewFolderDialog: React.FC<NewFolderDialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false); // Manage state internally
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState(''); // Add state for description
  const [selectedColor, setSelectedColor] = useState('#3b82f6'); // Default to blue
  const { createFolder, loading: creating, refetch } = useFolders();
  const { toast } = useToast();

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      // No need to get user here, useFolders hook handles it

      await createFolder(folderName.trim(), folderDescription || undefined, selectedColor);

      toast({
        title: "Folder Created",
        description: "Your new folder has been created successfully",
      });

      // Reset form and close dialog
      setFolderName('');
      setFolderDescription('');
      setSelectedColor('#3b82f6');
      setIsOpen(false);
      refetch(); // Refetch folders after creation
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-3"> {/* Button to trigger dialog */}
          <FolderPlus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-description">Description (optional)</Label>
            <Textarea
              id="folder-description"
              value={folderDescription}
              onChange={(e) => setFolderDescription(e.target.value)}
              placeholder="Enter folder description"
            />
          </div>
          <FolderColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            disabled={creating || !folderName.trim()}
          >
            {creating ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderDialog; 