import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import BulletinBoard from '../components/browse/BulletinBoard';
import SearchResults from '../components/browse/SearchResults';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import roles from '../constants/roles';
import genres from '../constants/genres';
import instruments from '../constants/instruments';
import type { Profile } from '../hooks/useProfile';

const BrowsePage = () => {
  const { profile: userProfile, loading: profileLoading } = useProfile();
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // TODO: Fetch suggested profiles based on user's profile
    // This would be implemented when we have the backend ready
    setSuggestedProfiles([]);
  }, [userProfile]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedRole && !selectedGenre && !selectedExperience) {
      setHasSearched(false);
      return;
    }
    
    setIsSearching(true);
    try {
      // TODO: Implement actual search API call
      // For now, just simulate a search
      const results: Profile[] = []; // This would be replaced with actual API call
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = () => {
    // Reset search state when filters change
    setHasSearched(false);
  };

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse</h1>
        <p className="text-gray-600">Find collaborators and project opportunities</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for collaborators..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHasSearched(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              value={selectedRole} 
              onValueChange={(value) => {
                setSelectedRole(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role.toLowerCase()}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedGenre} 
              onValueChange={(value) => {
                setSelectedGenre(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedExperience} 
              onValueChange={(value) => {
                setSelectedExperience(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Experience Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {hasSearched ? (
              <SearchResults profiles={searchResults} />
            ) : (
              <BulletinBoard userProfile={userProfile} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            {!hasSearched && (
              <SearchResults profiles={suggestedProfiles} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage; 