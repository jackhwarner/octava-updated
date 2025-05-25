import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
interface Project {
  id: number;
  title: string;
  description: string;
  collaborators: number;
  lastUpdated: string;
  status: string;
}
interface RecentProjectsProps {
  onNavigate: (tab: string) => void;
}
const RecentProjects = ({
  onNavigate
}: RecentProjectsProps) => {
  const recentProjects = [{
    id: 1,
    title: 'Summer Vibes',
    description: 'Upbeat pop track perfect for summer playlists',
    collaborators: 3,
    lastUpdated: '2 days ago',
    status: 'In Progress'
  }, {
    id: 2,
    title: 'Midnight Drive',
    description: 'Chill synthwave instrumental',
    collaborators: 2,
    lastUpdated: '1 week ago',
    status: 'Review'
  }];
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
  const handleProjectClick = (projectId: number) => {
    onNavigate('projects');
  };
  return <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.map(project => <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                <Button size="sm" onClick={() => handleProjectClick(project.id)} className="bg-purple-600 hover:bg-purple-700">
                  View Project
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default RecentProjects;