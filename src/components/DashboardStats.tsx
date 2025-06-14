
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Users, MessageSquare } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

interface DashboardStatsProps {
  onNavigate: (tab: string) => void;
}

const DashboardStats = ({
  onNavigate
}: DashboardStatsProps) => {
  const {
    stats,
    loading
  } = useDashboardStats();

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>)}
      </div>;
  }

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('projects')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Music className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            total projects
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('collaborators')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mutuals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCollaborations}</div>
          <p className="text-xs text-muted-foreground">mutual friends</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('messages')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unreadMessages}</div>
          <p className="text-xs text-muted-foreground">
            unread messages
          </p>
        </CardContent>
      </Card>
    </div>;
};

export default DashboardStats;

