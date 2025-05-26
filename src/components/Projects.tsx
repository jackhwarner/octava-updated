import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Music, Users, MoreHorizontal, Folder, FolderPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useFolders } from '@/hooks/useFolders';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loading, addProject, deleteProject } = useProjects();
  const { folders, addFolder } = useFolders();
  
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  
  // Project form state
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectVisibility, setProjectVisibility] = useState('private');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  // Folder form state
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [folderColor, setFolderColor] = useState('#6366f1');

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

  const handleCreateProject = async () => {
    try {
      await addProject({
        title: projectName,
        name: projectName,
        description: projectDescription,
        genre: projectGenre,
        visibility: projectVisibility as 'public' | 'private' | 'connections_only',
        folder_id: selectedFolder || undefined,
      });
      
      setShowNewProjectDialog(false);
      setProjectName('');
      setProjectGenre('');
      setProjectDescription('');
      setProjectVisibility('private');
      setProjectDeadline('');
      setSelectedFolder('');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await addFolder({
        name: folderName,
        description: folderDescription,
        color: folderColor,
      });
      
      setShowNewFolderDialog(false);
      setFolderName('');
      setFolderDescription('');
      setFolderColor('#6366f1');
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
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

  // Group projects by folder
  const projectsByFolder = projects.reduce((acc, project) => {
    const folderId = project.folder_id || 'uncategorized';
    if (!acc[folderId]) acc[folderId] = [];
    acc[folderId].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowNewFolderDialog(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewProjectDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <Input placeholder="Search projects..." className="max-w-sm" />
        <Button variant="outline">Filter</Button>
      </div>

      {/* Projects Section */}
      <div className="space-y-8">
        {/* Folders */}
        {folders.map(folder => (
          <div key={folder.id} className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Folder className="w-5 h-5" style={{ color: folder.color }} />
              <h2 className="text-xl font-semibold">{folder.name}</h2>
              {folder.description && (
                <span className="text-sm text-gray-500">- {folder.description}</span>
              )}
            </div>
            {projectsByFolder[folder.id] && projectsByFolder[folder.id].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projectsByFolder[folder.id].map((project) => (
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
            ) : (
              <div className="text-gray-500 text-sm">No projects in this folder</div>
            )}
          </div>
        ))}

        {/* Uncategorized Projects */}
        {projectsByFolder['uncategorized'] && projectsByFolder['uncategorized'].length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Uncategorized Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projectsByFolder['uncategorized'].map((project) => (
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
          </div>
        )}

        {/* No projects message */}
        {projects.length === 0 && (
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
            
            <div className="space-y-2">
              <Label htmlFor="project-folder">Folder (Optional)</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4" style={{ color: folder.color }} />
                        <span>{folder.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a folder to organize your projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Name</Label>
              <Input 
                id="folder-name" 
                value={folderName} 
                onChange={(e) => setFolderName(e.target.value)} 
                placeholder="Enter folder name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folder-description">Description</Label>
              <Textarea 
                id="folder-description" 
                value={folderDescription} 
                onChange={(e) => setFolderDescription(e.target.value)} 
                placeholder="Describe this folder"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folder-color">Color</Label>
              <Input 
                id="folder-color"
                type="color"
                value={folderColor}
                onChange={(e) => setFolderColor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateFolder}
              disabled={!folderName.trim()}
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
