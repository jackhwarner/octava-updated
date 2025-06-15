import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Inbox, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import SectionAccordion from './SectionAccordion'
import RequestRow from './RequestRow'

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
  const [outgoingOpen, setOutgoingOpen] = useState(true);
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
          <div key={idx} className="bg-white px-6 py-6 rounded-2xl">
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

  // Move the renderRequestRow to a callback to pass to SectionAccordion
  const renderRequestRow = (
    request: ConnectionRequest,
    isIncoming: boolean,
    isLast: boolean
  ) => (
    <RequestRow
      request={request}
      isIncoming={isIncoming}
      isLast={isLast}
      onAccept={handleAcceptRequest}
      onDecline={handleDeclineRequest}
      onCancel={handleCancelRequest}
      getInitials={getInitials}
    />
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionAccordion
        open={incomingOpen}
        setOpen={setIncomingOpen}
        label="Incoming Requests"
        requests={incomingRequests}
        icon={<Inbox className="w-5 h-5 text-blue-600" />}
        emptyTitle="No incoming requests"
        emptyMessage="You have no pending connection requests."
        isIncoming={true}
        renderRequestRow={renderRequestRow}
        searchQuery={searchQuery}
      />
      <SectionAccordion
        open={outgoingOpen}
        setOpen={setOutgoingOpen}
        label="Outgoing Requests"
        requests={outgoingRequests}
        icon={<Send className="w-5 h-5 text-purple-600" />}
        emptyTitle="No outgoing requests"
        emptyMessage="You haven't sent any connection requests yet."
        isIncoming={false}
        renderRequestRow={renderRequestRow}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default FollowingRequests;
