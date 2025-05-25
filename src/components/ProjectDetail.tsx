
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Calendar, DollarSign, Globe, Lock, Eye } from 'lucide-react';
import { useFakeProjects } from '@/hooks/useFakeProjects';
import ProjectFiles from './project/ProjectFiles';
import ProjectChat from './project/ProjectChat';
import ProjectCollaborators from './project/ProjectCollaborators';
import ProjectInfo from './project/ProjectInfo';
import GroupAvatar from './GroupAvatar';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useFakeProjects();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const foundProject = projects.find(p => p.id === projectId);
    setProject(foundProject);
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Project not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
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

  const getStatusLabel = (status) => {
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

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'connections_only':
        return <Eye className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Button variant="ghost" onClick={() => navigate('/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          <div className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title || project.name}
                </h1>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <Badge variant="outline">{project.genre || 'No Genre'}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    {getVisibilityIcon(project.visibility)}
                    <span className="ml-1 capitalize">{project.visibility}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {project.collaborators?.length || 0} collaborators
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {project.collaborators && project.collaborators.length > 0 && (
                  <GroupAvatar 
                    participants={project.collaborators.map(c => ({
                      name: c.name,
                      username: c.username
                    }))}
                    size="lg"
                  />
                )}
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Invite Collaborators
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="collaborators">Team</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectInfo project={project} />
          </TabsContent>

          <TabsContent value="files">
            <ProjectFiles projectId={project.id} />
          </TabsContent>

          <TabsContent value="chat">
            <ProjectChat projectId={project.id} />
          </TabsContent>

          <TabsContent value="collaborators">
            <ProjectCollaborators project={project} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Project settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
