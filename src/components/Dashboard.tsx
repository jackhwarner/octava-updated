
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Music, MessageCircle, Calendar, HelpCircle, Search, Settings, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const Dashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [projectDescription, setProjectDescription] = useState('');
  const [searchCollaborator, setSearchCollaborator] = useState('');
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
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
    {
      id: 4,
      name: 'Emily Wilson',
      role: 'Keyboardist',
      genres: ['Electronic', 'Dance'],
      avatar: null,
      online: true,
    },
  ];
  
  const onlineCollaborators = suggestedCollaborators.filter(collab => collab.online);

  const handleGoToMessages = () => {
    navigate('/messages');
  };

  const handleGoToProjects = () => {
    navigate('/projects');
  };

  const handleGoToAvailability = () => {
    navigate('/availability');
  };

  const handleGoToSupport = () => {
    navigate('/support');
  };

  const handleCreateProject = () => {
    setShowNewProjectDialog(false);
    navigate('/projects');
  };

  const handleAddCollaborator = (name: string) => {
    if (!selectedCollaborators.includes(name)) {
      setSelectedCollaborators([...selectedCollaborators, name]);
    }
    setSearchCollaborator('');
  };

  const handleRemoveCollaborator = (name: string) => {
    setSelectedCollaborators(selectedCollaborators.filter(c => c !== name));
  };

  const filteredCollaborators = suggestedCollaborators
    .filter(c => c.name.toLowerCase().includes(searchCollaborator.toLowerCase()))
    .map(c => c.name);

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGoToMessages}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGoToAvailability}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Online Collaborators Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" onClick={() => navigate('/browse')}>
                <Search className="w-4 h-4 mr-2" />
                Find Collaborators
              </Button>
              <Button variant="outline" onClick={handleGoToSupport}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <FileText className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/projects')}>
                <Music className="w-4 h-4 mr-2" />
                All Projects
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Collaborators</CardTitle>
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
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{collaborator.role}</span>
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
                  <Button variant="ghost" size="sm" className="p-1">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5C0 6.67157 0.671573 6 1.5 6C2.32843 6 3 6.67157 3 7.5ZM9 7.5C9 8.32843 8.32843 9 7.5 9C6.67157 9 6 8.32843 6 7.5C6 6.67157 6.67157 6 7.5 6C8.32843 6 9 6.67157 9 7.5ZM15 7.5C15 8.32843 14.3284 9 13.5 9C12.6716 9 12 8.32843 12 7.5C12 6.67157 12.6716 6 13.5 6C14.3284 6 15 6.67157 15 7.5Z" fill="currentColor"></path>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Collaborators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {suggestedCollaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">{collaborator.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{collaborator.role}</span>
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
              <Label htmlFor="project-genre">Genre (select multiple)</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select genres" />
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
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCollaborators.map((name) => (
                  <Badge key={name} variant="secondary" className="py-1 px-2 flex items-center gap-1">
                    {name}
                    <button onClick={() => handleRemoveCollaborator(name)} className="ml-1 text-xs">×</button>
                  </Badge>
                ))}
              </div>
              <Input 
                id="project-collaborators"
                value={searchCollaborator}
                onChange={(e) => setSearchCollaborator(e.target.value)}
                className="w-full"
                placeholder="Search for collaborators by name"
              />
              {searchCollaborator && filteredCollaborators.length > 0 && (
                <div className="mt-1 p-2 border rounded-md max-h-32 overflow-auto">
                  {filteredCollaborators.map((name) => (
                    <div 
                      key={name} 
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => handleAddCollaborator(name)}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-deadline">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
