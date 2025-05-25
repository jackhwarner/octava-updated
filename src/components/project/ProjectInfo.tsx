
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, DollarSign, Calendar, Users, TrendingUp, Activity } from 'lucide-react';

interface ProjectInfoProps {
  project: any;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const progressPercentage = project.status === 'completed' ? 100 : 
                            project.status === 'active' ? 65 : 
                            project.status === 'on_hold' ? 30 : 15;

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
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-500">Files Uploaded</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-500">Messages Sent</div>
                </div>
              </div>
            </div>
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

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Sarah Johnson joined</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
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

            {project.deadline && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-gray-600">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {project.budget && (
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-gray-600">${project.budget}</p>
                </div>
              </div>
            )}
            
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Schedule Session
            </Button>
            <Button variant="outline" className="w-full">
              Export Project
            </Button>
            <Button variant="outline" className="w-full">
              Share Project
            </Button>
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
                <span className="text-sm font-medium">Sessions</span>
                <Badge variant="outline">3</Badge>
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
