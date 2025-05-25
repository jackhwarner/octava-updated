
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface ProjectInfoProps {
  project: any;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Project created</p>
                  <p className="text-xs text-gray-500">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Project last updated</p>
                  <p className="text-xs text-gray-500">{new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Files uploaded</p>
                  <p className="text-xs text-gray-500">3 files added to project</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Target className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Genre</p>
                <p className="text-sm text-gray-600">{project.genre || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Target className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Visibility</p>
                <p className="text-sm text-gray-600 capitalize">{project.visibility}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Collaborators</span>
                <span className="text-sm text-gray-600">
                  {project.collaborators?.length || 0}
                </span>
              </div>
              
              {project.collaborators && project.collaborators.length > 0 && (
                <div className="space-y-2">
                  {project.collaborators.slice(0, 3).map((collaborator, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-purple-700">
                          {getInitials(collaborator.name)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{collaborator.name}</span>
                    </div>
                  ))}
                  
                  {project.collaborators.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{project.collaborators.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Files</span>
                <Badge variant="outline">4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Messages</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={
                  project.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'on_hold' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }>
                  {project.status === 'active' ? 'In Progress' :
                   project.status === 'on_hold' ? 'On Hold' :
                   project.status === 'completed' ? 'Complete' :
                   'Cancelled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectInfo;
