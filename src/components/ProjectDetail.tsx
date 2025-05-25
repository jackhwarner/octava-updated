
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Calendar, Globe, Lock, Eye, FileText, MessageSquare, Settings, Info } from 'lucide-react';
import { useFakeProjects } from '@/hooks/useFakeProjects';
import ProjectFiles from './project/ProjectFiles';
import ProjectChat from './project/ProjectChat';
import ProjectCollaborators from './project/ProjectCollaborators';
import ProjectInfo from './project/ProjectInfo';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useFakeProjects();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'collaborators', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectInfo project={project} />;
      case 'files':
        return <ProjectFiles projectId={project.id} />;
      case 'chat':
        return <ProjectChat projectId={project.id} />;
      case 'collaborators':
        return <ProjectCollaborators project={project} />;
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Project settings will be implemented here.</p>
            </CardContent>
          </Card>
        );
      default:
        return <ProjectInfo project={project} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {project.title || project.name}
          </h1>
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge className={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
            <Badge variant="outline">{project.genre || 'No Genre'}</Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            {getVisibilityIcon(project.visibility)}
            <span className="ml-1 capitalize">{project.visibility}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Project Stats */}
        <div className="p-4 border-t">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-900">{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Updated</span>
              <span className="text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Collaborators</span>
              <span className="text-gray-900">{project.collaborators?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Last updated {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Collaborator Avatars */}
              {project.collaborators && project.collaborators.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 mr-2">Team:</span>
                  <div className="flex -space-x-2">
                    {/* Project Owner */}
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs text-purple-700">AR</span>
                    </div>
                    
                    {/* Collaborators */}
                    {project.collaborators.slice(0, 4).map((collaborator, index) => (
                      <div key={index} className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-purple-700">
                          {getInitials(collaborator.name)}
                        </span>
                      </div>
                    ))}
                    
                    {project.collaborators.length > 4 && (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-gray-600">+{project.collaborators.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button className="bg-purple-600 hover:bg-purple-700">
                Invite Collaborators
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
