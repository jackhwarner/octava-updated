
import { useState } from 'react';
import { MoreHorizontal, Folder, Edit, Share, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectMenuProps {
  projectId: number;
}

const ProjectMenu = ({ projectId }: ProjectMenuProps) => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const folders = [
    { id: 'pop', name: 'Pop Projects' },
    { id: 'hip-hop', name: 'Hip-Hop Projects' },
    { id: 'collaborations', name: 'Collaborations' },
  ];

  const handleAddToFolder = () => {
    console.log(`Adding project ${projectId} to folder: ${selectedFolder || newFolderName}`);
    setShowFolderDialog(false);
    setSelectedFolder('');
    setNewFolderName('');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowFolderDialog(true)}>
            <Folder className="w-4 h-4 mr-2" />
            Add to Folder
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share className="w-4 h-4 mr-2" />
            Share Project
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add to Folder</DialogTitle>
            <DialogDescription>
              Choose an existing folder or create a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Existing Folders</Label>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={folder.id}
                      name="folder"
                      value={folder.id}
                      checked={selectedFolder === folder.id}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <Label htmlFor={folder.id} className="cursor-pointer">
                      {folder.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-folder">Or Create New Folder</Label>
              <Input 
                id="new-folder"
                value={newFolderName}
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                  setSelectedFolder('');
                }}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleAddToFolder}
              disabled={!selectedFolder && !newFolderName}
            >
              Add to Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectMenu;
