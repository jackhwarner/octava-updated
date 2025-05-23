
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Music } from 'lucide-react';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Musicians</h1>
        <p className="text-gray-600">Find your next collaborator</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
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

            <Button className="bg-purple-600 hover:bg-purple-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              <p className="text-sm text-gray-500">{profile.username}</p>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="flex items-center justify-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">{profile.experience}</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  View Profile
                </Button>
                <Button variant="outline" className="flex-1">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Browse;
