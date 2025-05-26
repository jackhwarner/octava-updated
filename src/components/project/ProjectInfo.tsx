
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, DollarSign, Calendar, Users, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectInfoProps {
  project: any;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const [stats, setStats] = useState({
    fileCount: 0,
    messageCount: 0,
    collaboratorCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectStats();
  }, [project.id]);

  const fetchProjectStats = async () => {
    try {
      // Fetch file count
      const { count: fileCount } = await supabase
        .from('project_files')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

      // Fetch message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

      // Fetch collaborator count
      const { count: collaboratorCount } = await supabase
        .from('project_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('status', 'accepted');

      setStats({
        fileCount: fileCount || 0,
        messageCount: messageCount || 0,
        collaboratorCount: (collaboratorCount || 0) + 1 // +1 for owner
      });
    } catch (error) {
      console.error('Error fetching project stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <Progress value={progressPercentage} className="w-full" />
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.fileCount}
                  </div>
                  <div className="text-sm text-gray-500">Files Uploaded</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.messageCount}
                  </div>
                  <div className="text-sm text-gray-500">Messages Sent</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.collaboratorCount}
                  </div>
                  <div className="text-sm text-gray-500">Team Members</div>
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
              
              {stats.fileCount > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Files uploaded</p>
                    <p className="text-xs text-gray-500">{stats.fileCount} files added to project</p>
                  </div>
                </div>
              )}

              {stats.messageCount > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Team collaboration</p>
                    <p className="text-xs text-gray-500">{stats.messageCount} messages exchanged</p>
                  </div>
                </div>
              )}
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
                <Badge variant="outline">{loading ? '...' : stats.fileCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Messages</span>
                <Badge variant="outline">{loading ? '...' : stats.messageCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Members</span>
                <Badge variant="outline">{loading ? '...' : stats.collaboratorCount}</Badge>
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
