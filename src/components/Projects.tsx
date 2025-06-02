import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';
import { Button } from './ui/button';
import { useProjects } from '../hooks/useProjects';
import { useFolders } from '../hooks/useFolders';
import { useToast } from './ui/use-toast';
import { ProjectCard } from './projects/ProjectCard';
import FolderCard from './projects/FolderCard';
import { ProjectFilters } from './projects/ProjectFilters';
import { CreateProjectDialog } from './projects/CreateProjectDialog';
import { CreateFolderDialog } from './projects/CreateFolderDialog';
import { FolderSettings } from './projects/FolderSettings';
import { EmptyState } from './projects/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Project } from '../types/project';
import type { FolderWithProjectCount } from '../hooks/useFolders';

type SortOption = 'updated' | 'created' | 'name' | 'status' | 'collaborators';

const Projects = () => {
  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject, refetch } = useProjects();
  const { folders, loading: foldersLoading, createFolder, refetch: refetchFolders } = useFolders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [dummyState, setDummyState] = useState(0);

  // Add effect to log folder changes
  useEffect(() => {
    console.log('📁 Projects component - folders updated:', folders.length);
    console.log('Projects.tsx useEffect - folders changed:', folders.map(f => ({ id: f.id, name: f.name, color: f.color })));
  }, [folders]);

  const currentFolder = useMemo(() => {
    console.log('Calculating current folder...');
    const found = folders.find(f => f.id === folderId);
    console.log('Found folder:', found);
    return found;
  }, [folders, folderId]);

  const getFilteredAndSortedProjects = (): Project[] => {
    let projectsToShow: Project[] = projects;

    // Apply search filter
    if (searchTerm) {
      projectsToShow = projects.filter((project: Project) => 
        (project.title || project.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      if (folderId) {
        projectsToShow = projects.filter((project: Project) => project.folder_id === folderId);
      } else {
        projectsToShow = projects.filter((project: Project) => !project.folder_id);
      }
    }

    // Apply sorting
    return projectsToShow.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        case 'status':
          const statusOrder = { 'Not Started': 0, 'In Progress': 1, 'Completed': 2 };
          const aStatus = !a.current_phase_index ? 'Not Started' : 
                         a.current_phase_index >= (a.phases?.length || 0) - 1 ? 'Completed' : 'In Progress';
          const bStatus = !b.current_phase_index ? 'Not Started' : 
                         b.current_phase_index >= (b.phases?.length || 0) - 1 ? 'Completed' : 'In Progress';
          return statusOrder[aStatus] - statusOrder[bStatus];
        case 'collaborators':
          return (b.collaborators?.length || 0) - (a.collaborators?.length || 0);
        default:
          return 0;
      }
    });
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      await addProject(projectData);
      await refetch(); // Ensure project list is refreshed
      setDummyState(prev => prev + 1);
      toast({
        title: "Success",
        description: "Project created successfully"
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const handleProjectUpdate = async (project: Project) => {
    try {
      await updateProject(project.id, { folder_id: project.folder_id || undefined }); // Pass undefined for null folder_id
      
      await refetch(); // Refetch both projects and folders to ensure all relevant lists are updated
      await refetchFolders();
      setDummyState(prev => prev + 1);
      
      toast({
        title: "Success",
        description: project.folder_id ? "Project added to folder" : "Project removed from folder"
      });
    } catch (error) {
      console.error('Error updating project folder:', error);
      toast({
        title: "Error",
        description: "Failed to update project folder",
        variant: "destructive"
      });
    }
  };

  const handleProjectDelete = async (project: Project) => {
    try {
      await deleteProject(project.id);
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const handleShareProject = (project: Project) => {
    const url = `${window.location.origin}/projects/${project.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Project sharing link copied to clipboard"
    });
  };

  const handleBackToMain = () => {
    navigate('/projects');
  };

  const handleFolderCreated = async () => {
    console.log('📁 Folder created, refreshing folders');
    await refetchFolders(); // Ensure folder list is refreshed
    setDummyState(prev => prev + 1); // This may be unnecessary if refetch works
  };

  const handleFolderDeleted = async () => {
    console.log('🗑️ Folder deleted, refreshing folders');
    try {
      // If we're in a folder view and that folder was deleted, navigate back to main
      if (folderId) {
        navigate('/projects');
      }
      
      // Force a re-render by updating a state
      setDummyState(prev => prev + 1);
      
      // Refetch folders
      await refetchFolders();
      
      // Force another re-render to ensure UI updates
      setDummyState(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing folders:', error);
    }
  };

  const filteredProjects = useMemo(() => {
    const filteredProjects = getFilteredAndSortedProjects();
    console.log('Projects.tsx filteredProjects:', filteredProjects);
    return filteredProjects;
  }, [projects, currentFolder, searchTerm, sortBy]);

  // Add debug logging for folder count and force re-render when folders change
  useEffect(() => {
    console.log('📊 Current folder count:', folders.length);
    // Force a re-render when folders change
    setDummyState(prev => prev + 1);
  }, [folders]);

  console.log('Projects.tsx render - folders:', folders.map(f => ({ id: f.id, name: f.name, color: f.color })));
  console.log('Projects.tsx render - projects:', projects);

  if (projectsLoading || foldersLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" data-testid="loading-skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" data-testid="loading-skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if we are in a folder view and the folder doesn't exist
  const isInvalidFolder = folderId && !currentFolder && !foldersLoading;

  if (isInvalidFolder) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Folder Not Found</h1>
        <p className="text-gray-700">The requested folder could not be found.</p>
        <Button onClick={handleBackToMain} className="mt-6">Back to all projects</Button>
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
          <CreateFolderDialog 
            isOpen={isCreateFolderDialogOpen}
            setIsOpen={setIsCreateFolderDialogOpen}
            onCreateFolder={handleFolderCreated}
          />
          <CreateProjectDialog folders={folders} onCreateProject={handleCreateProject} />
        </div>
      </div>

      <div className={`flex items-center justify-between ${folderId && currentFolder ? 'mb-6' : ''}`}>
        {folderId && currentFolder && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToMain} className="cursor-pointer">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <FolderSettings 
              folder={currentFolder} 
              setCurrentFolderId={(id: string | null) => {
                if (id === null) {
                  navigate('/projects');
                } else {
                  navigate(`/projects/folder/${id}`);
                }
              }}
              onFolderUpdated={async () => {
                console.log('🔄 Folder updated, refreshing state...');
                await refetchFolders();
                setDummyState(prev => prev + 1);
              }}
            />
          </>
        )}
      </div>

      <ProjectFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {!folderId && !searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {folders.map(folder => (
              <FolderCard 
                key={folder.id} 
                folder={folder}
                onDelete={handleFolderDeleted}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {searchTerm 
              ? `Search Results (${filteredProjects.length})` 
              : folderId 
                ? currentFolder?.name || 'Folder Projects'
                : 'Projects'
            }
          </h2>
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Last Created</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="collaborators">Collaborators</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              folders={folders}
              searchTerm={searchTerm}
              onProjectUpdate={handleProjectUpdate}
              onProjectDelete={handleProjectDelete}
              onShare={handleShareProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            currentFolderId={folderId || null}
            currentFolderName={currentFolder?.name}
            onCreateProject={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
