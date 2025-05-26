
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, Calendar, Users, Music, FolderPlus, Folder, MoreVertical, Edit, Trash2, Share2, Eye, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useFolders } from '@/hooks/useFolders';
import { useToast } from '@/hooks/use-toast';

const Projects = () => {
  const navigate = useNavigate();
  const {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject
  } = useProjects();
  const {
    folders,
    createFolder,
    loading: foldersLoading
  } = useFolders();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    genre: '',
    visibility: 'private' as 'private' | 'public' | 'connections_only',
    deadline: '',
    folder_id: '',
    bpm: '',
    key: '',
    daw: ''
  });
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    color: '#6366f1'
  });

  const getProjectStatus = (project: any) => {
    if (!project.phases || project.phases.length === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-800' };
    }
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    if (currentPhase === 0) {
      return { label: 'Not Started', color: 'bg-red-100 text-red-800' };
    } else if (currentPhase >= totalPhases - 1) {
      return { label: 'Completed', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return null;
    const daysUntil = getDaysUntilDeadline(deadline);
    if (daysUntil === null) return null;
    
    if (daysUntil < 0) {
      return { text: `${Math.abs(daysUntil)} days overdue`, color: 'text-red-600' };
    } else if (daysUntil === 0) {
      return { text: 'Due today', color: 'text-red-600' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil} days left`, color: 'text-orange-600' };
    } else {
      return { text: `${daysUntil} days left`, color: 'text-gray-600' };
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || 
                         (selectedFolder === 'none' && !project.folder_id) || 
                         project.folder_id === selectedFolder;
    const projectStatus = getProjectStatus(project);
    const matchesStatus = statusFilter === 'all' || 
                         projectStatus.label.toLowerCase().replace(' ', '_') === statusFilter;
    return matchesSearch && matchesFolder && matchesStatus;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        bpm: newProject.bpm ? parseInt(newProject.bpm) : undefined,
        deadline: newProject.deadline || undefined,
        folder_id: newProject.folder_id || undefined
      };
      await addProject(projectData);
      setIsCreateDialogOpen(false);
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
      toast({
        title: "Success",
        description: "Project created successfully"
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFolder(newFolder.name, newFolder.description);
      setIsFolderDialogOpen(false);
      setNewFolder({
        name: '',
        description: '',
        color: '#6366f1'
      });
      toast({
        title: "Success",
        description: "Folder created successfully"
      });
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        toast({
          title: "Success",
          description: "Project deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleAddToFolder = async (projectId: string, folderId: string) => {
    try {
      await updateProject(projectId, { folder_id: folderId || null });
      toast({
        title: "Success",
        description: folderId ? "Project added to folder" : "Project removed from folder"
      });
    } catch (error) {
      console.error('Error updating project folder:', error);
    }
  };

  const handleShareProject = (project: any) => {
    const url = `${window.location.origin}/projects/${project.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Project sharing link copied to clipboard"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading || foldersLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your music projects and collaborate with others</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFolder} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Create Folder
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              <form onSubmit={handleCreateProject} className="space-y-4">
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

                <div className="grid grid-cols-3 gap-4">
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
                        <SelectItem value="">No folder</SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={newProject.visibility} onValueChange={(value: 'private' | 'public' | 'connections_only') => setNewProject({ ...newProject, visibility: value })}>
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
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Create Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All folders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All folders</SelectItem>
            <SelectItem value="none">No folder</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: folder.color }}
                  />
                  {folder.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display folders */}
      {selectedFolder === 'all' && folders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => {
              const folderProjects = projects.filter(p => p.folder_id === folder.id);
              return (
                <Card
                  key={folder.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: folder.color }}
                      >
                        <Folder className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{folder.name}</h3>
                        <p className="text-sm text-gray-500">{folderProjects.length} projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const projectStatus = getProjectStatus(project);
          const folder = folders.find(f => f.id === project.folder_id);
          const deadlineInfo = formatDeadline(project.deadline);
          
          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title || project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={projectStatus.color}>
                        {projectStatus.label}
                      </Badge>
                      {project.genre && (
                        <Badge variant="outline">{project.genre}</Badge>
                      )}
                    </div>
                    {folder && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Folder className="w-4 h-4 mr-1" style={{ color: folder.color }} />
                        {folder.name}
                      </div>
                    )}
                    {deadlineInfo && (
                      <div className={`flex items-center text-sm ${deadlineInfo.color} mb-2`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {deadlineInfo.text}
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShareProject(project)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                          <div className="flex items-center px-2 py-1.5 text-sm">
                            <Folder className="w-4 h-4 mr-2" />
                            Add to folder
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuItem onClick={() => handleAddToFolder(project.id, '')}>
                            Remove from folder
                          </DropdownMenuItem>
                          {folders.map((folder) => (
                            <DropdownMenuItem
                              key={folder.id}
                              onClick={() => handleAddToFolder(project.id, folder.id)}
                            >
                              <div
                                className="w-3 h-3 rounded mr-2"
                                style={{ backgroundColor: folder.color }}
                              />
                              {folder.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {formatDate(project.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {project.collaborators?.length || 0} collaborators
                    </div>
                  </div>
                  
                  {(project.bpm || project.key) && (
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {project.bpm && (
                        <div className="flex items-center">
                          <Music className="w-4 h-4 mr-1" />
                          {project.bpm} BPM
                        </div>
                      )}
                      {project.key && <span>Key: {project.key}</span>}
                    </div>
                  )}
                  
                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Team:</span>
                      <div className="flex -space-x-2">
                        {project.collaborators.slice(0, 3).map((collaborator, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white"
                          >
                            <span className="text-xs text-purple-700">
                              {getInitials(collaborator.profiles?.name || 'U')}
                            </span>
                          </div>
                        ))}
                        {project.collaborators.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs text-gray-600">
                              +{project.collaborators.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white hover:text-white"
                  >
                    Open Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedFolder !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Create your first project to get started'}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
