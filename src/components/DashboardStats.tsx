
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Folder, MessageCircle, Play } from 'lucide-react';

interface DashboardStatsProps {
  onNavigate: (tab: string) => void;
}

const DashboardStats = ({ onNavigate }: DashboardStatsProps) => {
  const stats = [
    {
      title: 'Collaborations',
      value: '12',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      action: () => onNavigate('browse'),
    },
    {
      title: 'Projects',
      value: '8',
      icon: Folder,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      action: () => onNavigate('projects'),
    },
    {
      title: 'Unread Messages',
      value: '5',
      icon: MessageCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      action: () => onNavigate('messages'),
    },
    {
      title: 'Total Plays',
      value: '1.2k',
      icon: Play,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      action: () => onNavigate('profile'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                className="w-full h-full p-0 flex flex-col items-start space-y-2"
                onClick={stat.action}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 text-left">{stat.title}</p>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
