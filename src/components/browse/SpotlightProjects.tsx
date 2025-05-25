
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Star } from 'lucide-react';

interface SpotlightProject {
  id: number;
  title: string;
  genre: string;
  lookingFor: string[];
  collaborators: number;
  deadline: string;
  budget: string;
}

interface SpotlightProjectsProps {
  projects: SpotlightProject[];
}

const SpotlightProjects = ({ projects }: SpotlightProjectsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
        <Star className="w-6 h-6 mr-2 text-purple-600" />
        Spotlight Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {project.genre}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Looking for:</p>
                <div className="flex flex-wrap gap-2">
                  {project.lookingFor.map(role => (
                    <Badge key={role} className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {project.collaborators} collaborators
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {project.deadline}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Budget: {project.budget}
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Apply to Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpotlightProjects;
