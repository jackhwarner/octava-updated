
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Inbox, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

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
  const [incomingOpen, setIncomingOpen] = useState(true);
  const [outgoingOpen, setOutgoingOpen] = useState(false);
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

      // Format incoming requests
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

      // Format outgoing requests
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

  const renderRequestCard = (request: ConnectionRequest, isIncoming: boolean) => (
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
            {request.message && (
              <p className="text-sm text-gray-600 mt-2 italic">"{request.message}"</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {isIncoming ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAcceptRequest(request.id)}
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
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelRequest(request.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <UserX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Incoming Requests */}
      <Collapsible open={incomingOpen} onOpenChange={setIncomingOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-white p-4 border hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <Inbox className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Incoming Requests</h3>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {incomingRequests.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${incomingOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border">
              <Inbox className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h4>
              <p className="text-gray-500">
                {searchQuery ? 'No requests match your search.' : 'You have no pending connection requests.'}
              </p>
            </div>
          ) : (
            incomingRequests.map((request) => renderRequestCard(request, true))
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Outgoing Requests */}
      <Collapsible open={outgoingOpen} onOpenChange={setOutgoingOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-white p-4 border hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <Send className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Outgoing Requests</h3>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              {outgoingRequests.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${outgoingOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border">
              <Send className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h4>
              <p className="text-gray-500">
                {searchQuery ? 'No requests match your search.' : 'You haven\'t sent any connection requests yet.'}
              </p>
            </div>
          ) : (
            outgoingRequests.map((request) => renderRequestCard(request, false))
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FollowingRequests;
