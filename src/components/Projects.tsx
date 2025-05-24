
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Folder, Music, Users, MoreHorizontal, ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Projects = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showAddToFolderDialog, setShowAddToFolderDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [searchCollaborator, setSearchCollaborator] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const folders = [
    { id: 'pop', name: 'Pop Projects', count: 5, type: 'folder' },
    { id: 'hip-hop', name: 'Hip-Hop Projects', count: 3, type: 'folder' },
    { id: 'collaborations', name: 'Collaborations', count: 4, type: 'folder' },
  ];

  const projects = [
    {
      id: 1,
      title: 'Summer Vibes',
      description: 'Upbeat pop track perfect for summer playlists',
      genre: 'Pop',
      collaborators: 3,
      status: 'In Progress',
      lastUpdated: '2 days ago',
      folder: 'pop',
      type: 'project'
    },
    {
      id: 2,
      title: 'Midnight Drive',
      description: 'Chill synthwave instrumental',
      genre: 'Electronic',
      collaborators: 2,
      status: 'Review',
      lastUpdated: '1 week ago',
      folder: 'collaborations',
      type: 'project'
    },
    {
      id: 3,
      title: 'City Lights',
      description: 'Urban hip-hop track with jazz influences',
      genre: 'Hip-Hop',
      collaborators: 4,
      status: 'Complete',
      lastUpdated: '3 days ago',
      folder: 'hip-hop',
      type: 'project'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Review':
        return 'bg-blue-100 text-blue-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayItems = currentFolderId === null 
    ? [...folders, ...projects] 
    : projects.filter(project => project.folder === currentFolderId);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  const handleBackToRoot = () => {
    setCurrentFolderId(null);
    setCurrentFolderName(null);
  };

  const handleCreateProject = () => {
    setShowNewProjectDialog(false);
    setProjectName('');
    setProjectGenre('');
    setProjectDescription('');
    setSearchCollaborator('');
  };

  const handleAddToFolder = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowAddToFolderDialog(true);
  };

  const handleSaveToFolder = () => {
    setShowAddToFolderDialog(false);
    setSelectedProjectId(null);
    setNewFolderName('');
  };

  const renderBreadcrumb = () => {
    if (currentFolderId === null) return null;
    
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handleBackToRoot} className="cursor-pointer">
              <Home className="w-4 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentFolderName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewProjectDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <Input placeholder="Search projects..." className="max-w-sm" />
        <Button variant="outline">Filter</Button>
      </div>

      {renderBreadcrumb()}

      {/* Projects and Folders Grid - 4 columns on xl screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentFolderId === null && folders.map((folder) => (
          <Card 
            key={folder.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleFolderClick(folder.id, folder.name)}
          >
            <CardContent className="p-6 flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{folder.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Music className="w-4 h-4 mr-1" />
                  {folder.count} projects
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>
        ))}

        {displayItems.filter(item => item.type === 'project').map((project: any) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddToFolder(project.id)}>
                      Add to Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{project.genre}</Badge>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {project.collaborators} collaborators
                </div>
                <div>Updated {project.lastUpdated}</div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Music className="w-4 h-4 mr-2" />
                  Open
                </Button>
                <Button variant="outline" className="flex-1">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill out the details below to start a new music project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input 
                id="project-name" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                className="w-full" 
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-genre">Genre</Label>
              <Select value={projectGenre} onValueChange={setProjectGenre}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea 
                id="project-description" 
                value={projectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)} 
                className="w-full" 
                placeholder="Describe your project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-privacy">Privacy</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="connections-only">Connections Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-collaborators">Collaborators</Label>
              <Input 
                id="project-collaborators"
                value={searchCollaborator}
                onChange={(e) => setSearchCollaborator(e.target.value)}
                className="w-full"
                placeholder="Search for collaborators by name"
              />
              {searchCollaborator && (
                <div className="mt-1 p-2 border rounded-md">
                  <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                    David Kim - Pianist
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                    Sophia Martinez - Vocalist
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-deadline">Deadline</Label>
              <Input 
                id="project-deadline"
                type="date"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Folder Dialog */}
      <Dialog open={showAddToFolderDialog} onOpenChange={setShowAddToFolderDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add to Folder</DialogTitle>
            <DialogDescription>
              Choose a folder for this project or create a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Existing Folders</Label>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <Button 
                    key={folder.id}
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleSaveToFolder}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-folder">Create New Folder</Label>
              <Input 
                id="new-folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddToFolderDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSaveToFolder}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
