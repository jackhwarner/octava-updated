
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Suggested Collaborators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map(profile => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.username}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 hover:bg-purple-200 text-xs text-purple-700">
                    {profile.role}
                  </Badge>
                  {profile.genres.map(genre => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate mr-2">{profile.location}</span>
                  </div>
                  <span>{profile.completedProjects} projects</span>
                </div>

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
