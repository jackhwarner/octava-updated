import { useState, useEffect } from 'react';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
import BulletinBoard from './browse/BulletinBoard';
import { SuggestedProjectCard } from './browse/SuggestedProjectCard';
import { useCollaborators } from '../hooks/useCollaborators';
import { useProfile } from '../hooks/useProfile';
import { useSuggestedProjects } from '../hooks/useSuggestedProjects';
import { Music } from 'lucide-react';
import SuggestedCollaborators from './browse/SuggestedCollaborators';

const Browse = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch potential collaborators and their online status
  const { suggestedCollaborators, loading: collaboratorsLoading } = useCollaborators();
  
  // Fetch current user's profile for filtering and preferences
  const { profile, loading: profileLoading } = useProfile();
  
  // Fetch suggested projects based on user's profile and preferences
  const { suggestedProjects, loading: suggestedProjectsLoading } = useSuggestedProjects();

  // Add logging for data fetching
  useEffect(() => {
    console.log('Browse component mounted');
    console.log('Profile loading:', profileLoading);
    console.log('Profile data:', profile);
    console.log('Collaborators loading:', collaboratorsLoading);
    console.log('Collaborators data:', suggestedCollaborators);
    console.log('Projects loading:', suggestedProjectsLoading);
    console.log('Projects data:', suggestedProjects);
  }, [profileLoading, profile, collaboratorsLoading, suggestedCollaborators, suggestedProjectsLoading, suggestedProjects]);

  // Convert profiles to expected format for search results
  // This ensures all required fields are present and properly formatted
  const profiles = suggestedCollaborators.map(collaborator => {
    console.log('Processing collaborator:', collaborator);
    return {
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
    };
  });

  const handleSearch = () => {
    // Only search if at least one filter is set
    const anyFilters = selectedRole || selectedGenre || selectedInstrument || selectedExperience || location;
    if (!anyFilters) {
      console.log('No filters selected. Search will not be performed.');
      // Optionally: use a toast to inform user they must set at least one filter.
      return;
    }
    console.log('Search triggered with filters:', {
      role: selectedRole,
      genre: selectedGenre,
      instrument: selectedInstrument,
      experience: selectedExperience,
      location
    });
    setHasSearched(true);
  };

  // Filter suggested collaborators based on selected criteria
  // This applies all selected filters (role, genre, instrument, experience, location)
  const filterCollaborators = (collaboratorsToFilter: typeof profiles) => {
    console.log('Filtering collaborators with criteria:', {
      role: selectedRole,
      genre: selectedGenre,
      instrument: selectedInstrument,
      experience: selectedExperience,
      location
    });
    
    return collaboratorsToFilter.filter(collaborator => {
      const roleMatch = selectedRole ? collaborator.role === selectedRole : true;
      const genreMatch = selectedGenre ? collaborator.genres.includes(selectedGenre) : true;
      const instrumentMatch = selectedInstrument ? collaborator.instruments?.includes(selectedInstrument) : true;
      const experienceMatch = selectedExperience ? collaborator.experience === selectedExperience : true;
      const locationMatch = location ? collaborator.location?.toLowerCase().includes(location.toLowerCase()) : true;

      console.log('Collaborator filter results:', {
        collaborator: collaborator.name,
        roleMatch,
        genreMatch,
        instrumentMatch,
        experienceMatch,
        locationMatch
      });

      return roleMatch && genreMatch && instrumentMatch && experienceMatch && locationMatch;
    });
  };

  // Filter suggested projects based on user's profile
  // This matches projects with user's genres and role preferences
  const filterSuggestedProjects = (projectsToFilter: typeof suggestedProjects) => {
    console.log('Filtering projects with profile:', profile);
    
    if (!profile) {
      console.log('No profile available, returning empty array');
      return [];
    }

    const userGenres = profile.genres || [];
    const userRole = profile.role;

    console.log('User preferences:', {
      genres: userGenres,
      role: userRole
    });

    return projectsToFilter.filter(project => {
      const genreMatch = project.genre ? userGenres.includes(project.genre) : true;
      const lookingForRoles = project.project_looking_for.map(item => item.role).filter(role => role !== null) as string[];
      const roleMatch = userRole ? lookingForRoles.includes(userRole) : true;

      console.log('Project filter results:', {
        project: project.title,
        genreMatch,
        roleMatch,
        lookingForRoles
      });
      
      return genreMatch && roleMatch;
    });
  };

  const suggestedCollaboratorsFormatted = suggestedCollaborators.map(collaborator => ({
    id: collaborator.id,
    name: collaborator.name,
    username: collaborator.username || '@unknown',
    role: collaborator.role || 'Musician',
    genres: collaborator.genres || [],
    location: collaborator.location || 'Unknown',
    experience: collaborator.experience || 'Beginner',
    completedProjects: collaborator.completed_projects || 0,
    avatar_url: collaborator.avatar_url,
    instruments: collaborator.instruments || []
  }));

  const filteredSuggestedCollaborators = filterCollaborators(suggestedCollaboratorsFormatted);
  const filteredSuggestedProjects = filterSuggestedProjects(suggestedProjects);

  console.log('Final filtered results:', {
    collaborators: filteredSuggestedCollaborators.length,
    projects: filteredSuggestedProjects.length
  });

  if (collaboratorsLoading || profileLoading || suggestedProjectsLoading) {
    console.log('Loading state:', {
      collaboratorsLoading,
      profileLoading,
      suggestedProjectsLoading
    });
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

      {/* Always show Suggested Collaborators below the filters */}
      {filteredSuggestedCollaborators.length > 0 && (
        <SuggestedCollaborators collaborators={filteredSuggestedCollaborators} />
      )}

      {hasSearched ? (
        <SearchResults profiles={profiles} />
      ) : (
        <div className="space-y-10">
          <BulletinBoard userProfile={profile} />
          
          {/* Suggested Projects Section */}
          {filteredSuggestedProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
                <Music className="w-6 h-6 mr-2 text-purple-600" />
                Suggested Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuggestedProjects.map(project => (
                  <SuggestedProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Browse;
