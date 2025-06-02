
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface MutualUser {
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
  const [mutuals, setMutuals] = useState<MutualUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchMutuals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get mutual followers (users who follow me and I follow them)
      const { data: mutualData, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          following:profiles!followers_following_id_fkey (
            id,
            name,
            username,
            avatar_url,
            role,
            location
          )
        `)
        .eq('follower_id', user.id)
        .in('following_id', 
          supabase
            .from('followers')
            .select('follower_id')
            .eq('following_id', user.id)
        );

      if (error) throw error;

      // Mock online status (in a real app, you'd get this from presence/session data)
      const mutualsWithStatus: MutualUser[] = (mutualData || []).map(item => ({
        id: item.following.id,
        name: item.following.name || 'Unknown',
        username: item.following.username || 'unknown',
        avatar_url: item.following.avatar_url || '',
        role: item.following.role || 'Musician',
        location: item.following.location || '',
        isOnline: Math.random() > 0.5 // Mock online status
      }));

      // Filter by search query
      const filteredMutuals = mutualsWithStatus.filter(mutual =>
        mutual.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        mutual.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      // Sort: online first, then offline
      const sortedMutuals = filteredMutuals.sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.name.localeCompare(b.name);
      });

      setMutuals(sortedMutuals);
    } catch (error) {
      console.error('Error fetching mutuals:', error);
      toast({
        title: "Error",
        description: "Failed to load mutual followers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      setMutuals(mutuals.filter(mutual => mutual.id !== userId));
      toast({
        title: "Success",
        description: "Successfully unfollowed user",
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    fetchMutuals();
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

  if (mutuals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <UserMinus className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No mutual followers found</h3>
        <p className="text-gray-500">
          {searchQuery ? 'No mutuals match your search.' : 'Start following people to see your mutual connections here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mutuals.map((mutual) => (
        <div key={mutual.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mutual.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(mutual.name)}
                  </AvatarFallback>
                </Avatar>
                {mutual.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{mutual.name}</h3>
                  <Badge variant={mutual.isOnline ? "default" : "secondary"} className="text-xs">
                    {mutual.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">@{mutual.username}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{mutual.role}</span>
                  {mutual.location && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{mutual.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnfollow(mutual.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Unfollow
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingMutuals;
