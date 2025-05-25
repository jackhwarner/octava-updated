
import { useState } from 'react';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
import SpotlightProjects from './browse/SpotlightProjects';
import SuggestedCollaborators from './browse/SuggestedCollaborators';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useProjects } from '@/hooks/useProjects';

const Browse = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { suggestedCollaborators, loading: collaboratorsLoading } = useCollaborators();
  const { projects, loading: projectsLoading } = useProjects();

  // Convert profiles to expected format for search results
  const profiles = suggestedCollaborators.map(collaborator => ({
    id: parseInt(collaborator.id) || 0,
    name: collaborator.name,
    username: collaborator.username || '@unknown',
    role: collaborator.role || 'Musician',
    genres: collaborator.genres || [],
    location: collaborator.location || 'Unknown',
    experience: collaborator.experience || 'Beginner',
    avatar: null
  }));

  // Convert collaborators to expected SuggestedCollaborator format
  const suggestedCollaboratorsFormatted = suggestedCollaborators.map(collaborator => ({
    id: parseInt(collaborator.id) || 0,
    name: collaborator.name,
    username: collaborator.username || '@unknown',
    role: collaborator.role || 'Musician',
    genres: collaborator.genres || [],
    location: collaborator.location || 'Unknown',
    experience: collaborator.experience || 'Beginner',
    completedProjects: collaborator.completed_projects || 0,
    avatar: null
  }));

  // Convert projects to spotlight format
  const spotlightProjects = projects
    .filter(p => p.visibility === 'public' && p.status === 'active')
    .slice(0, 3)
    .map(project => ({
      id: parseInt(project.id) || 0,
      title: project.title || project.name || 'Untitled Project',
      genre: project.genre || 'Various',
      lookingFor: ['Musician', 'Producer'], // This would need to be stored in project data
      collaborators: project.collaborators?.length || 0,
      deadline: project.deadline ? new Date(project.deadline).toLocaleDateString() : '1 month',
      budget: project.budget ? `$${project.budget}` : '$200-500'
    }));

  const handleSearch = () => {
    setHasSearched(true);
  };

  if (collaboratorsLoading || projectsLoading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Browse Musicians</h1>
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
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />

      {hasSearched ? (
        <SearchResults profiles={profiles} />
      ) : (
        <div className="space-y-10">
          <SpotlightProjects projects={spotlightProjects} />
          <SuggestedCollaborators collaborators={suggestedCollaboratorsFormatted} />
        </div>
      )}
    </div>
  );
};

export default Browse;
