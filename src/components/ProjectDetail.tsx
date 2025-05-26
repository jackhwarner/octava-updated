import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Globe, Lock, Eye, FileText, MessageSquare, Settings, Info, Download, Trash2, Play, Image as ImageIcon, File, ListTodo } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import Sidebar from './Sidebar';
import ProjectFiles from './project/ProjectFiles';
import ProjectChat from './project/ProjectChat';
import ProjectCollaborators from './project/ProjectCollaborators';
import ProjectInfo from './project/ProjectInfo';
import ProjectSettings from './project/ProjectSettings';
import ProjectTodos from './project/ProjectTodos';
const ProjectDetail = () => {
  const {
    projectId
  } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    loading
  } = useProjects();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mainActiveTab, setMainActiveTab] = useState('projects');

  // Sample recent files for demonstration
  const recentFiles = [{
    id: '1',
    name: 'demo-track.mp3',
    type: 'audio/mp3',
    uploadedAt: '2024-01-20T10:30:00Z',
    uploadedBy: 'Sarah Johnson'
  }, {
    id: '2',
    name: 'album-cover.jpg',
    type: 'image/jpeg',
    uploadedAt: '2024-01-19T14:15:00Z',
    uploadedBy: 'Marcus Williams'
  }, {
    id: '3',
    name: 'lyrics.txt',
    type: 'text/plain',
    uploadedAt: '2024-01-18T09:45:00Z',
    uploadedBy: 'Sarah Johnson'
  }];
  useEffect(() => {
    const foundProject = projects.find(p => p.id === projectId);
    setProject(foundProject);
  }, [projectId, projects]);
  const handleMainNavigation = (tab: string) => {
    navigate(`/${tab}`);
  };
  if (loading) {
    return <div className="min-h-screen bg-white flex">
        <div className="fixed top-0 left-0 h-screen z-10">
          <Sidebar activeTab={mainActiveTab} setActiveTab={handleMainNavigation} />
        </div>
        <div className="flex-1 ml-[90px] p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>;
  }
  if (!project) {
    return <div className="min-h-screen bg-white flex">
        <div className="fixed top-0 left-0 h-screen z-10">
          <Sidebar activeTab={mainActiveTab} setActiveTab={handleMainNavigation} />
        </div>
        <div className="flex-1 ml-[90px] p-8">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => navigate('/projects')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Project not found</p>
          </div>
        </div>
      </div>;
  }
  const getStatusColor = status => {
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
  const getStatusLabel = status => {
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
  const getVisibilityIcon = visibility => {
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
  const getFileIcon = (type: string) => {
    if (type.startsWith('audio/')) {
      return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-purple-700" />
        </div>;
    }
    if (type.startsWith('image/')) {
      return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-purple-700" />
        </div>;
    }
    return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
        <File className="w-4 h-4 text-purple-700" />
      </div>;
  };
  const sidebarItems = [{
    id: 'overview',
    label: 'Overview',
    icon: Info
  }, {
    id: 'files',
    label: 'Files',
    icon: FileText
  }, {
    id: 'todos',
    label: 'To-Do',
    icon: ListTodo
  }, {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare
  }, {
    id: 'collaborators',
    label: 'Team',
    icon: Users
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }];
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectInfo project={project} />;
      case 'files':
        return <ProjectFiles projectId={project.id} />;
      case 'todos':
        return <ProjectTodos projectId={project.id} />;
      case 'chat':
        return <ProjectChat projectId={project.id} />;
      case 'collaborators':
        return <ProjectCollaborators project={project} />;
      case 'settings':
        return <ProjectSettings project={project} />;
      default:
        return <ProjectInfo project={project} />;
    }
  };
  return <div className="min-h-screen bg-gray-50 flex">
      {/* Main Navigation Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-20">
        <Sidebar activeTab={mainActiveTab} setActiveTab={handleMainNavigation} />
      </div>

      {/* Project Sidebar */}
      <div className="w-[320px] ml-[90px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <button onClick={() => navigate('/projects')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          
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
        <nav className="p-4 border-b">
          <ul className="space-y-2">
            {sidebarItems.map(item => {
            const Icon = item.icon;
            return <li key={item.id}>
                  <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>;
          })}
          </ul>
        </nav>

        {/* Recent Activity */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Files</h3>
          <div className="space-y-3">
            {recentFiles.map(file => <div key={file.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">by {file.uploadedBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Download className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>

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
              <span className="text-gray-500">Files</span>
              <span className="text-gray-900">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Team Size</span>
              <span className="text-gray-900">{(project.collaborators?.length || 0) + 1}</span>
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
              {project.collaborators && project.collaborators.length > 0 && <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Team:</span>
                  <div className="flex -space-x-2">
                    {/* Project Owner */}
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs text-purple-700">AR</span>
                    </div>
                    
                    {/* Collaborators */}
                    {project.collaborators.slice(0, 4).map((collaborator, index) => <div key={index} className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-purple-700">
                          {getInitials(collaborator.profiles?.name || 'U')}
                        </span>
                      </div>)}
                    
                    {project.collaborators.length > 4 && <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-gray-600">+{project.collaborators.length - 4}</span>
                      </div>}
                  </div>
                </div>}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>;
};
export default ProjectDetail;