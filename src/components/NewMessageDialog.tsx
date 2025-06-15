
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, User, Users, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useMessages, MessageThread } from '@/hooks/useMessages';
import { useNavigate } from 'react-router-dom';

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCollaborator?: any;
}

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
}

const NewMessageDialog = ({ isOpen, onClose, selectedCollaborator }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const [isGroupMessage, setIsGroupMessage] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { createThread, fetchThreads, threads, currentUser } = useMessages();
  const navigate = useNavigate();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchUsers = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        setIsSearching(false);
        return;
      }

      const searchTerm = term.trim();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username')
        .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(10);
        
      if (error) throw error;

      const filteredResults = data.filter((user: UserProfile) => user.id !== currentUser.id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && debouncedSearchTerm.trim()) {
      searchUsers(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, searchUsers, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchThreads();
    }
  }, [isOpen, fetchThreads]);

  useEffect(() => {
    if (selectedCollaborator && isOpen) {
      setSelectedUsers([selectedCollaborator]);
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [selectedCollaborator, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearchTerm('');
      setIsGroupMessage(false);
      setGroupName('');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  const handleCreateMessage = async () => {
    if (selectedUsers.length === 0 || (isGroupMessage && !groupName.trim())) {
      return;
    }

    setIsCreating(true);
    try {
      let threadId = undefined;
      let newThread = null;

      if (isGroupMessage) {
        const participantIds = selectedUsers.map(user => user.id);
        newThread = await createThread(groupName.trim(), participantIds, true);
        threadId = newThread.id;
      } else if (selectedUsers.length === 1 && currentUser) {
        const recipientId = selectedUsers[0].id;
        
        // Check if a 1-on-1 thread already exists with this recipient
        const existingThread = threads.find((thread: MessageThread) =>
          !thread.is_group &&
          thread.participants?.length === 2 &&
          thread.participants.some((p: { user_id: string; joined_at: string; profiles: { name: string; username: string; }; }) => p.user_id === currentUser.id) &&
          thread.participants.some((p: { user_id: string; joined_at: string; profiles: { name: string; username: string; }; }) => p.user_id === recipientId)
        );

        if (existingThread) {
          onClose();
          navigate(`/messages/${existingThread.id}`);
          return;
        } else {
          newThread = await createThread('', [recipientId], false);
          threadId = newThread.id;
        }
      } else {
        console.error("Invalid selection for message creation or currentUser not available");
        return;
      }
      
      if (threadId && newThread) {
        // Just fetch threads and navigate - no initial message
        await fetchThreads();
        onClose();
        navigate(`/messages/${threadId}`);
      }
    } catch (error) {
      console.error('Error creating message/chat or navigating:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUserSelect = (user: UserProfile) => {
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
      setSearchResults([]);
    }
  };

  const removeUser = (userId: string) => {
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
                placeholder="Enter group name"
                value={groupName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
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
                    <span className="text-sm">{user.name || user.username}</span>
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
               {isSearching && (
                <div className="absolute right-3 top-3">
                 Loading...
                </div>
              )}
            </div>
          </div>
          
          {searchTerm && (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {searchResults.map((user) => {
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
                      <div className="font-medium">{user.name || user.username}</div>
                    </div>
                    {isSelected && <span className="text-purple-600">✓</span>}
                  </div>
                );
              })}
              {!isSearching && searchResults.length === 0 && searchTerm.trim() && (
                <div className="text-center py-4 text-gray-500">
                  No users found
                </div>
              )}
               {isSearching && searchTerm.trim() && (
                 <div className="text-center py-4 text-gray-500">
                   Searching...
                 </div>
               )}
            </div>
          )}

          <div className="flex space-x-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMessage}
              disabled={selectedUsers.length === 0 || (isGroupMessage && !groupName.trim()) || isCreating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Start ${isGroupMessage ? 'Group' : 'Chat'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
