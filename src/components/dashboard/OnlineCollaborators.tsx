
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import UserAvatar from '@/components/UserAvatar';
import { useState, useEffect } from 'react';
import { CollaboratorProfileDialog } from './CollaboratorProfileDialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Collaborator {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
  genres?: string[];
  skills?: string[];
  is_online?: boolean;
}

interface OnlineCollaboratorsProps {
  onMessageCollaborator: (collaborator: Collaborator) => void;
}

const OnlineCollaborators = ({ onMessageCollaborator }: OnlineCollaboratorsProps) => {
  const { user } = useAuth();
  const { onlineCollaborators, loading } = useCollaborators();
  const [viewedCollaborator, setViewedCollaborator] = useState<Collaborator | null>(null);
  const [mutuals, setMutuals] = useState<string[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      setConnectionsLoading(true);
      if (!user) {
        setMutuals([]);
        setConnectionsLoading(false);
        return;
      }
      // Fetch mutual connections (connections where current user is user1 or user2)
      const { data: connections, error } = await supabase
        .from('connections')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching connections:', error);
        setMutuals([]);
        setConnectionsLoading(false);
        return;
      }

      const mutualIds = [];
      if (connections) {
        for (const c of connections) {
          if (c.user1_id === user.id) {
            mutualIds.push(c.user2_id);
          } else if (c.user2_id === user.id) {
            mutualIds.push(c.user1_id);
          }
        }
      }
      setMutuals(mutualIds);
      setConnectionsLoading(false);
    };
    fetchConnections();
  }, [user]);

  // Only show online collaborators who are our mutuals/connections
  const onlineConnectionCollaborators =
    onlineCollaborators.filter((collab) => mutuals.includes(collab.id));

  if (loading || connectionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Online Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center px-3 py-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mr-2" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 ml-3">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Online Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {onlineConnectionCollaborators.length === 0 ? (
              <p className="text-gray-500 text-sm">No collaborators online</p>
            ) : (
              onlineConnectionCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded transition px-3 py-2"
                  onClick={(e) => {
                    setViewedCollaborator(collaborator);
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <UserAvatar
                      name={collaborator.name}
                      src={collaborator.avatar_url}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{collaborator.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500">{collaborator.role || 'Musician'}</p>
                        {/* Genres */}
                        {collaborator.genres && collaborator.genres.length > 0 && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <div className="flex flex-row flex-wrap gap-x-1 gap-y-0.5">
                              {collaborator.genres.slice(0, 2).map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="outline"
                                  className="text-[11px] px-2 py-0 border-gray-200 text-gray-700 font-normal bg-transparent"
                                >
                                  {genre}
                                </Badge>
                              ))}
                              {collaborator.genres.length > 2 && (
                                <Badge variant="outline" className="text-[11px] px-2 py-0 border-gray-100 text-gray-500 font-normal bg-transparent">
                                  +{collaborator.genres.length - 2}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                        {/* Skills */}
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <CollaboratorProfileDialog
        open={!!viewedCollaborator}
        onOpenChange={(open) => setViewedCollaborator(open ? viewedCollaborator : null)}
        collaborator={viewedCollaborator}
      />
    </>
  );
};

export default OnlineCollaborators;

