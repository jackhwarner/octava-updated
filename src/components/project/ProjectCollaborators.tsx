import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Crown, User, Mail, CheckCircle, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProjectLookingFor from './ProjectLookingFor';

interface ProjectCollaboratorsProps {
  project: any;
}

const ProjectCollaborators = ({ project }: ProjectCollaboratorsProps) => {
  const [collaborators, setCollaborators] = useState(project.collaborators || []);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteRole, setInviteRole] = useState('Collaborator');
  const [isInviting, setIsInviting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'username'>('email');
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchCollaborators();
  }, [project.id]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select(`
          *,
          profiles (
            name,
            username,
            avatar_url
          )
        `)
        .eq('project_id', project.id);

      if (error) throw error;
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  const handleInvite = async () => {
    try {
      setIsInviting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      console.log('Current user:', user.id);

      if (inviteMethod === 'email') {
        // Send email invitation
        const { error: emailError } = await supabase
          .from('project_collaborators')
          .insert({
            project_id: project.id,
            user_id: user.id,
            role_name: inviteRole,
            status: 'pending',
            invited_at: new Date().toISOString()
          });

        if (emailError) throw emailError;

        // Send email notification (implement your email service here)
        // For now, we'll just show a toast
        toast({
          title: "Invitation Sent",
          description: `An invitation has been sent to ${inviteEmail}`,
        });
      } else {
        console.log('Searching for user with username:', inviteUsername);
        // Find user by username
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', inviteUsername)
          .maybeSingle();

        if (userError) {
          console.error('Error finding user:', userError);
          throw userError;
        }
        if (!userData) {
          console.log('No user found with username:', inviteUsername);
          toast({
            title: "User Not Found",
            description: "No user found with that username",
            variant: "destructive",
          });
          return;
        }
        console.log('Found user:', userData.id);

        // Check if they're connected
        console.log('Checking connection between users:', user.id, 'and', userData.id);
        const { data: connectionData, error: connectionError } = await supabase
          .from('connection_requests')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userData.id}),and(sender_id.eq.${userData.id},receiver_id.eq.${user.id})`)
          .eq('status', 'accepted')
          .limit(1);

        if (connectionError) {
          console.error('Error checking connection:', connectionError);
          throw connectionError;
        }
        console.log('Connection data:', connectionData);

        if (!connectionData || connectionData.length === 0) {
          console.log('No accepted connection found between users');
          toast({
            title: "Cannot Invite",
            description: "You can only invite connections by username",
            variant: "destructive",
          });
          return;
        }

        // Create project collaboration
        console.log('Creating project collaboration for project:', project.id);
        const { error: collabError } = await supabase
          .from('project_collaborators')
          .insert({
            project_id: project.id,
            user_id: userData.id,
            role_name: inviteRole,
            status: 'pending',
            invited_at: new Date().toISOString()
          });

        if (collabError) {
          console.error('Error creating collaboration:', collabError);
          throw collabError;
        }

        // Create notification
        console.log('Creating notification for user:', userData.id);
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: userData.id,
            title: 'Project Invitation',
            message: `You've been invited to collaborate on "${project.title}"`,
            type: 'project_invite',
            payload: { project_id: project.id },
            created_at: new Date().toISOString(),
            is_read: false
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
          throw notificationError;
        }

        console.log('Invitation process completed successfully');
        toast({
          title: "Invitation Sent",
          description: `Project invitation sent to @${inviteUsername}`,
        });
      }

      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteUsername('');
      fetchCollaborators();
    } catch (error) {
      console.error('Error in handleInvite:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed from the project",
      });
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'declined':
        return <Badge variant="outline" className="text-red-600 border-red-600">Declined</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isOwner = currentUser?.id === project.owner_id;

  const searchUsers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url')
        .ilike('username', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Looking For Section */}
      <ProjectLookingFor projectId={project.id} />

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members ({collaborators.length + 1})</CardTitle>
          {isOwner && (
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={inviteMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setInviteMethod('email')}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant={inviteMethod === 'username' ? 'default' : 'outline'}
                      onClick={() => setInviteMethod('username')}
                      className="flex-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Username
                    </Button>
                  </div>

                  {inviteMethod === 'email' ? (
                  <div>
                      <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter email address"
                    />
                  </div>
                  ) : (
                    <div className="relative">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={inviteUsername}
                        onChange={(e) => {
                          setInviteUsername(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        placeholder="Search by username"
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                              onClick={() => {
                                setInviteUsername(user.username);
                                setSearchResults([]);
                              }}
                            >
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.name}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    {user.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">@{user.username}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        You can only invite connections by username
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Collaborator">Collaborator</SelectItem>
                        <SelectItem value="Producer">Producer</SelectItem>
                        <SelectItem value="Vocalist">Vocalist</SelectItem>
                        <SelectItem value="Guitarist">Guitarist</SelectItem>
                        <SelectItem value="Bassist">Bassist</SelectItem>
                        <SelectItem value="Drummer">Drummer</SelectItem>
                        <SelectItem value="Keyboardist">Keyboardist</SelectItem>
                        <SelectItem value="Songwriter">Songwriter</SelectItem>
                        <SelectItem value="Engineer">Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleInvite}
                      disabled={isInviting || (inviteMethod === 'email' ? !inviteEmail : !inviteUsername)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isInviting ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project Owner */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-700">
                    {getInitials('Project Owner')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">You</p>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Project Owner</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Owner</Badge>
            </div>

            {/* Collaborators */}
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {collaborator.profiles?.avatar_url ? (
                      <img 
                        src={collaborator.profiles.avatar_url} 
                        alt={collaborator.profiles.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">
                        {getInitials(collaborator.profiles?.name || 'U')}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {collaborator.profiles?.name || 'Unknown User'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{collaborator.role_name}</span>
                      {getStatusIcon(collaborator.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(collaborator.status)}
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {collaborators.length === 0 && (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No collaborators yet</p>
                {isOwner && (
                  <p className="text-sm text-gray-400">Invite team members to start collaborating</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCollaborators;
