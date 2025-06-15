
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Inbox, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  name: string;
  username: string;
  avatar_url: string;
  role: string;
  location: string;
  message: string;
  created_at: string;
}

interface FollowingRequestsProps {
  searchQuery: string;
}

const FollowingRequests = ({ searchQuery }: FollowingRequestsProps) => {
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchConnectionRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get incoming requests
      const { data: incomingData, error: incomingError } = await supabase
        .from('connection_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
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

      if (incomingError) throw incomingError;

      // Get outgoing requests
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('connection_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          receiver:profiles!connection_requests_receiver_id_fkey (
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

      if (outgoingError) throw outgoingError;

      const formattedIncoming: ConnectionRequest[] = (incomingData || []).map(item => ({
        id: item.id,
        sender_id: item.sender_id,
        receiver_id: item.receiver_id,
        name: item.sender?.name || 'Unknown',
        username: item.sender?.username || 'unknown',
        avatar_url: item.sender?.avatar_url || '',
        role: item.sender?.role || 'Musician',
        location: item.sender?.location || '',
        message: item.message || '',
        created_at: item.created_at,
      }));

      const formattedOutgoing: ConnectionRequest[] = (outgoingData || []).map(item => ({
        id: item.id,
        sender_id: item.sender_id,
        receiver_id: item.receiver_id,
        name: item.receiver?.name || 'Unknown',
        username: item.receiver?.username || 'unknown',
        avatar_url: item.receiver?.avatar_url || '',
        role: item.receiver?.role || 'Musician',
        location: item.receiver?.location || '',
        message: item.message || '',
        created_at: item.created_at,
      }));

      // Filter by search query
      const filteredIncoming = formattedIncoming.filter(request =>
        request.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        request.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      const filteredOutgoing = formattedOutgoing.filter(request =>
        request.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        request.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      setIncomingRequests(filteredIncoming);
      setOutgoingRequests(filteredOutgoing);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
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
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      setIncomingRequests(requests => requests.filter(request => request.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request accepted",
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      setIncomingRequests(requests => requests.filter(request => request.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request declined",
      });
    } catch (error) {
      console.error('Error declining connection request:', error);
      toast({
        title: "Error",
        description: "Failed to decline connection request",
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

      setOutgoingRequests(requests => requests.filter(request => request.id !== requestId));
      toast({
        title: "Success",
        description: "Connection request cancelled",
      });
    } catch (error) {
      console.error('Error cancelling connection request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel connection request",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    fetchConnectionRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, debouncedSearchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="bg-white px-0">
            <div className="py-4 border-b border-gray-200 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="flex space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded" />
                <div className="w-16 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderRequestRow = (request: ConnectionRequest, isIncoming: boolean, isLast: boolean) => (
    <div
      key={request.id}
      className={`flex items-center justify-between px-0 py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 bg-gray-100">
          <AvatarImage src={request.avatar_url} />
          <AvatarFallback className="bg-purple-100 text-purple-700">
            {getInitials(request.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-gray-900">{request.name}</div>
          <div className="text-sm text-gray-600">@{request.username}</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-400">{request.role}</span>
            {request.location && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400">{request.location}</span>
              </>
            )}
          </div>
          {request.message && (
            <p className="text-xs text-gray-500 mt-1 italic">"{request.message}"</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-start sm:items-center ml-4">
        {isIncoming ? (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAcceptRequest(request.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeclineRequest(request.id)}
              className="text-red-600 hover:text-red-700"
            >
              <UserX className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelRequest(request.id)}
            className="text-red-600 hover:text-red-700"
          >
            <UserX className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );

  const renderSection = (label: string, requests: ConnectionRequest[], emptyIcon: React.ReactNode, emptyTitle: string, emptyMessage: string, isIncoming: boolean) => (
    <section className="bg-white w-full mb-6">
      <header className="flex items-center gap-2 px-0 py-4 border-b-2 border-gray-200">
        {emptyIcon}
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{label}</h2>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${isIncoming ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {requests.length}
        </span>
      </header>
      <div className="divide-y divide-gray-100">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3">{emptyIcon}</div>
            <h4 className="text-gray-800 text-base font-medium mb-1">{emptyTitle}</h4>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No requests match your search.' : emptyMessage}
            </p>
          </div>
        ) : (
          requests.map((request, idx) =>
            renderRequestRow(request, isIncoming, idx === requests.length - 1)
          )
        )}
      </div>
    </section>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {renderSection(
        "Incoming Requests",
        incomingRequests,
        <Inbox className="w-5 h-5 text-blue-600" />,
        "No incoming requests",
        "You have no pending connection requests.",
        true
      )}
      {renderSection(
        "Outgoing Requests",
        outgoingRequests,
        <Send className="w-5 h-5 text-purple-600" />,
        "No outgoing requests",
        "You haven't sent any connection requests yet.",
        false
      )}
    </div>
  );
};

export default FollowingRequests;
