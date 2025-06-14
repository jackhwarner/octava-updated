
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

interface ConnectionRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  recipientName: string;
  loading: boolean;
}

export const ConnectionRequestDialog = ({ 
  isOpen, 
  onClose, 
  onSend, 
  recipientName,
  loading 
}: ConnectionRequestDialogProps) => {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    await onSend(message.trim());
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            Connect with {recipientName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to your connection request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {message.length}/500 characters
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
