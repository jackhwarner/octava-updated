
import { useState } from 'react';
import NotificationsPanel from './NotificationsPanel';
import NewMessageDialog from './NewMessageDialog';
import DashboardStats from './DashboardStats';
import QuickActions from './dashboard/QuickActions';
import OnlineCollaborators from './dashboard/OnlineCollaborators';
import RecentProjects from './dashboard/RecentProjects';
import SuggestedCollaborators from './dashboard/SuggestedCollaborators';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<any>(null);

  const handleConnectCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowNewMessageDialog(true);
  };

  const handleMessageCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setShowNewMessageDialog(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats onNavigate={onNavigate || (() => {})} />

      <div className="space-y-8">
        {/* Quick Actions and Recent Projects Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActions onNavigate={onNavigate || (() => {})} />
          <RecentProjects onNavigate={onNavigate || (() => {})} />
        </div>

        {/* Online Collaborators and Suggested Collaborators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OnlineCollaborators onMessageCollaborator={handleMessageCollaborator} />
          <SuggestedCollaborators onConnectCollaborator={handleConnectCollaborator} />
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
