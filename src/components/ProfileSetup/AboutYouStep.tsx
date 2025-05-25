
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AboutYouStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const AboutYouStep = ({ data, onUpdate, onNext }: AboutYouStepProps) => {
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

  const commonInstruments = [
    'Piano', 'Guitar', 'Bass', 'Drums', 'Violin', 'Saxophone', 'Trumpet', 
    'Vocals', 'Synthesizer', 'Flute', 'Cello', 'Clarinet', 'Trombone',
    'Harmonica', 'Banjo', 'Mandolin', 'Ukulele', 'Accordion', 'Harp',
    'Oboe', 'Percussion', 'Electric Guitar', 'Acoustic Guitar'
  ];

  const addGenre = (genre: string) => {
    if (genre && !data.genres.includes(genre)) {
      onUpdate({ genres: [...data.genres, genre] });
    }
  };

  const removeGenre = (genre: string) => {
    onUpdate({ genres: data.genres.filter((g: string) => g !== genre) });
  };

  const addInstrument = (instrument: string) => {
    if (instrument && !data.instruments.includes(instrument)) {
      onUpdate({ instruments: [...data.instruments, instrument] });
    }
  };

  const removeInstrument = (instrument: string) => {
    onUpdate({ instruments: data.instruments.filter((i: string) => i !== instrument) });
  };

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 5) {
      onUpdate({ location: value });
      
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove any existing @ symbols
    value = value.replace(/@/g, '');
    // Update with the clean username
    onUpdate({ username: value });
  };

  const isFormValid = data.name && data.username && data.bio && data.location && data.experience;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
              <Input
                id="username"
                placeholder="your_username"
                value={data.username}
                onChange={handleUsernameChange}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about your musical journey, style, and what you're passionate about..."
            value={data.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center space-x-1">
              <span>Zip Code *</span>
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
                id="location"
                placeholder="12345"
                value={data.location}
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
            <Label>Experience Level *</Label>
            <Select value={data.experience} onValueChange={(value) => onUpdate({ experience: value })}>
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
        </div>

        <div className="space-y-2">
          <Label>Genres</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.genres.map((genre: string) => (
              <Badge key={genre} variant="outline" className="px-3 py-1">
                {genre}
                <X
                  className="w-3 h-3 ml-2 cursor-pointer"
                  onClick={() => removeGenre(genre)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {commonGenres.filter(g => !data.genres.includes(g)).map((genre) => (
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
          <Label>Instruments</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.instruments.map((instrument: string) => (
              <Badge key={instrument} variant="outline" className="px-3 py-1">
                {instrument}
                <X
                  className="w-3 h-3 ml-2 cursor-pointer"
                  onClick={() => removeInstrument(instrument)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {commonInstruments.filter(i => !data.instruments.includes(i)).map((instrument) => (
              <Button
                key={instrument}
                variant="ghost"
                size="sm"
                onClick={() => addInstrument(instrument)}
                className="text-xs"
              >
                + {instrument}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onNext} 
            disabled={!isFormValid}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next Step
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AboutYouStep;
