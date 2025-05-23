
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

const Projects = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);

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

  // Combine folders and projects when showing the root folder
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

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handleBackToRoot} className="cursor-pointer">
              <Home className="w-4 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentFolderId && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentFolderName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your music collaborations</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center space-x-4">
        <Input placeholder="Search projects..." className="max-w-sm" />
        <Button variant="outline">Filter</Button>
      </div>

      {/* Breadcrumb Navigation */}
      {renderBreadcrumb()}

      {/* Projects and Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
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
    </div>
  );
};

export default Projects;
