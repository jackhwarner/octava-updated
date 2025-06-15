
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Inbox, Send, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [openPanel, setOpenPanel] = useState<'incoming' | 'outgoing' | null>('incoming');
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
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-3 rounded-md border animate-pulse flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-16 h-7 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderRequestCard = (request: ConnectionRequest, isIncoming: boolean) => (
    <div key={request.id} className="bg-white p-3 rounded-md border flex items-center space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={request.avatar_url} />
        <AvatarFallback className="bg-purple-100 text-purple-700">
          {getInitials(request.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 truncate">{request.name}</h3>
            <p className="text-xs text-gray-500 truncate">@{request.username}</p>
            <div className="flex flex-wrap items-center space-x-2 mt-1 text-xs">
              <span className="text-gray-400">{request.role}</span>
              {request.location && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">{request.location}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-1 ml-2 flex-shrink-0">
            {isIncoming ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAcceptRequest(request.id)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeclineRequest(request.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelRequest(request.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1"
              >
                <UserX className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
        {request.message && (
          <p className="text-xs text-gray-600 mt-1 italic truncate">"{request.message}"</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-2 max-w-2xl">
      {/* Incoming Requests Accordion Panel */}
      <Collapsible open={openPanel === 'incoming'} onOpenChange={(open) => setOpenPanel(open ? 'incoming' : null)}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-white px-4 py-3 border hover:bg-gray-50 focus:outline-none">
          <div className="flex items-center space-x-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            <span className="text-base font-medium">Incoming Requests</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {incomingRequests.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${openPanel === 'incoming' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-4 bg-white rounded border text-gray-500">
              <Inbox className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div className="font-medium text-gray-900">No incoming requests</div>
              <div className="text-xs">
                {searchQuery ? "No requests match your search." : "You have no pending connection requests."}
              </div>
            </div>
          ) : (
            incomingRequests.map((request) => renderRequestCard(request, true))
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Outgoing Requests Accordion Panel */}
      <Collapsible open={openPanel === 'outgoing'} onOpenChange={(open) => setOpenPanel(open ? 'outgoing' : null)}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-white px-4 py-3 border hover:bg-gray-50 focus:outline-none">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-purple-600" />
            <span className="text-base font-medium">Outgoing Requests</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
              {outgoingRequests.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${openPanel === 'outgoing' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-4 bg-white rounded border text-gray-500">
              <Send className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div className="font-medium text-gray-900">No outgoing requests</div>
              <div className="text-xs">
                {searchQuery ? "No requests match your search." : "You haven't sent any connection requests yet."}
              </div>
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
