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
import { useNavigate } from 'react-router-dom';
import { useFakeProjects } from '@/hooks/useFakeProjects';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loading, addProject, deleteProject } = useFakeProjects();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showAddToFolderDialog, setShowAddToFolderDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectVisibility, setProjectVisibility] = useState('private');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const folders = [
    { id: 'pop', name: 'Pop Projects', count: projects.filter(p => p.genre === 'Pop').length, type: 'folder' },
    { id: 'hip-hop', name: 'Hip-Hop Projects', count: projects.filter(p => p.genre === 'Hip-Hop').length, type: 'folder' },
    { id: 'collaborations', name: 'Collaborations', count: projects.filter(p => p.collaborators && p.collaborators.length > 0).length, type: 'folder' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'on_hold':
        return 'On Hold';
      case 'completed':
        return 'Complete';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const displayProjects = currentFolderId === null 
    ? projects 
    : projects.filter(project => {
        switch (currentFolderId) {
          case 'pop':
            return project.genre === 'Pop';
          case 'hip-hop':
            return project.genre === 'Hip-Hop';
          case 'collaborations':
            return project.collaborators && project.collaborators.length > 0;
          default:
            return true;
        }
      });

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  const handleBackToRoot = () => {
    setCurrentFolderId(null);
    setCurrentFolderName(null);
  };

  const handleCreateProject = async () => {
    try {
      await addProject({
        title: projectName,
        name: projectName,
        description: projectDescription,
        genre: projectGenre,
        visibility: projectVisibility as 'public' | 'private' | 'connections_only',
      });
      
      setShowNewProjectDialog(false);
      setProjectName('');
      setProjectGenre('');
      setProjectDescription('');
      setProjectVisibility('private');
      setProjectDeadline('');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAddToFolder = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowAddToFolderDialog(true);
  };

  const handleSaveToFolder = () => {
    setShowAddToFolderDialog(false);
    setSelectedProjectId(null);
    setNewFolderName('');
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      {/* Folders Section */}
      {currentFolderId === null && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folders.map((folder) => (
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
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {displayProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No projects found</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowNewProjectDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title || project.name}</CardTitle>
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
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{project.genre || 'No Genre'}</Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {project.collaborators?.length || 0} collaborators
                    </div>
                    <div>
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleOpenProject(project.id)}
                    >
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
        )}
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
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="R&B">R&B</SelectItem>
                  <SelectItem value="Jazz">Jazz</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
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
              <Select value={projectVisibility} onValueChange={setProjectVisibility}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="connections_only">Connections Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-deadline">Deadline</Label>
              <Input 
                id="project-deadline"
                type="date"
                value={projectDeadline}
                onChange={(e) => setProjectDeadline(e.target.value)}
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
              disabled={!projectName.trim()}
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
