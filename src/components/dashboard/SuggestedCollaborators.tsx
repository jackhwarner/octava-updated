
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';

interface Collaborator {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
}

interface SuggestedCollaboratorsProps {
  onConnectCollaborator: (collaborator: Collaborator) => void;
}

const SuggestedCollaborators = ({ onConnectCollaborator }: SuggestedCollaboratorsProps) => {
  const { suggestedCollaborators, loading } = useCollaborators();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested Collaborators</CardTitle>
          <CardDescription>Connect with new musicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
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
        <CardTitle>Suggested Collaborators</CardTitle>
        <CardDescription>Connect with new musicians</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedCollaborators.length === 0 ? (
            <p className="text-gray-500 text-sm">No suggestions available</p>
          ) : (
            suggestedCollaborators.slice(0, 5).map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {collaborator.avatar_url ? (
                    <img 
                      src={collaborator.avatar_url} 
                      alt={collaborator.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">{collaborator.role || 'Musician'}</p>
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedCollaborators;
