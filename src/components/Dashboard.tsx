
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Music, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const suggestedCollaborators = [
    {
      id: 1,
      name: 'David Kim',
      role: 'Pianist',
      genres: ['Classical', 'Jazz'],
      avatar: null,
    },
    {
      id: 2,
      name: 'Sophia Martinez',
      role: 'Vocalist',
      genres: ['Pop', 'Soul'],
      avatar: null,
    },
    {
      id: 3,
      name: 'Jackson Lee',
      role: 'Producer',
      genres: ['Hip-Hop', 'R&B'],
      avatar: null,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your music network</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Music className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-gray-500">+18 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-gray-500">5 unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Suggested Collaborators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest music collaborations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Summer Vibes {item}</h4>
                    <p className="text-sm text-gray-500">Pop • 3 collaborators</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Collaborators</CardTitle>
            <CardDescription>People you might want to collaborate with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedCollaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">{collaborator.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">{collaborator.role}</span>
                        <span className="text-gray-300">•</span>
                        <Badge variant="outline" className="text-xs">
                          {collaborator.genres[0]}
                        </Badge>
                        {collaborator.genres.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{collaborator.genres.length - 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Connect</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline">Find Collaborators</Button>
              <Button variant="outline">Upload Track</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
