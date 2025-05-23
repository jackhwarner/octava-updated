
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Music, MessageSquare, Upload, Calendar, PlusCircle, Search, BookOpen, Send, BarChart, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [searchCollaborator, setSearchCollaborator] = useState('');
  const navigate = useNavigate();

  const suggestedCollaborators = [
    {
      id: 1,
      name: 'David Kim',
      role: 'Pianist',
      genres: ['Classical', 'Jazz'],
      avatar: null,
      online: true,
    },
    {
      id: 2,
      name: 'Sophia Martinez',
      role: 'Vocalist',
      genres: ['Pop', 'Soul'],
      avatar: null,
      online: true,
    },
    {
      id: 3,
      name: 'Jackson Lee',
      role: 'Producer',
      genres: ['Hip-Hop', 'R&B'],
      avatar: null,
      online: false,
    },
  ];
  
  const onlineCollaborators = suggestedCollaborators.filter(collab => collab.online);

  const handleGoToMessages = () => {
    navigate('/messages');
  };

  const handleGoToProjects = () => {
    navigate('/projects');
  };

  const handleCreateProject = () => {
    setShowNewProjectDialog(false);
    navigate('/projects');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your music network</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGoToProjects}>
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGoToMessages}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-gray-500">5 unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Next: Tomorrow, 2PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" onClick={() => navigate('/browse')}>
                <Search className="w-4 h-4 mr-2" />
                Find Collaborators
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Track
              </Button>
              <Button variant="outline" onClick={() => navigate('/availability')}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
              <Button variant="outline">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Event
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Send Proposal
              </Button>
              <Button variant="outline">
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Learning Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Collaborators */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Online Collaborators</CardTitle>
            <CardDescription>People in your network who are currently online</CardDescription>
          </CardHeader>
          <CardContent>
            {onlineCollaborators.length > 0 ? (
              <div className="space-y-4">
                {onlineCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">{collaborator.name}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">{collaborator.role}</span>
                          <span className="text-gray-300">•</span>
                          <Badge variant="outline" className="text-xs">
                            {collaborator.genres[0]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm" variant="outline">Invite</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No collaborators are currently online
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Suggested Collaborators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest music collaborations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Summer Vibes {item}</h4>
                    <p className="text-sm text-gray-500">Pop • 3 collaborators</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
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

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill out the details below to start a new music project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input 
                id="project-name" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                className="w-full" 
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-genre">Genre</Label>
              <Select value={projectGenre} onValueChange={setProjectGenre}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea 
                id="project-description" 
                value={projectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)} 
                className="w-full" 
                placeholder="Describe your project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-privacy">Privacy</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="connections-only">Connections Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-collaborators">Collaborators</Label>
              <Input 
                id="project-collaborators"
                value={searchCollaborator}
                onChange={(e) => setSearchCollaborator(e.target.value)}
                className="w-full"
                placeholder="Search for collaborators by name"
              />
              {searchCollaborator && (
                <div className="mt-1 p-2 border rounded-md">
                  <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                    David Kim - Pianist
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                    Sophia Martinez - Vocalist
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-deadline">Deadline</Label>
              <Input 
                id="project-deadline"
                type="date"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
