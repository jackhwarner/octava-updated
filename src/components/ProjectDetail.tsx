import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Globe, Lock, Eye, FileText, MessageSquare, Settings, Info, Download, Trash2, Play, Image as ImageIcon, File, ListTodo } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useProjectStats } from '@/hooks/useProjectStats';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from './Sidebar';
import ProjectFiles from './project/ProjectFiles';
import ProjectChat from './project/ProjectChat';
import ProjectCollaborators from './project/ProjectCollaborators';
import ProjectInfo from './project/ProjectInfo';
import ProjectSettings from './project/ProjectSettings';
import ProjectTodos from './project/ProjectTodos';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ProjectDetail = () => {
  const {
    projectId
  } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    loading
  } = useProjects();
  const {
    stats,
    loading: statsLoading,
    refetch: refetchStats
  } = useProjectStats(projectId || '');
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mainActiveTab, setMainActiveTab] = useState('projects');
  const [recentFiles, setRecentFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);

  // Validate projectId
  const isValidProjectId = projectId && UUID_REGEX.test(projectId);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);
  useEffect(() => {
    if (!isValidProjectId) {
      setProject(null);
      return;
    }
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      fetchRecentFiles();
      // Check if user has access to this project
      checkProjectAccess();
    } else if (!loading && projectId) {
      // Try to fetch the project directly (might be a shared project)
      fetchSharedProject();
    }
  }, [projectId, projects, loading, currentUser, isValidProjectId]);
  const checkProjectAccess = async () => {
    if (!currentUser || !isValidProjectId) return;
    try {
      const {
        data,
        error
      } = await supabase.rpc('user_can_access_project', {
        project_id: projectId,
        user_id: currentUser.id
      });
      if (error) throw error;
      setHasAccess(data);
    } catch (error) {
      console.error('Error checking project access:', error);
      setHasAccess(false);
    }
  };
  const fetchSharedProject = async () => {
    if (!isValidProjectId) return;
    try {
      const {
        data,
        error
      } = await supabase.from('projects').select(`
          *,
          collaborators:project_collaborators (
            id,
            user_id,
            role,
            status,
            profiles (
              name,
              username
            )
          )
        `).eq('id', projectId).eq('visibility', 'public').single();
      if (error) throw error;
      if (data) {
        setProject(data);
        setHasAccess(false); // Viewing as a guest
        fetchRecentFiles();
      }
    } catch (error) {
      console.error('Error fetching shared project:', error);
    }
  };

  // Set up real-time listeners for stats updates
  useEffect(() => {
    if (!isValidProjectId) return;
    const channel = supabase.channel('project-stats-updates').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'project_files',
      filter: `project_id=eq.${projectId}`
    }, () => refetchStats()).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'project_todos',
      filter: `project_id=eq.${projectId}`
    }, () => refetchStats()).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `project_id=eq.${projectId}`
    }, () => refetchStats()).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'project_file_deletions',
      filter: `project_id=eq.${projectId}`
    }, () => {
      refetchStats();
      fetchRecentFiles();
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'projects',
      filter: `id=eq.${projectId}`
    }, payload => {
      // Update the project state with new data
      setProject(prev => ({
        ...prev,
        ...payload.new
      }));
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, refetchStats, isValidProjectId]);
  const fetchRecentFiles = async () => {
    if (!isValidProjectId) return;
    try {
      const {
        data,
        error
      } = await supabase.from('project_files').select(`
          *,
          uploader:profiles!project_files_uploaded_by_fkey (
            name,
            username
          )
        `).eq('project_id', projectId).eq('is_pending_approval', false).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      setRecentFiles(data || []);
    } catch (error) {
      console.error('Error fetching recent files:', error);
    }
  };
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
  if (!isValidProjectId || !project) {
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
  const getProjectStatus = (project: any) => {
    if (!project.phases || project.phases.length === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-800'
      };
    }
    const currentPhase = project.current_phase_index || 0;
    const totalPhases = project.phases.length;
    if (currentPhase === 0) {
      return {
        label: 'Not Started',
        color: 'bg-red-100 text-red-800'
      };
    } else if (currentPhase >= totalPhases - 1) {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
  };
  const projectStatus = getProjectStatus(project);
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
    if (type?.startsWith('audio/')) {
      return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-purple-700" />
        </div>;
    }
    if (type?.startsWith('image/')) {
      return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-purple-700" />
        </div>;
    }
    return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
        <File className="w-4 h-4 text-purple-700" />
      </div>;
  };

  // Filter sidebar items based on access level
  const sidebarItems = [{
    id: 'overview',
    label: 'Overview',
    icon: Info
  }, ...(hasAccess ? [{
    id: 'files',
    label: 'Files',
    icon: FileText
  }] : []), ...(hasAccess ? [{
    id: 'todos',
    label: 'To-Do',
    icon: ListTodo
  }] : []), ...(hasAccess ? [{
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare
  }] : []), ...(hasAccess ? [{
    id: 'collaborators',
    label: 'Team',
    icon: Users
  }] : []), ...(hasAccess ? [{
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }] : [])];
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectInfo project={project} stats={stats} />;
      case 'files':
        return hasAccess ? <ProjectFiles projectId={project.id} /> : <div>Access denied</div>;
      case 'todos':
        return hasAccess ? <ProjectTodos projectId={project.id} /> : <div>Access denied</div>;
      case 'chat':
        return hasAccess ? <ProjectChat projectId={project.id} /> : <div>Access denied</div>;
      case 'collaborators':
        return hasAccess ? <ProjectCollaborators project={project} /> : <div>Access denied</div>;
      case 'settings':
        return hasAccess ? <ProjectSettings project={project} /> : <div>Access denied</div>;
      default:
        return <ProjectInfo project={project} stats={stats} />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Navigation Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-20">
        <Sidebar activeTab={mainActiveTab} setActiveTab={handleMainNavigation} />
      </div>

      {/* Project Sidebar */}
      <div className="fixed left-[90px] top-0 h-screen w-[320px] bg-white border-r border-gray-200 flex flex-col z-10">
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
            <Badge className={projectStatus.color}>
              {projectStatus.label}
            </Badge>
            <Badge variant="outline">{project.genre || 'No Genre'}</Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            {getVisibilityIcon(project.visibility)}
            <span className="ml-1 capitalize">{project.visibility}</span>
            {!hasAccess && <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">View Only</span>}
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
        </div>
        {/* Navigation */}
        <nav className="p-4 border-b flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
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
            {hasAccess && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Files</span>
                  <span className="text-gray-900">{statsLoading ? '...' : stats.totalFiles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Todos</span>
                  <span className="text-gray-900">{statsLoading ? '...' : `${stats.completedTodos}/${stats.totalTodos}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Messages</span>
                  <span className="text-gray-900">{statsLoading ? '...' : stats.totalMessages}</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Team Size</span>
              <span className="text-gray-900">{statsLoading ? '...' : stats.teamSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content, left margin for both sidebars, scrolls independently */}
      <div className="flex-1 flex flex-col ml-[410px] min-h-screen">
        {/* Content Area - THIS scrolls */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
