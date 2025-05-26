
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

interface SuggestedCollaborator {
  id: number;
  name: string;
  username: string;
  role: string;
  genres: string[];
  location: string;
  experience: string;
  completedProjects: number;
  avatar: null;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map(profile => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    {profile.role}
                  </Badge>
                  {profile.genres.slice(0, 2).map(genre => (
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

                <p className="text-sm text-gray-600">
                  {profile.experience} level
                </p>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCollaborators;
