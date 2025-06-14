
import { useEffect, useState } from 'react';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
import BulletinBoard from './browse/BulletinBoard';
import SuggestedCollaborators from './browse/SuggestedCollaborators';
import { useCollaborators } from '../hooks/useCollaborators';
import { useProfile } from '../hooks/useProfile';
import { useSuggestedProjects } from '../hooks/useSuggestedProjects';
import { useBrowseFilters } from '../hooks/useBrowseFilters';
import { filterCollaborators, filterSuggestedProjects } from '../utils/browseFilters';
import FilteredSuggestedProjects from './browse/FilteredSuggestedProjects';

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
    setLocation,
  } = useBrowseFilters();

  const [hasSearched, setHasSearched] = useState(false);

  const { suggestedCollaborators, loading: collaboratorsLoading } = useCollaborators();
  const { profile, loading: profileLoading } = useProfile();
  const { suggestedProjects, loading: suggestedProjectsLoading } = useSuggestedProjects();

  // Format collaborators
  const collaboratorsFormatted = suggestedCollaborators.map(collaborator => ({
    id: collaborator.id,
    name: collaborator.name,
    username: collaborator.username || '@unknown',
    role: collaborator.role || 'Musician',
    genres: collaborator.genres || [],
    location: collaborator.location || 'Unknown',
    experience: collaborator.experience || 'Beginner',
    avatar_url: collaborator.avatar_url,
    completedProjects: collaborator.completed_projects || 0,
    instruments: collaborator.instruments || []
  }));

  const handleSearch = () => {
    // Only search if at least one filter is set
    const anyFilters = selectedRole || selectedGenre || selectedInstrument || selectedExperience || location;
    if (!anyFilters) {
      // Optionally use a toast to notify
      return;
    }
    setHasSearched(true);
  };

  const filteredSuggestedCollaborators = filterCollaborators(collaboratorsFormatted, {
    selectedRole,
    selectedGenre,
    selectedInstrument,
    selectedExperience,
    location
  });

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
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Musicians and Projects</h1>
      </div>
      <BrowseFilters
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
        selectedExperience={selectedExperience}
        setSelectedExperience={setSelectedExperience}
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />

      {hasSearched ? (
        <SearchResults profiles={collaboratorsFormatted} />
      ) : (
        <div className="space-y-10">
          <BulletinBoard userProfile={profile} />
          <FilteredSuggestedProjects filteredSuggestedProjects={filteredSuggestedProjects} />
          <SuggestedCollaborators collaborators={filteredSuggestedCollaborators} />
        </div>
      )}
    </div>
  );
};

export default Browse;

