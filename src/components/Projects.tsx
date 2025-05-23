
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Folder, Music, Users, MoreHorizontal } from 'lucide-react';

const Projects = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');

  const folders = [
    { id: 'all', name: 'All Projects', count: 12 },
    { id: 'pop', name: 'Pop Projects', count: 5 },
    { id: 'hip-hop', name: 'Hip-Hop Projects', count: 3 },
    { id: 'collaborations', name: 'Collaborations', count: 4 },
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

  const filteredProjects = selectedFolder === 'all' 
    ? projects 
    : projects.filter(project => project.folder === selectedFolder);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="w-5 h-5 mr-2" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{folder.name}</span>
                <Badge variant="secondary" className="bg-gray-100">
                  {folder.count}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center space-x-4">
            <Input placeholder="Search projects..." className="max-w-sm" />
            <Button variant="outline">Filter</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
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
      </div>
    </div>
  );
};

export default Projects;
