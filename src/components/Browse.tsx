import { useEffect, useState } from 'react';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
// import BulletinBoard from './browse/BulletinBoard';
// import SuggestedCollaborators from './browse/SuggestedCollaborators';
import BulletinBoard from './browse/BulletinBoard';
import { useCollaborators } from '../hooks/useCollaborators';
import { useProfile } from '../hooks/useProfile';
import { useSuggestedProjects } from '../hooks/useSuggestedProjects';
import { useBrowseFilters } from '../hooks/useBrowseFilters';
import { filterSuggestedProjects } from '../utils/browseFilters';
import { rankCollaborators } from '../utils/collaboratorMatching';
import FilteredSuggestedProjects from './browse/FilteredSuggestedProjects';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import type { Profile } from '../hooks/useProfile';

interface DatabaseProfile {
  id: string;
  name: string | null;
  username: string | null;
  role: string | null;
  genres: string[] | null;
  location: string | null;
  experience: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  visibility: string | null;
}

const Browse = () => {
  const {
    selectedRole,
    setSelectedRole,
    selectedGenre,
    setSelectedGenre,
    selectedInstrument,
    setSelectedInstrument,
    selectedExperience,
    setSelectedExperience,
    location,
    setLocation
  } = useBrowseFilters();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const {
    suggestedCollaborators,
    loading: collaboratorsLoading
  } = useCollaborators();
  const {
    profile,
    loading: profileLoading
  } = useProfile();
  const {
    suggestedProjects,
    loading: suggestedProjectsLoading
  } = useSuggestedProjects();
  const { toast } = useToast();

  // Format collaborators and filter out incomplete profiles
  const collaboratorsFormatted = suggestedCollaborators
    .filter(collaborator => 
      collaborator.id && 
      collaborator.name && 
      collaborator.username && 
      collaborator.role
    )
    .map(collaborator => ({
      ...collaborator,
      genres: collaborator.genres || [],
      location: collaborator.location || 'Unknown',
      experience: collaborator.experience || 'Beginner',
      skills: collaborator.skills || []
    }));

  const handleSearch = async () => {
    // Only search if at least one filter is set
    const anyFilters = selectedRole || selectedGenre || selectedInstrument || selectedExperience || location;
    if (!anyFilters) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Log search parameters
      console.log('Searching by:', {
        role: selectedRole || 'not set',
        genre: selectedGenre || 'not set',
        instrument: selectedInstrument || 'not set',
        experience: selectedExperience || 'not set',
        location: location || 'not set'
      });

      let query = supabase
        .from('profiles')
        .select('id, name, username, role, genres, location, experience, avatar_url, skills, visibility')
        .eq('visibility', 'public')
        .not('id', 'is', null)
        .not('name', 'is', null)
        .not('username', 'is', null)
        .not('role', 'is', null);

      // Apply filters
      if (selectedRole) {
        // Use ilike for case-insensitive matching
        query = query.ilike('role', `%${selectedRole}%`);
      }
      if (selectedGenre) {
        // Use array overlap operator for case-insensitive matching
        query = query.or(`genres.ov.{${selectedGenre.toLowerCase()}}`);
      }
      if (selectedInstrument) {
        // Use array overlap operator for case-insensitive matching
        query = query.or(`skills.ov.{${selectedInstrument.toLowerCase()}}`);
      }
      if (selectedExperience) {
        // Use ilike for case-insensitive matching
        query = query.ilike('experience', `%${selectedExperience}%`);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      // Log the search parameters
      console.log('Search parameters:', {
        role: selectedRole ? `%${selectedRole}%` : 'not set',
        genre: selectedGenre ? `{${selectedGenre.toLowerCase()}}` : 'not set',
        instrument: selectedInstrument ? `{${selectedInstrument.toLowerCase()}}` : 'not set',
        experience: selectedExperience ? `%${selectedExperience}%` : 'not set',
        location: location ? `%${location}%` : 'not set'
      });

      // Log the raw query for debugging
      console.log('Query:', query);

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Raw search results:', data);

      // Format the search results and filter out any incomplete profiles
      const formattedResults = (data as DatabaseProfile[] || [])
        .filter(profile => {
          const isValid = profile.id && 
            profile.name && 
            profile.username && 
            profile.role;
          
          if (!isValid) {
            console.log('Filtered out incomplete profile:', profile);
          }
          return isValid;
        })
        .map(profile => ({
          ...profile,
          genres: profile.genres || [],
          location: profile.location || 'Unknown',
          experience: profile.experience || 'Beginner',
          skills: profile.skills || [],
          visibility: profile.visibility || 'public'
        }));

      setSearchResults(formattedResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = () => {
    setHasSearched(false);
    setSearchResults([]);
  };

  const filteredSuggestedProjects = filterSuggestedProjects(suggestedProjects, profile);

  if (collaboratorsLoading || profileLoading || suggestedProjectsLoading) {
    return (
      <div className="p-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse</h1>
        <p className="text-gray-600 text-base mt-2">
          Find new collaborators and join music projects
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <BrowseFilters 
          selectedRole={selectedRole}
          setSelectedRole={(value) => {
            setSelectedRole(value);
            handleFilterChange();
          }}
          selectedGenre={selectedGenre}
          setSelectedGenre={(value) => {
            setSelectedGenre(value);
            handleFilterChange();
          }}
          selectedInstrument={selectedInstrument}
          setSelectedInstrument={(value) => {
            setSelectedInstrument(value);
            handleFilterChange();
          }}
          selectedExperience={selectedExperience}
          setSelectedExperience={(value) => {
            setSelectedExperience(value);
            handleFilterChange();
          }}
          location={location}
          setLocation={(value) => {
            setLocation(value);
            handleFilterChange();
          }}
          onSearch={handleSearch}
          isSearching={isSearching}
        />
        <div className="space-y-10">
          {hasSearched ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Search Results
              </h2>
              <SearchResults profiles={searchResults} />
            </div>
          ) : (
            <>
          <BulletinBoard userProfile={profile} />
          <FilteredSuggestedProjects filteredSuggestedProjects={filteredSuggestedProjects} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Suggested Collaborators
            </h2>
                <SearchResults profiles={collaboratorsFormatted} />
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;

