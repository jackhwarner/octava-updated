
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import UserAvatar from '@/components/UserAvatar';

interface Collaborator {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
}

interface OnlineCollaboratorsProps {
  onMessageCollaborator: (collaborator: Collaborator) => void;
}

const OnlineCollaborators = ({ onMessageCollaborator }: OnlineCollaboratorsProps) => {
  const { onlineCollaborators, loading } = useCollaborators();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Online Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Collaborators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onlineCollaborators.length === 0 ? (
            <p className="text-gray-500 text-sm">No collaborators online</p>
          ) : (
            onlineCollaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <UserAvatar
                  name={collaborator.name}
                  src={collaborator.avatar_url}
                  size="sm"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{collaborator.name}</p>
                  <p className="text-xs text-gray-500">{collaborator.role || 'Musician'}</p>
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineCollaborators;
