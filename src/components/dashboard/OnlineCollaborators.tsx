
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface Collaborator {
  id: number;
  name: string;
  role: string;
  avatar: null;
}

interface OnlineCollaboratorsProps {
  onMessageCollaborator: (collaborator: Collaborator) => void;
}

const OnlineCollaborators = ({ onMessageCollaborator }: OnlineCollaboratorsProps) => {
  const onlineCollaborators = [
    { id: 1, name: 'Sarah Johnson', role: 'Producer', avatar: null },
    { id: 2, name: 'Marcus Williams', role: 'Guitarist', avatar: null },
    { id: 3, name: 'Emma Chen', role: 'Songwriter', avatar: null },
  ];

  return (
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
                onClick={() => onMessageCollaborator(collaborator)}
                className="p-2"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineCollaborators;
