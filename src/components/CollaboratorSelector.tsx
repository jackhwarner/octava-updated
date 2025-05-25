
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Collaborator {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface CollaboratorSelectorProps {
  selectedCollaborators: Collaborator[];
  onCollaboratorsChange: (collaborators: Collaborator[]) => void;
}

const CollaboratorSelector = ({ selectedCollaborators, onCollaboratorsChange }: CollaboratorSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Collaborator[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchCollaborators = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, role')
        .or(`name.ilike.%${term}%,username.ilike.%${term}%`)
        .limit(10);

      if (error) throw error;

      const formattedResults = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name || 'No name',
        username: profile.username || 'No username',
        role: profile.role || 'Musician'
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching collaborators:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCollaborators(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const addCollaborator = (collaborator: Collaborator) => {
    if (!selectedCollaborators.find(c => c.id === collaborator.id)) {
      onCollaboratorsChange([...selectedCollaborators, collaborator]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeCollaborator = (collaboratorId: string) => {
    onCollaboratorsChange(selectedCollaborators.filter(c => c.id !== collaboratorId));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search collaborators by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map((collaborator) => (
              <div
                key={collaborator.id}
                onClick={() => addCollaborator(collaborator)}
                className="p-3 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 border-b last:border-b-0"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{collaborator.name}</div>
                  <div className="text-xs text-gray-500">@{collaborator.username} • {collaborator.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCollaborators.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected Collaborators:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCollaborators.map((collaborator) => (
              <Badge key={collaborator.id} variant="secondary" className="flex items-center gap-1">
                {collaborator.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeCollaborator(collaborator.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorSelector;
