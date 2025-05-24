
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const handleQuickAction = (action: string) => {
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
  };

  return (
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
  );
};

export default QuickActions;
