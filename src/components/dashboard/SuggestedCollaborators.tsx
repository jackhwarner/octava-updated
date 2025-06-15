
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, UserPlus, Music } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';

interface Collaborator {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
  skills?: string[];
  genres?: string[];
}

interface SuggestedCollaboratorsProps {
  onConnectCollaborator: (collaborator: Collaborator) => void;
}

const SuggestedCollaborators = ({
  onConnectCollaborator
}: SuggestedCollaboratorsProps) => {
  const {
    suggestedCollaborators,
    loading
  } = useCollaborators();

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
            suggestedCollaborators.slice(0, 5).map(collaborator => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage 
                      src={collaborator.avatar_url || undefined} 
                      alt={collaborator.name} 
                    />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">{collaborator.role || 'Musician'}</p>
                      {collaborator.genres && collaborator.genres.length > 0 && (
                        <>
                          <span className="text-xs text-gray-300">•</span>
                          <div className="flex flex-wrap gap-1">
                            {collaborator.genres.slice(0, 2).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {genre}
                              </Badge>
                            ))}
                            {collaborator.genres.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                +{collaborator.genres.length - 2}
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                      {collaborator.skills && collaborator.skills.length > 0 && (
                        <>
                          <span className="text-xs text-gray-300">•</span>
                          <div className="flex items-center space-x-1">
                            <Music className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {collaborator.skills.slice(0, 2).join(', ')}
                              {collaborator.skills.length > 2 && ` +${collaborator.skills.length - 2}`}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-xs px-4 py-2" 
                  onClick={() => onConnectCollaborator(collaborator)}
                >
                  <UserPlus className="w-3 h-3 mr-1" />
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
