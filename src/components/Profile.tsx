
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Music, Calendar, Settings, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  instruments: string;
  experience: string;
  role: string;
}

const genres = [
  'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Country', 'Jazz', 'Classical', 'R&B', 'Folk', 'Indie'
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
];

const roles = [
  { value: 'musician', label: 'Musician' },
  { value: 'producer', label: 'Producer' },
  { value: 'songwriter', label: 'Songwriter' },
  { value: 'engineer', label: 'Engineer' }
];

const Profile = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [zipCode, setZipCode] = useState('90210');
  const [city, setCity] = useState('Beverly Hills');
  const [state, setState] = useState('CA');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Pop', 'Rock']);
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Thompson',
    bio: 'Passionate musician and producer with 5+ years of experience in electronic and indie rock music.',
    instruments: 'Guitar, Piano, Vocals',
    experience: 'intermediate',
    role: 'producer'
  });

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZipCode = e.target.value;
    setZipCode(newZipCode);

    // Basic zip code validation
    if (newZipCode.length === 5 && /^\d+$/.test(newZipCode)) {
      // In a real application, you would call an API to get city and state
      // For this example, we'll just set some default values
      setCity('Beverly Hills');
      setState('CA');
    } else {
      setCity('');
      setState('');
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500">View and manage your profile information</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Details about your music profile</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input type="text" value={formData.firstName} readOnly />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input type="text" value={formData.lastName} readOnly />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={formData.bio} readOnly className="resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Instruments</Label>
              <Input type="text" value={formData.instruments} readOnly />
            </div>
            <div>
              <Label>Experience</Label>
              <Input type="text" value={formData.experience} readOnly />
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" value={formData.role} readOnly />
          </div>
          <div>
            <Label>Location</Label>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>{city}, {state} {zipCode}</span>
            </div>
          </div>
          <div>
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map(genre => (
                <Badge key={genre} variant="secondary">{genre}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instruments">Instruments</Label>
                <Input
                  type="text"
                  id="instruments"
                  name="instruments"
                  value={formData.instruments}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Select 
                  value={formData.experience}
                  onValueChange={(value) => handleSelectChange('experience', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input type="text" id="city" value={city} readOnly />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input type="text" id="state" value={state} readOnly />
              </div>
            </div>

            <div>
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Button
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    onClick={() => handleGenreSelect(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowEditDialog(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
