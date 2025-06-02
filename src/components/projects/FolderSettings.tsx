import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreVertical, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFolders } from '@/hooks/useFolders';
import type { Folder } from '@/hooks/useFolders';
import FolderColorPicker from '@/components/folder/FolderColorPicker';

interface FolderSettingsProps {
  folder: Folder;
  setCurrentFolderId: (folderId: string | null) => void;
  onFolderUpdated?: () => void;
}

const colorOptions = [
  { name: 'Purple', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#8b5cf6' },
  { name: 'Teal', value: '#14b8a6' }
];

export const FolderSettings = ({ folder, setCurrentFolderId, onFolderUpdated }: FolderSettingsProps) => {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: folder.name,
    description: folder.description || '',
    color: folder.color
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { updateFolder, deleteFolder, refetch: refetchFolders } = useFolders();

  useEffect(() => {
    setEditForm({
      name: folder.name,
      description: folder.description || '',
      color: folder.color
    });
  }, [folder]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      console.log('Saving folder with:', editForm);
      console.log('Folder object:', folder);
      await updateFolder(folder.id, {
        name: editForm.name,
        description: editForm.description || null,
        color: editForm.color
      });
      toast({
        title: "Success",
        description: "Folder updated successfully"
      });
      onFolderUpdated?.();
      setTimeout(() => {
        refetchFolders();
      }, 250);
      setIsSettingsDialogOpen(false);
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: "Error",
        description: "Failed to update folder",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(folder.id);
      toast({
        title: "Success",
        description: "Folder deleted successfully"
      });
      setIsDeleteDialogOpen(false);
      refetchFolders();
      setCurrentFolderId(null);
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-md">
          <DropdownMenuItem onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Folder Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter folder name"
              />
            </div>
            
            <div>
              <Label htmlFor="folder-description">Description (optional)</Label>
              <Input
                id="folder-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter folder description"
              />
            </div>

            <FolderColorPicker
              selectedColor={editForm.color}
              onColorSelect={(color) => setEditForm(prev => ({ ...prev, color }))}
                  />
              </div>
          <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                Cancel
              </Button>
            <Button onClick={handleSaveSettings} disabled={saving || !editForm.name.trim()}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{folder.name}"? This action cannot be undone. 
              Projects in this folder will be moved back to the main projects area.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFolder} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
