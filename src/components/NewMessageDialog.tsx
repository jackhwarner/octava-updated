
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, User } from 'lucide-react';

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMessageDialog = ({ isOpen, onClose }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  const users = [
    { id: 1, name: 'Sarah Johnson', username: '@sarah_beats', role: 'Producer' },
    { id: 2, name: 'Marcus Williams', username: '@marcus_guitar', role: 'Guitarist' },
    { id: 3, name: 'Emma Chen', username: '@emma_writes', role: 'Songwriter' },
    { id: 4, name: 'David Kim', username: '@david_keys', role: 'Pianist' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      // Handle sending message
      onClose();
      setSelectedUser(null);
      setMessage('');
      setSearchTerm('');
    }
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Search for a collaborator to start a conversation
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedUser ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="search">Search for a user</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Type a name or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              {searchTerm && (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.username} • {user.role}</div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.username}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  Change
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send Message
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
