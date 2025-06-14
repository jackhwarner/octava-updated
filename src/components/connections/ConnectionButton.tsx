
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { UserPlus, UserCheck, UserX, UserMinus } from 'lucide-react';
import { useConnections, ConnectionState } from '@/hooks/useConnections';
import { ConnectionRequestDialog } from './ConnectionRequestDialog';

interface ConnectionButtonProps {
  userId: string;
  userName?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ConnectionButton = ({ 
  userId, 
  userName = 'User',
  className = '', 
  variant = 'default',
  size = 'default'
}: ConnectionButtonProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({ status: 'none' });
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  
  const {
    loading,
    getConnectionState,
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

  const handleConnect = async () => {
    setShowRequestDialog(true);
  };

  const handleSendRequest = async (message: string) => {
    await sendConnectionRequest(userId, message);
    setConnectionState(prev => ({ ...prev, status: 'requested' }));
  };

  const handleAcceptRequest = async () => {
    if (connectionState.requestId) {
      await acceptConnectionRequest(connectionState.requestId);
      setConnectionState(prev => ({ ...prev, status: 'connected' }));
    }
  };

  const handleDeclineRequest = async () => {
    if (connectionState.requestId) {
      await declineConnectionRequest(connectionState.requestId);
      setConnectionState(prev => ({ ...prev, status: 'none' }));
    }
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
        <>
          <Button 
            onClick={handleConnect}
            variant={variant}
            size={size}
            className={className}
            disabled={loading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
          <ConnectionRequestDialog
            isOpen={showRequestDialog}
            onClose={() => setShowRequestDialog(false)}
            onSend={handleSendRequest}
            recipientName={userName}
            loading={loading}
          />
        </>
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
          <UserMinus className="w-4 h-4 mr-2" />
          Remove
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
            onClick={handleAcceptRequest}
            variant="default"
            size={size}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button 
            onClick={handleDeclineRequest}
            variant="outline"
            size={size}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
};
