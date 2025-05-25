
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectsTabProps {
  projects: Project[];
}

export const ProjectsTab = ({ projects }: ProjectsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {projects.filter(p => p.visibility === 'public').length > 0 ? (
          <div className="space-y-4">
            {projects.filter(p => p.visibility === 'public').map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{project.status}</Badge>
                  {project.genre && <Badge variant="outline">{project.genre}</Badge>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No public projects yet</p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
