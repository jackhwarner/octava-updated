import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Edit, Play, Pause, ExternalLink, Plus, Calendar, X, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfile } from '@/hooks/useProfile';
import { useAvailability } from '@/hooks/useAvailability';
import { useProjects } from '@/hooks/useProjects';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { availabilities } = useAvailability();
  const { projects } = useProjects();
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editGenres, setEditGenres] = useState<string[]>([]);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [detectedCity, setDetectedCity] = useState('');
  const [cityName, setCityName] = useState('');

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || profile.full_name || '');
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditLocation(profile.zip_code || '');
      setEditExperience(profile.experience || 'beginner');
      setEditGenres(profile.genres || []);
      setEditSkills(profile.skills || []);
      
      // Fetch city name for display
      if (profile.zip_code && profile.zip_code.length === 5) {
        fetchCityName(profile.zip_code);
      }
    }
  }, [profile]);

  const fetchCityName = async (zipCode: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        const city = data.places[0]['place name'];
        const state = data.places[0]['state abbreviation'];
        setCityName(`${city}, ${state}`);
      }
    } catch (error) {
      setCityName('');
    }
  };

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5-10 years)' },
    { value: 'professional', label: 'Professional (10+ years)' },
  ];

  const commonGenres = [
    'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'Jazz', 'Classical', 
    'Country', 'Folk', 'Reggae', 'Indie', 'Alternative', 'Metal', 'Punk',
    'Blues', 'Gospel', 'Latin', 'World', 'Ambient', 'Techno', 'House',
    'Drum & Bass', 'Trap', 'Lo-fi', 'Experimental'
  ];

  const commonSkills = [
    'Piano', 'Guitar', 'Bass', 'Drums', 'Violin', 'Saxophone', 'Trumpet', 
    'Vocals', 'Synthesizer', 'Flute', 'Cello', 'Clarinet', 'Trombone',
    'Harmonica', 'Banjo', 'Mandolin', 'Ukulele', 'Accordion', 'Harp',
    'Oboe', 'Percussion', 'Electric Guitar', 'Acoustic Guitar', 'Production',
    'Mixing', 'Mastering', 'Songwriting', 'Audio Engineering'
  ];

  const tracks = [
    { id: 1, title: 'Summer Nights', duration: '3:42', plays: 1250 },
    { id: 2, title: 'Midnight Drive', duration: '4:15', plays: 892 },
    { id: 3, title: 'City Lights', duration: '3:28', plays: 2104 },
  ];

  const handlePlayPause = (trackId: number) => {
    setIsPlaying(isPlaying === trackId ? null : trackId);
  };

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 5) {
      setEditLocation(value);
      
      if (value.length === 5) {
        try {
          const response = await fetch(`https://api.zippopotam.us/us/${value}`);
          if (response.ok) {
            const data = await response.json();
            const city = data.places[0]['place name'];
            const state = data.places[0]['state abbreviation'];
            setDetectedCity(`(${city}, ${state})`);
          } else {
            setDetectedCity('');
          }
        } catch (error) {
          setDetectedCity('');
        }
      } else {
        setDetectedCity('');
      }
    }
  };

  const addGenre = (genre: string) => {
    if (genre && !editGenres.includes(genre)) {
      setEditGenres([...editGenres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    setEditGenres(editGenres.filter((g: string) => g !== genre));
  };

  const addSkill = (skill: string) => {
    if (skill && !editSkills.includes(skill)) {
      setEditSkills([...editSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setEditSkills(editSkills.filter((s: string) => s !== skill));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editName,
        full_name: editName,
        username: editUsername,
        bio: editBio,
        zip_code: editLocation,
        experience: editExperience,
        genres: editGenres,
        skills: editSkills,
      });
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalCollaborations = projects.reduce((acc, p) => acc + (p.collaborators?.length || 0), 0);

  return (
    <TooltipProvider>
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-28 h-28 bg-gray-300 rounded-full flex-shrink-0"></div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        {profile?.name || profile?.full_name || 'Your Name'}
                      </h1>
                      <p className="text-lg text-gray-600 mt-2">
                        {profile?.username ? `@${profile.username}` : '@username'}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-700 px-3 py-1.5 text-sm">
                        {profile?.role || 'Musician'}
                      </Badge>
                      {profile?.genres?.slice(0, 3).map((genre) => (
                        <Badge key={genre} variant="outline" className="px-3 py-1.5 text-sm">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="inline-flex items-center text-gray-900 px-5 py-2 border border-gray-300 rounded ml-auto mt-3 md:mt-0">
                      <MapPin className="w-4 h-4 mr-2 text-gray-900" />
                      {cityName || profile?.location || 'Add Location'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card className="mb-8">
            <CardContent className="py-6 px-8">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{totalCollaborations}</div>
                  <div className="text-sm text-gray-500">Collaborations</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">45K</div>
                  <div className="text-sm text-gray-500">Plays</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">892</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{activeProjects}</div>
                  <div className="text-sm text-gray-500">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-gray-600">
                      {profile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Experience Level</h3>
                      <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-xs">
                        {experienceLevels.find(level => level.value === profile?.experience)?.label || 'Not specified'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile?.skills?.length ? profile.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="px-4 py-2 text-xs">
                            {skill}
                          </Badge>
                        )) : (
                          <p className="text-gray-500 text-sm">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <CalendarComponent 
                    mode="multiple"
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="music" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Tracks</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {tracks.map((track) => (
                      <div key={track.id} className="flex items-center justify-between p-5 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayPause(track.id)}
                            className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200"
                          >
                            {isPlaying === track.id ? (
                              <Pause className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Play className="w-4 h-4 text-purple-600" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-medium">{track.title}</h4>
                            <p className="text-sm text-gray-500">{track.duration} • {track.plays} plays</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Public Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {projects.filter(p => p.visibility === 'public').length > 0 ? (
                    <div className="space-y-4">
                      {projects.filter(p => p.visibility === 'public').map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{project.status}</Badge>
                            {project.genre && <Badge variant="outline">{project.genre}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No public projects yet</p>
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social & Streaming Links</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No links added yet</p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                    <Button variant="secondary" size="sm" className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input id="edit-username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Textarea 
                    id="edit-bio" 
                    value={editBio} 
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location" className="flex items-center space-x-1">
                    <span>Zip Code</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your zip code won't be public and is only used to determine your general area</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="edit-location"
                      placeholder="12345"
                      value={editLocation}
                      onChange={handleZipCodeChange}
                      maxLength={5}
                      className="w-32"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    {detectedCity && (
                      <span className="text-gray-600 text-sm">{detectedCity}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={editExperience} onValueChange={setEditExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Genres</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editGenres.map((genre: string) => (
                      <Badge key={genre} variant="outline" className="px-3 py-1">
                        {genre}
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => removeGenre(genre)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {commonGenres.filter(g => !editGenres.includes(g)).map((genre) => (
                      <Button
                        key={genre}
                        variant="ghost"
                        size="sm"
                        onClick={() => addGenre(genre)}
                        className="text-xs"
                      >
                        + {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editSkills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="px-3 py-1">
                        {skill}
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {commonSkills.filter(s => !editSkills.includes(s)).map((skill) => (
                      <Button
                        key={skill}
                        variant="ghost"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        className="text-xs"
                      >
                        + {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Profile;
