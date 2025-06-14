
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Users } from 'lucide-react';
import { ConnectionButton } from '../connections/ConnectionButton';

interface SuggestedCollaborator {
  id: string;
  name: string;
  username: string;
  role: string;
  genres: string[];
  location: string;
  experience: string;
  completedProjects: number;
  avatar_url?: string | null;
  instruments?: string[];
}

interface SuggestedCollaboratorsProps {
  collaborators: SuggestedCollaborator[];
}

const SuggestedCollaborators = ({ collaborators }: SuggestedCollaboratorsProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
        <Users className="w-6 h-6 mr-2 text-purple-600" />
        Suggested Collaborators
      </h2>
      
      {collaborators.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No suggested collaborators found</p>
          <p className="text-sm text-gray-400">Check back later for new connections</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborators.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <p className="text-sm text-gray-500">@{profile.username}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {profile.role}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                    <span>{profile.completedProjects} projects</span>
                  </div>

                  <ConnectionButton 
                    userId={profile.id}
                    userName={profile.name}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedCollaborators;
