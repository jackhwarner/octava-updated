
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
    role: string;
    location: string;
  };
}

interface FollowingRequestsProps {
  searchQuery: string;
}

const FollowingRequests = ({ searchQuery }: FollowingRequestsProps) => {
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch sent requests
      const { data: sentData, error: sentError } = await supabase
        .from('connection_requests')
        .select(`
          *,
          sender:profiles!connection_requests_receiver_id_fkey (
            id,
            name,
            username,
            avatar_url,
            role,
            location
          )
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      // Fetch received requests
      const { data: receivedData, error: receivedError } = await supabase
        .from('connection_requests')
        .select(`
          *,
          sender:profiles!connection_requests_sender_id_fkey (
            id,
            name,
            username,
            avatar_url,
            role,
            location
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (receivedError) throw receivedError;

      // Filter by search query
      const filterRequests = (requests: any[]) =>
        requests.filter(request =>
          request.sender?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          request.sender?.username?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );

      setSentRequests(filterRequests(sentData || []));
      setReceivedRequests(filterRequests(receivedData || []));
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load connection requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request accepted",
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) throw error;

      setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request declined",
      });
    } catch (error) {
      console.error('Error declining request:', error);
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      });
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setSentRequests(sentRequests.filter(req => req.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request cancelled",
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchRequests();
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
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalRequests = sentRequests.length + receivedRequests.length;

  if (totalRequests === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
        <p className="text-gray-500">
          {searchQuery ? 'No requests match your search.' : 'No pending connection requests at the moment.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      {receivedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Received Requests</h3>
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.sender?.avatar_url} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {getInitials(request.sender?.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{request.sender?.name || 'Unknown'}</h4>
                      <p className="text-sm text-gray-500">@{request.sender?.username || 'unknown'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{request.sender?.role || 'Musician'}</span>
                        {request.sender?.location && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-400">{request.sender.location}</span>
                          </>
                        )}
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{formatDate(request.created_at)}</span>
                      </div>
                      {request.message && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          "{request.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeclineRequest(request.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sent Requests</h3>
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.sender?.avatar_url} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {getInitials(request.sender?.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{request.sender?.name || 'Unknown'}</h4>
                      <p className="text-sm text-gray-500">@{request.sender?.username || 'unknown'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{request.sender?.role || 'Musician'}</span>
                        {request.sender?.location && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-400">{request.sender.location}</span>
                          </>
                        )}
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{formatDate(request.created_at)}</span>
                      </div>
                      {request.message && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          "{request.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelRequest(request.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingRequests;
