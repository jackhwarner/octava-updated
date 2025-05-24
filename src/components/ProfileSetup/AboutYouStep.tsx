
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AboutYouStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const AboutYouStep = ({ data, onUpdate, onNext }: AboutYouStepProps) => {
  const [newGenre, setNewGenre] = useState('');
  const [newInstrument, setNewInstrument] = useState('');

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5-10 years)' },
    { value: 'professional', label: 'Professional (10+ years)' },
  ];

  const commonGenres = ['Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'Jazz', 'Classical', 'Country', 'Folk', 'Reggae'];
  const commonInstruments = ['Piano', 'Guitar', 'Bass', 'Drums', 'Violin', 'Saxophone', 'Trumpet', 'Vocals', 'Synthesizer', 'Flute'];

  const addGenre = (genre: string) => {
    if (genre && !data.genres.includes(genre)) {
      onUpdate({ genres: [...data.genres, genre] });
    }
    setNewGenre('');
  };

  const removeGenre = (genre: string) => {
    onUpdate({ genres: data.genres.filter((g: string) => g !== genre) });
  };

  const addInstrument = (instrument: string) => {
    if (instrument && !data.instruments.includes(instrument)) {
      onUpdate({ instruments: [...data.instruments, instrument] });
    }
    setNewInstrument('');
  };

  const removeInstrument = (instrument: string) => {
    onUpdate({ instruments: data.instruments.filter((i: string) => i !== instrument) });
  };

  const isFormValid = data.name && data.username && data.bio && data.location && data.experience;

  return (
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
          <Input
            id="username"
            placeholder="@your_username"
            value={data.username}
            onChange={(e) => onUpdate({ username: e.target.value })}
          />
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

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          placeholder="City, State/Country"
          value={data.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
        />
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
        <div className="flex flex-wrap gap-2 mb-2">
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
        <div className="flex space-x-2">
          <Input
            placeholder="Add custom genre"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGenre(newGenre)}
          />
          <Button onClick={() => addGenre(newGenre)}>Add</Button>
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
        <div className="flex flex-wrap gap-2 mb-2">
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
        <div className="flex space-x-2">
          <Input
            placeholder="Add custom instrument"
            value={newInstrument}
            onChange={(e) => setNewInstrument(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInstrument(newInstrument)}
          />
          <Button onClick={() => addInstrument(newInstrument)}>Add</Button>
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
  );
};

export default AboutYouStep;
