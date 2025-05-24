
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Music, Search, Users, Clock, Star } from 'lucide-react';

const Browse = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const profiles = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah_beats',
      role: 'Producer',
      genres: ['Pop', 'R&B'],
      location: 'Los Angeles, CA',
      experience: 'Professional',
      avatar: null,
    },
    {
      id: 2,
      name: 'Marcus Williams',
      username: '@marcus_guitar',
      role: 'Instrumentalist',
      genres: ['Rock', 'Blues'],
      location: 'Nashville, TN',
      experience: 'Professional',
      avatar: null,
    },
    {
      id: 3,
      name: 'Emma Chen',
      username: '@emma_writes',
      role: 'Songwriter',
      genres: ['Indie', 'Folk'],
      location: 'Austin, TX',
      experience: 'Intermediate',
      avatar: null,
    },
  ];

  const suggestedCollaborators = [
    {
      id: 4,
      name: 'David Kim',
      username: '@david_keys',
      role: 'Pianist',
      genres: ['Classical', 'Jazz'],
      location: 'New York, NY',
      experience: 'Professional',
      completedProjects: 23,
      avatar: null,
    },
    {
      id: 5,
      name: 'Sophia Martinez',
      username: '@sophia_voice',
      role: 'Vocalist',
      genres: ['Pop', 'Soul'],
      location: 'Miami, FL',
      experience: 'Professional',
      completedProjects: 31,
      avatar: null,
    },
    {
      id: 6,
      name: 'Jackson Lee',
      username: '@j_producer',
      role: 'Producer',
      genres: ['Hip-Hop', 'R&B'],
      location: 'Chicago, IL',
      experience: 'Intermediate',
      completedProjects: 15,
      avatar: null,
    },
    {
      id: 7,
      name: 'Maya Patel',
      username: '@maya_violin',
      role: 'Violinist',
      genres: ['Classical', 'World'],
      location: 'San Francisco, CA',
      experience: 'Professional',
      completedProjects: 27,
      avatar: null,
    },
    {
      id: 8,
      name: 'Alex Thompson',
      username: '@alex_drums',
      role: 'Drummer',
      genres: ['Rock', 'Jazz'],
      location: 'Portland, OR',
      experience: 'Intermediate',
      completedProjects: 19,
      avatar: null,
    },
    {
      id: 9,
      name: 'Zoe Wang',
      username: '@zoe_synth',
      role: 'Producer',
      genres: ['Electronic', 'Ambient'],
      location: 'Seattle, WA',
      experience: 'Professional',
      completedProjects: 42,
      avatar: null,
    },
  ];

  const spotlightProjects = [
    {
      id: 1,
      title: 'Indie Pop Album',
      genre: 'Indie Pop',
      lookingFor: ['Vocalist', 'Guitarist'],
      collaborators: 3,
      deadline: '2 weeks',
      budget: '$500-1000',
    },
    {
      id: 2,
      title: 'Electronic EP',
      genre: 'Electronic',
      lookingFor: ['Producer', 'Vocalist'],
      collaborators: 2,
      deadline: '1 month',
      budget: '$300-600',
    },
    {
      id: 3,
      title: 'Jazz Fusion Track',
      genre: 'Jazz',
      lookingFor: ['Saxophonist', 'Bassist'],
      collaborators: 4,
      deadline: '3 weeks',
      budget: '$200-400',
    },
  ];

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Musicians</h1>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocalist">Vocalist</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                  <SelectItem value="songwriter">Songwriter</SelectItem>
                  <SelectItem value="composer">Composer</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger>
                  <SelectValue placeholder="Instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piano">Piano</SelectItem>
                  <SelectItem value="guitar">Guitar</SelectItem>
                  <SelectItem value="drums">Drums</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                  <SelectItem value="violin">Violin</SelectItem>
                  <SelectItem value="vocals">Vocals</SelectItem>
                  <SelectItem value="saxophone">Saxophone</SelectItem>
                  <SelectItem value="trumpet">Trumpet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available-now">Available Now</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="remote-only">Remote Only</SelectItem>
                  <SelectItem value="in-person">In-Person Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input 
                placeholder="City or Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="flex-grow"
              />
              <Button 
                className="bg-purple-600 hover:bg-purple-700 px-6 h-auto"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched ? (
        /* Search Results */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center p-3">
                <div className="w-14 h-14 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <CardTitle className="text-base">{profile.name}</CardTitle>
                <p className="text-xs text-gray-500">{profile.username}</p>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="text-center">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {profile.role}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {profile.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {profile.location}
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Spotlight Projects and Suggested Collaborators */
        <div className="space-y-10">
          {/* Spotlight Projects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Spotlight Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {project.genre}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.lookingFor.map((role) => (
                          <Badge key={role} className="text-xs bg-purple-600 hover:bg-purple-700">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.collaborators} collaborators
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.deadline}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Budget: {project.budget}
                    </div>
                    
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Apply to Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Suggested Collaborators */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Suggested Collaborators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCollaborators.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.username}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-xs">
                          {profile.role}
                        </Badge>
                        {profile.genres.map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate mr-2">{profile.location}</span>
                          <span>{profile.completedProjects} projects</span>
                        </div>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
