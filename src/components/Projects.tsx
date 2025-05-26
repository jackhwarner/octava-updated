
import { useState } from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { useProjects } from '@/hooks/useProjects';
import { useFolders } from '@/hooks/useFolders';
import { useToast } from '@/hooks/use-toast';
import { ProjectCard } from './projects/ProjectCard';
import { FolderCard } from './projects/FolderCard';
import { ProjectFilters } from './projects/ProjectFilters';
import { CreateProjectDialog } from './projects/CreateProjectDialog';
import { CreateFolderDialog } from './projects/CreateFolderDialog';
import { FolderSettings } from './projects/FolderSettings';
import { EmptyState } from './projects/EmptyState';

const Projects = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const { folders, createFolder } = useFolders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const getCurrentFolder = () => {
    return folders.find(f => f.id === currentFolderId);
  };

  const getFilteredProjects = () => {
    let projectsToShow = projects;

    // If searching, show all projects regardless of folder
    if (searchTerm) {
      projectsToShow = projects.filter(project => 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // If viewing a specific folder, show only projects in that folder
      if (currentFolderId) {
        projectsToShow = projects.filter(project => project.folder_id === currentFolderId);
      } else {
        // If on main page, show only projects without a folder
        projectsToShow = projects.filter(project => !project.folder_id);
      }
    }

    return projectsToShow;
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      await addProject(projectData);
      toast({
        title: "Success",
        description: "Project created successfully"
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateFolder = async (name: string, description?: string) => {
    try {
      await createFolder(name, description);
      toast({
        title: "Success",
        description: "Folder created successfully"
      });
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleProjectUpdate = async (project: any) => {
    try {
      await updateProject(project.id, { folder_id: project.folder_id || null });
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

  const handleProjectDelete = async (project: any) => {
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

  const handleShareProject = (project: any) => {
    const url = `${window.location.origin}/projects/${project.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Project sharing link copied to clipboard"
    });
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBackToMain = () => {
    setCurrentFolderId(null);
  };

  const filteredProjects = getFilteredProjects();
  const currentFolder = getCurrentFolder();

  if (loading) {
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
          <CreateFolderDialog onCreateFolder={handleCreateFolder} />
          <CreateProjectDialog folders={folders} onCreateProject={handleCreateProject} />
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={handleBackToMain} className="cursor-pointer">
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentFolderId && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentFolder?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Folder Settings - Only show when inside a folder */}
        {currentFolder && (
          <FolderSettings folder={currentFolder} />
        )}
      </div>

      {/* Filters */}
      <ProjectFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Folders Section - Only show when not in a folder and not searching */}
      {!currentFolderId && !searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {folders.map(folder => (
              <FolderCard 
                key={folder.id} 
                folder={folder} 
                projects={projects} 
                onClick={handleFolderClick} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {searchTerm 
            ? `Search Results (${filteredProjects.length})` 
            : currentFolderId 
              ? currentFolder?.name 
              : 'Projects'
          }
        </h2>
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
            currentFolderId={currentFolderId}
            currentFolderName={currentFolder?.name}
            onCreateProject={() => {}} // This will be handled by the CreateProjectDialog trigger
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
