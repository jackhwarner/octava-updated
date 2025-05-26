
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, MapPin } from 'lucide-react';
import { Profile } from '@/hooks/useProfile';

interface ProfileHeaderProps {
  profile: Profile | null;
  cityName: string;
  onEditClick: () => void;
  isOwnProfile?: boolean;
}

export const ProfileHeader = ({ profile, cityName, onEditClick, isOwnProfile = true }: ProfileHeaderProps) => {
  const formatRole = (role: string | undefined) => {
    if (!role) return 'Musician';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <Avatar className="w-28 h-28 flex-shrink-0">
            <AvatarImage src={profile?.avatar_url || profile?.profile_picture_url} />
            <AvatarFallback className="bg-gray-300 text-gray-700 text-2xl">
              {getInitials(profile?.name || profile?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          
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
              {isOwnProfile && (
                <Button variant="outline" onClick={onEditClick}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-100 text-purple-700 px-3 py-1.5 text-sm">
                  {formatRole(profile?.role)}
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
