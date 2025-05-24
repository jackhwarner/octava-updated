
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface Collaborator {
  id: number;
  name: string;
  role: string;
  avatar: null;
}

interface SuggestedCollaboratorsProps {
  onConnectCollaborator: (collaborator: Collaborator) => void;
}

const SuggestedCollaborators = ({ onConnectCollaborator }: SuggestedCollaboratorsProps) => {
  const suggestedCollaborators = [
    { id: 4, name: 'David Kim', role: 'Pianist', avatar: null },
    { id: 5, name: 'Sophia Martinez', role: 'Vocalist', avatar: null },
    { id: 6, name: 'Jackson Lee', role: 'Producer', avatar: null },
    { id: 7, name: 'Alex Thompson', role: 'Drummer', avatar: null },
    { id: 8, name: 'Maya Patel', role: 'Violinist', avatar: null },
  ];

  return (
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
                onClick={() => onConnectCollaborator(collaborator)}
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedCollaborators;
