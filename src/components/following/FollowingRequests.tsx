
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface FollowRequest {
  id: string;
  follower_id: string;
  name: string;
  username: string;
  avatar_url: string;
  role: string;
  location: string;
  created_at: string;
}

interface FollowingRequestsProps {
  searchQuery: string;
}

const FollowingRequests = ({ searchQuery }: FollowingRequestsProps) => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchFollowRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get pending follow requests (assumes you have a follow_requests table or status field)
      // For now, using mock data since the structure isn't defined
      const mockRequests: FollowRequest[] = [
        {
          id: '1',
          follower_id: 'user1',
          name: 'John Smith',
          username: 'johnsmith',
          avatar_url: '',
          role: 'Producer',
          location: 'Los Angeles, CA',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          follower_id: 'user2',
          name: 'Sarah Wilson',
          username: 'sarahwilson',
          avatar_url: '',
          role: 'Singer',
          location: 'Nashville, TN',
          created_at: new Date().toISOString(),
        }
      ];

      // Filter by search query
      const filteredRequests = mockRequests.filter(request =>
        request.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        request.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      setRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching follow requests:', error);
      toast({
        title: "Error",
        description: "Failed to load follow requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, followerId: string) => {
    if (!user) return;

    try {
      // Accept the follow request
      const { error } = await supabase
        .from('followers')
        .insert([
          { follower_id: followerId, following_id: user.id }
        ]);

      if (error) throw error;

      setRequests(requests.filter(request => request.id !== requestId));
      toast({
        title: "Success",
        description: "Follow request accepted",
      });
    } catch (error) {
      console.error('Error accepting follow request:', error);
      toast({
        title: "Error",
        description: "Failed to accept follow request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      // Remove the follow request
      setRequests(requests.filter(request => request.id !== requestId));
      toast({
        title: "Success",
        description: "Follow request declined",
      });
    } catch (error) {
      console.error('Error declining follow request:', error);
      toast({
        title: "Error",
        description: "Failed to decline follow request",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    fetchFollowRequests();
  }, [user, debouncedSearchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No follow requests</h3>
        <p className="text-gray-500">
          {searchQuery ? 'No requests match your search.' : 'You have no pending follow requests.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={request.avatar_url} />
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {getInitials(request.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{request.name}</h3>
                <p className="text-sm text-gray-500">@{request.username}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{request.role}</span>
                  {request.location && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{request.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAcceptRequest(request.id, request.follower_id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeclineRequest(request.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <UserX className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingRequests;
