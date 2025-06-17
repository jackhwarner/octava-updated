import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin } from 'lucide-react';
import UserAvatar from "../UserAvatar";
import { useState } from 'react';
import { CollaboratorProfileDialog } from '../dashboard/CollaboratorProfileDialog';
import type { Profile } from '../../hooks/useProfile';

type Collaborator = {
  id: string;
  name: string;
  username?: string;
  role?: string;
  genres?: string[];
  location?: string;
  experience?: string;
  avatar_url?: string;
  skills?: string[];
  email?: string;
  bio?: string;
  full_name?: string;
  visibility?: string;
  instruments?: string[];
  zip_code?: string;
  hourly_rate?: number;
};

interface SearchResultsProps {
  profiles: Profile[];
}

const SearchResults = ({ profiles }: SearchResultsProps) => {
  const [viewedProfile, setViewedProfile] = useState<Collaborator | null>(null);

  const mapProfileToCollaborator = (profile: Profile): Collaborator => ({
    id: profile.id,
    name: profile.name || 'User',
    username: profile.username || undefined,
    role: profile.role || undefined,
    genres: profile.genres || undefined,
    location: profile.location || undefined,
    experience: profile.experience || undefined,
    avatar_url: profile.avatar_url || undefined,
    skills: profile.skills || undefined,
    email: profile.email || undefined,
    bio: profile.bio || undefined,
    full_name: profile.full_name || undefined,
    visibility: profile.visibility || undefined,
    instruments: profile.instruments || undefined,
    zip_code: profile.zip_code || undefined,
    hourly_rate: profile.hourly_rate || undefined
  });

  return (
    <>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {profiles.map(profile => (
          <Card 
            key={`${profile.id}-${profile.username}`} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setViewedProfile(mapProfileToCollaborator(profile))}
          >
          <CardHeader className="text-center p-3">
            <div className="w-14 h-14 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name || 'User'}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-medium text-gray-700">
                  {profile.name ? profile.name.charAt(0) : 'U'}
                </span>
              )}
            </div>
            <CardTitle className="text-base">{profile.name || 'User'}</CardTitle>
            <p className="text-xs text-gray-500">{profile.username || '@user'}</p>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="text-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {profile.role || 'Musician'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.genres?.map(genre => (
                <Badge key={`${profile.id}-${genre}`} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {profile.location || 'Location not set'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
      <CollaboratorProfileDialog
        open={!!viewedProfile}
        onOpenChange={open => setViewedProfile(open ? viewedProfile : null)}
        collaborator={viewedProfile}
      />
    </>
  );
};

export default SearchResults;
