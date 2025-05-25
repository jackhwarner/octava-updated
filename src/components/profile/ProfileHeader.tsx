
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, MapPin } from 'lucide-react';
import { Profile } from '@/hooks/useProfile';

interface ProfileHeaderProps {
  profile: Profile | null;
  cityName: string;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, cityName, onEditClick }: ProfileHeaderProps) => {
  return (
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
              <Button variant="outline" onClick={onEditClick}>
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
  );
};
