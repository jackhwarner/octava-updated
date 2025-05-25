
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  username: string;
  role: string;
  genres: string[];
  location: string;
  experience: string;
  avatar: null;
}

interface SearchResultsProps {
  profiles: Profile[];
}

const SearchResults = ({ profiles }: SearchResultsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {profiles.map(profile => (
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
              {profile.genres.map(genre => (
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
  );
};

export default SearchResults;
