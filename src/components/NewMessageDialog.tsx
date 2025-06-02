import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, User, Users, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { useDebounce } from '@/hooks/useDebounce'; // Assuming a useDebounce hook exists
import { useMessages, MessageThread } from '@/hooks/useMessages'; // Import useMessages hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCollaborator?: any; // Consider a more specific type if possible
}

// Define a type for user profiles fetched from the database
interface UserProfile {
  id: string; // Assuming Supabase user IDs are strings
  name: string | null; // Assuming name is nullable
  username: string | null; // Assuming username is nullable
  // Add other profile fields you might need (e.g., avatar_url)
}

const NewMessageDialog = ({ isOpen, onClose, selectedCollaborator }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]); // Use UserProfile type
  const [isGroupMessage, setIsGroupMessage] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]); // State for search results
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // Add loading state
  const { createThread, fetchThreads, sendMessage, threads, currentUser, fetchMessages } = useMessages(); // Get createThread, fetchThreads, and sendMessage from useMessages
  const navigate = useNavigate(); // Get navigate function
  
  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Adjust debounce time as needed

  // Fetch users from database based on search term
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

      // Optimize search query to only search for non-empty terms
      const searchTerm = term.trim();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username')
        .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(10); // Limit results for better performance
        
      if (error) throw error;

      // Filter out the current user from search results
      const filteredResults = data.filter((user: UserProfile) => user.id !== currentUser.id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Trigger search when debouncedSearchTerm changes
  useEffect(() => {
    if (isOpen && debouncedSearchTerm.trim()) {
      searchUsers(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, searchUsers, isOpen]);

  // Only fetch threads when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchThreads();
    }
  }, [isOpen, fetchThreads]);

  // Set the selected user when selectedCollaborator is provided
  useEffect(() => {
    if (selectedCollaborator && isOpen) {
       // Assuming selectedCollaborator has a structure compatible with UserProfile
      setSelectedUsers([selectedCollaborator]);
      setSearchTerm(''); // Clear search term
       setSearchResults([]); // Clear search results
    }
  }, [selectedCollaborator, isOpen]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearchTerm('');
      setIsGroupMessage(false);
      setGroupName('');
      setSearchResults([]); // Also clear search results on close
       setIsSearching(false); // Reset searching state
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
        // Send initial message and fetch threads in parallel
        await Promise.all([
          sendMessage('Hi there!', undefined, threadId),
          fetchThreads()
        ]);
        
        // Close dialog and navigate
        onClose();
        navigate(`/messages/${threadId}`);
      }
    } catch (error) {
      console.error('Error creating message/chat or navigating:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Update handleUserSelect to use UserProfile type
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
      setSearchTerm(''); // Clear search term after selecting a user in non-group mode
       setSearchResults([]); // Clear search results after selecting a user
    }
  };

  // Update removeUser to use UserProfile id type (string)
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
                    <span className="text-sm">{user.name || user.username}</span>{/* Display name or username */}
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
                 {/* Optional: Add a loading spinner here */}
                 Loading...
                </div>
              )}
            </div>
          </div>
          
          {searchTerm && ( // Only show search results if there's a search term
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
                      {/* Display user initial or avatar */}
                      <User className="w-5 h-5" />{/* Replace with avatar if available */}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name || user.username}</div>{/* Display name or username */}
                      {/* Optional: Display user role or other info if available in profile */}
                      {/* <div className="text-sm text-gray-500">{user.role}</div> */}
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
