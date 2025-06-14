
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserMinus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface ConnectedUser {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  role: string;
  location: string;
  isOnline: boolean;
}

interface FollowingMutualsProps {
  searchQuery: string;
}

const FollowingMutuals = ({ searchQuery }: FollowingMutualsProps) => {
  const [connections, setConnections] = useState<ConnectedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchConnections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get all connections for the current user
      const { data: connectionsData, error } = await supabase
        .from('connections')
        .select(`
          user1_id,
          user2_id,
          user1:profiles!connections_user1_id_fkey (
            id,
            name,
            username,
            avatar_url,
            role,
            location
          ),
          user2:profiles!connections_user2_id_fkey (
            id,
            name,
            username,
            avatar_url,
            role,
            location
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) throw error;

      // Extract the other user from each connection
      const connectedUsers: ConnectedUser[] = (connectionsData || []).map(connection => {
        const otherUser = connection.user1_id === user.id ? connection.user2 : connection.user1;
        return {
          id: otherUser.id,
          name: otherUser.name || 'Unknown',
          username: otherUser.username || 'unknown',
          avatar_url: otherUser.avatar_url || '',
          role: otherUser.role || 'Musician',
          location: otherUser.location || '',
          isOnline: Math.random() > 0.5 // Mock online status
        };
      });

      // Filter by search query
      const filteredConnections = connectedUsers.filter(connection =>
        connection.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        connection.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      // Sort: online first, then offline
      const sortedConnections = filteredConnections.sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.name.localeCompare(b.name);
      });

      setConnections(sortedConnections);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (error) throw error;

      setConnections(connections.filter(connection => connection.id !== userId));
      toast({
        title: "Success",
        description: "Connection removed successfully",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    fetchConnections();
  }, [user, debouncedSearchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
        <p className="text-gray-500">
          {searchQuery ? 'No connections match your search.' : 'Start connecting with people to see your network here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <div key={connection.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={connection.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(connection.name)}
                  </AvatarFallback>
                </Avatar>
                {connection.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{connection.name}</h3>
                  <Badge variant={connection.isOnline ? "default" : "secondary"} className="text-xs">
                    {connection.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">@{connection.username}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{connection.role}</span>
                  {connection.location && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{connection.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveConnection(connection.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingMutuals;
