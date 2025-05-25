
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, X, Info } from 'lucide-react';
import { Profile } from '@/hooks/useProfile';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export const EditProfileDialog = ({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) => {
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editGenres, setEditGenres] = useState<string[]>([]);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [detectedCity, setDetectedCity] = useState('');

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

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || profile.full_name || '');
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditLocation(profile.zip_code || '');
      setEditExperience(profile.experience || 'beginner');
      setEditGenres(profile.genres || []);
      setEditSkills(profile.skills || []);
    }
  }, [profile]);

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
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
      await onSave({
        name: editName,
        full_name: editName,
        username: editUsername,
        bio: editBio,
        zip_code: editLocation,
        experience: editExperience,
        genres: editGenres,
        skills: editSkills,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
