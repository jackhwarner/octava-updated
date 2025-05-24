
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, MessageCircle, Music, Users, Plus, Folder, Clock, User, Send } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import NewMessageDialog from './NewMessageDialog';
import DashboardStats from './DashboardStats';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<any>(null);

  const recentProjects = [
    {
      id: 1,
      title: 'Summer Vibes',
      description: 'Upbeat pop track perfect for summer playlists',
      collaborators: 3,
      lastUpdated: '2 days ago',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Midnight Drive',
      description: 'Chill synthwave instrumental',
      collaborators: 2,
      lastUpdated: '1 week ago',
      status: 'Review',
    },
  ];

  const onlineCollaborators = [
    { id: 1, name: 'Sarah Johnson', role: 'Producer', avatar: null },
    { id: 2, name: 'Marcus Williams', role: 'Guitarist', avatar: null },
    { id: 3, name: 'Emma Chen', role: 'Songwriter', avatar: null },
  ];

  const suggestedCollaborators = [
    { id: 4, name: 'David Kim', role: 'Pianist', avatar: null },
    { id: 5, name: 'Sophia Martinez', role: 'Vocalist', avatar: null },
    { id: 6, name: 'Jackson Lee', role: 'Producer', avatar: null },
    { id: 7, name: 'Alex Thompson', role: 'Drummer', avatar: null },
    { id: 8, name: 'Maya Patel', role: 'Violinist', avatar: null },
  ];

  const handleViewAllNotifications = () => {
    setShowNotificationsPanel(true);
  };

  const handleConnectCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowNewMessageDialog(true);
  };

  const handleMessageCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowNewMessageDialog(true);
  };

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      switch (action) {
        case 'new-project':
          onNavigate('projects');
          break;
        case 'find-collaborators':
          onNavigate('browse');
          break;
        case 'set-availability':
          onNavigate('availability');
          break;
        default:
          break;
      }
    }
  };

  const handleProjectClick = (projectId: number) => {
    if (onNavigate) {
      onNavigate('projects');
    }
  };

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats onNavigate={onNavigate || (() => {})} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions and Online Collaborators Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleQuickAction('new-project')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('find-collaborators')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Collaborators
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('set-availability')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
              </CardContent>
            </Card>

            {/* Online Collaborators */}
            <Card>
              <CardHeader>
                <CardTitle>Online Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onlineCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.role}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessageCollaborator(collaborator)}
                        className="p-2"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects Row */}
          <div className="grid grid-cols-1 gap-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Projects you've been working on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.collaborators} collaborators
                          </div>
                          <div>Updated {project.lastUpdated}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleProjectClick(project.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          View Project
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Recording Session</p>
                    <p className="text-xs text-gray-500">2:00 PM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Team Meeting</p>
                    <p className="text-xs text-gray-500">5:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Collaborators */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Collaborators</CardTitle>
              <CardDescription>Connect with new musicians</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestedCollaborators.slice(0, 5).map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.role}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-xs px-3"
                      onClick={() => handleConnectCollaborator(collaborator)}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NotificationsPanel 
        isOpen={showNotificationsPanel} 
        onClose={() => setShowNotificationsPanel(false)} 
      />
      
      <NewMessageDialog 
        isOpen={showNewMessageDialog}
        onClose={() => setShowNewMessageDialog(false)}
        selectedCollaborator={selectedCollaborator}
      />
    </div>
  );
};

export default Dashboard;
