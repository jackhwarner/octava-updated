
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Music } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Browse = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

  const spotlightProjects = [
    {
      id: 1,
      title: "Summer Anthem",
      creator: "Alex Rodriguez",
      genre: "Pop",
      collaborators: 4,
      description: "Upbeat summer track with catchy hooks and tropical vibes",
      image: null
    },
    {
      id: 2,
      title: "Midnight Blues",
      creator: "Jazz Quartet",
      genre: "Jazz",
      collaborators: 5,
      description: "Smooth jazz composition with piano solos and brass sections",
      image: null
    },
    {
      id: 3,
      title: "Electronic Dreams",
      creator: "Sarah Beats",
      genre: "Electronic",
      collaborators: 2,
      description: "Ambient electronic track with layered synths and minimal vocals",
      image: null
    }
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
      avatar: null,
    },
  ];

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Musicians</h1>
        <p className="text-gray-600">Find your next collaborator</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="musicians">Musicians</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                <SelectItem value="photographer">Photographer</SelectItem>
                <SelectItem value="videographer">Videographer</SelectItem>
              </SelectContent>
            </Select>

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

          <div className="flex justify-end">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched ? (
        /* Search Results */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center p-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <CardTitle className="text-base">{profile.name}</CardTitle>
                <p className="text-xs text-gray-500">{profile.username}</p>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
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
        /* Spotlight Projects and Suggested Collaborators when not searching */
        <div className="space-y-12">
          {/* Spotlight Projects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-600" />
              Spotlight Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-36 bg-purple-100 relative">
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-purple-600">{project.genre}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>by {project.creator}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Music className="w-4 h-4 mr-1" />
                      {project.collaborators} collaborators
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Suggested Collaborators */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Collaborators</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {suggestedCollaborators.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center p-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                    <p className="text-xs text-gray-500">{profile.username}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
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
                      Connect
                    </Button>
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
