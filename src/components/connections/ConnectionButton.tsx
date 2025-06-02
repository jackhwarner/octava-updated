import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { UserPlus, UserCheck, UserX, UserMinus } from 'lucide-react';
import { useConnections, ConnectionState } from '@/hooks/useConnections';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface ConnectionButtonProps {
  userId: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ConnectionButton = ({ 
  userId, 
  className = '', 
  variant = 'default',
  size = 'default'
}: ConnectionButtonProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({ status: 'none', isPrivate: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  
  const {
    loading,
    getConnectionState,
    followUser,
    unfollowUser,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection
  } = useConnections();

  useEffect(() => {
    const fetchConnectionState = async () => {
      const state = await getConnectionState(userId);
      setConnectionState(state);
      setIsLoading(false);
    };
    fetchConnectionState();
  }, [userId, getConnectionState]);

  const handleFollow = async () => {
    if (connectionState.isPrivate) {
      setShowRequestDialog(true);
    } else {
      await followUser(userId);
      setConnectionState(prev => ({ ...prev, status: 'following' }));
    }
  };

  const handleUnfollow = async () => {
    await unfollowUser(userId);
    setConnectionState(prev => ({ ...prev, status: 'none' }));
  };

  const handleConnect = async () => {
    if (requestMessage.trim()) {
      await sendConnectionRequest(userId, requestMessage);
    } else {
      await sendConnectionRequest(userId);
    }
    setConnectionState(prev => ({ ...prev, status: 'requested' }));
    setShowRequestDialog(false);
    setRequestMessage('');
  };

  const handleAcceptRequest = async (requestId: string) => {
    await acceptConnectionRequest(requestId);
    setConnectionState(prev => ({ ...prev, status: 'connected' }));
  };

  const handleDeclineRequest = async (requestId: string) => {
    await declineConnectionRequest(requestId);
    setConnectionState(prev => ({ ...prev, status: 'none' }));
  };

  const handleRemoveConnection = async () => {
    await removeConnection(userId);
    setConnectionState(prev => ({ ...prev, status: 'none' }));
  };

  if (isLoading) {
    return (
      <Button disabled variant={variant} size={size} className={className}>
        Loading...
      </Button>
    );
  }

  switch (connectionState.status) {
    case 'none':
      return (
        <Button 
          onClick={handleFollow}
          variant={variant}
          size={size}
          className={className}
          disabled={loading}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {connectionState.isPrivate ? 'Request to Follow' : 'Follow'}
        </Button>
      );

    case 'following':
      return (
        <Button 
          onClick={handleUnfollow}
          variant="outline"
          size={size}
          className={className}
          disabled={loading}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </Button>
      );

    case 'connected':
      return (
        <Button 
          onClick={handleRemoveConnection}
          variant="outline"
          size={size}
          className={className}
          disabled={loading}
        >
          <UserX className="w-4 h-4 mr-2" />
          Remove Connection
        </Button>
      );

    case 'requested':
      return (
        <Button 
          variant="outline"
          size={size}
          className={className}
          disabled
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      );

    case 'pending_request':
      return (
        <div className="flex gap-2">
          <Button 
            onClick={() => handleAcceptRequest(connectionState.requestId!)}
            variant="default"
            size={size}
            className={className}
            disabled={loading}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button 
            onClick={() => handleDeclineRequest(connectionState.requestId!)}
            variant="outline"
            size={size}
            className={className}
            disabled={loading}
          >
            <UserX className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      );

    default:
      return null;
  }

  return (
    <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to your connection request..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRequestDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={loading}
            >
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 