
import { useState } from 'react';
import BrowseFilters from './browse/BrowseFilters';
import SearchResults from './browse/SearchResults';
import SpotlightProjects from './browse/SpotlightProjects';
import SuggestedCollaborators from './browse/SuggestedCollaborators';

const Browse = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const profiles = [{
    id: 1,
    name: 'Sarah Johnson',
    username: '@sarah_beats',
    role: 'Producer',
    genres: ['Pop', 'R&B'],
    location: 'Los Angeles, CA',
    experience: 'Professional',
    avatar: null
  }, {
    id: 2,
    name: 'Marcus Williams',
    username: '@marcus_guitar',
    role: 'Instrumentalist',
    genres: ['Rock', 'Blues'],
    location: 'Nashville, TN',
    experience: 'Professional',
    avatar: null
  }, {
    id: 3,
    name: 'Emma Chen',
    username: '@emma_writes',
    role: 'Songwriter',
    genres: ['Indie', 'Folk'],
    location: 'Austin, TX',
    experience: 'Intermediate',
    avatar: null
  }];

  const suggestedCollaborators = [{
    id: 4,
    name: 'David Kim',
    username: '@david_keys',
    role: 'Pianist',
    genres: ['Classical', 'Jazz'],
    location: 'New York, NY',
    experience: 'Professional',
    completedProjects: 23,
    avatar: null
  }, {
    id: 5,
    name: 'Sophia Martinez',
    username: '@sophia_voice',
    role: 'Vocalist',
    genres: ['Pop', 'Soul'],
    location: 'Miami, FL',
    experience: 'Professional',
    completedProjects: 31,
    avatar: null
  }, {
    id: 6,
    name: 'Jackson Lee',
    username: '@j_producer',
    role: 'Producer',
    genres: ['Hip-Hop', 'R&B'],
    location: 'Chicago, IL',
    experience: 'Intermediate',
    completedProjects: 15,
    avatar: null
  }, {
    id: 7,
    name: 'Maya Patel',
    username: '@maya_violin',
    role: 'Violinist',
    genres: ['Classical', 'World'],
    location: 'San Francisco, CA',
    experience: 'Professional',
    completedProjects: 27,
    avatar: null
  }, {
    id: 8,
    name: 'Alex Thompson',
    username: '@alex_drums',
    role: 'Drummer',
    genres: ['Rock', 'Jazz'],
    location: 'Portland, OR',
    experience: 'Intermediate',
    completedProjects: 19,
    avatar: null
  }, {
    id: 9,
    name: 'Zoe Wang',
    username: '@zoe_synth',
    role: 'Producer',
    genres: ['Electronic', 'Ambient'],
    location: 'Seattle, WA',
    experience: 'Professional',
    completedProjects: 42,
    avatar: null
  }];

  const spotlightProjects = [{
    id: 1,
    title: 'Indie Pop Album',
    genre: 'Indie Pop',
    lookingFor: ['Vocalist', 'Guitarist'],
    collaborators: 3,
    deadline: '2 weeks',
    budget: '$500-1000'
  }, {
    id: 2,
    title: 'Electronic EP',
    genre: 'Electronic',
    lookingFor: ['Producer', 'Vocalist'],
    collaborators: 2,
    deadline: '1 month',
    budget: '$300-600'
  }, {
    id: 3,
    title: 'Jazz Fusion Track',
    genre: 'Jazz',
    lookingFor: ['Saxophonist', 'Bassist'],
    collaborators: 4,
    deadline: '3 weeks',
    budget: '$200-400'
  }];

  const handleSearch = () => {
    setHasSearched(true);
  };

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
          <SuggestedCollaborators collaborators={suggestedCollaborators} />
        </div>
      )}
    </div>
  );
};

export default Browse;
