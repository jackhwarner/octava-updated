
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, User, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCollaborator?: any;
}

const NewMessageDialog = ({ isOpen, onClose, selectedCollaborator }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isGroupMessage, setIsGroupMessage] = useState(false);
  const [groupName, setGroupName] = useState('');

  const users = [
    { id: 1, name: 'Sarah Johnson', username: '@sarah_beats', role: 'Producer' },
    { id: 2, name: 'Marcus Williams', username: '@marcus_guitar', role: 'Guitarist' },
    { id: 3, name: 'Emma Chen', username: '@emma_writes', role: 'Songwriter' },
    { id: 4, name: 'David Kim', username: '@david_keys', role: 'Pianist' },
  ];

  // Set the selected user when selectedCollaborator is provided
  useEffect(() => {
    if (selectedCollaborator && isOpen) {
      setSelectedUsers([selectedCollaborator]);
      setSearchTerm('');
    }
  }, [selectedCollaborator, isOpen]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearchTerm('');
      setIsGroupMessage(false);
      setGroupName('');
    }
  }, [isOpen]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateMessage = () => {
    if (selectedUsers.length > 0) {
      // Handle creating the message/chat
      console.log('Creating message/chat with:', { selectedUsers, isGroupMessage, groupName });
      onClose();
    }
  };

  const handleUserSelect = (user: any) => {
    if (isGroupMessage) {
      setSelectedUsers(prev => {
        const isAlreadySelected = prev.some(u => u.id === user.id);
        if (isAlreadySelected) {
          return prev.filter(u => u.id !== user.id);
        } else {
          return [...prev, user];
        }
      });
    } else {
      setSelectedUsers([user]);
      setSearchTerm('');
    }
  };

  const removeUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Start a conversation with collaborators
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="group-mode"
              checked={isGroupMessage}
              onCheckedChange={setIsGroupMessage}
            />
            <Label htmlFor="group-mode" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Group Message</span>
            </Label>
          </div>

          {isGroupMessage && (
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected {isGroupMessage ? 'Members' : 'Recipient'}</Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{user.name}</span>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="search">
              {isGroupMessage ? 'Add Members' : 'Search for a user'}
            </Label>
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
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${
                      isSelected ? 'bg-purple-50 border-purple-200' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.username} • {user.role}</div>
                    </div>
                    {isSelected && <span className="text-purple-600">✓</span>}
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No users found
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMessage}
              disabled={selectedUsers.length === 0 || (isGroupMessage && !groupName.trim())}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Start {isGroupMessage ? 'Group' : 'Chat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
