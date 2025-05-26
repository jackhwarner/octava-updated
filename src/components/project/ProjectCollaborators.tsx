
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Crown, Mail, Phone, MapPin, Calendar, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectCollaboratorsProps {
  project: any;
}

const ProjectCollaborators = ({ project }: ProjectCollaboratorsProps) => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Collaborator');
  const [isInviting, setIsInviting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  const roleOptions = [
    'Collaborator',
    'Producer',
    'Vocalist',
    'Instrumentalist',
    'Songwriter',
    'Engineer',
    'Mixing Engineer',
    'Mastering Engineer',
    'Session Musician',
    'Creative Director'
  ];

  useEffect(() => {
    fetchCollaborators();
    getCurrentUser();
  }, [project.id]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchCollaborators = async () => {
    try {
      // Get project collaborators
      const { data: collabData, error: collabError } = await supabase
        .from('project_collaborators')
        .select(`
          *,
          profiles (
            id,
            name,
            username,
            email,
            avatar_url,
            bio,
            location,
            role
          )
        `)
        .eq('project_id', project.id)
        .eq('status', 'accepted');

      if (collabError) throw collabError;

      // Get project owner info
      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', project.owner_id)
        .single();

      if (ownerError) throw ownerError;

      // Combine owner and collaborators
      const allMembers = [
        {
          id: 'owner',
          profiles: ownerData,
          role_name: 'Project Owner',
          status: 'accepted',
          is_owner: true
        },
        ...(collabData || []).map(collab => ({
          ...collab,
          is_owner: false
        }))
      ];

      setCollaborators(allMembers);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      // Find user by email
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (userError || !userProfile) {
        toast({
          title: "User not found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Check if already invited
      const { data: existingInvite } = await supabase
        .from('project_collaborators')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', userProfile.id)
        .single();

      if (existingInvite) {
        toast({
          title: "Already invited",
          description: "This user is already part of the project",
          variant: "destructive",
        });
        return;
      }

      // Create collaboration invite
      const { error: inviteError } = await supabase
        .from('project_collaborators')
        .insert([{
          project_id: project.id,
          user_id: userProfile.id,
          role_name: inviteRole,
          status: 'pending'
        }]);

      if (inviteError) throw inviteError;

      // Create notification
      await supabase
        .from('notifications')
        .insert([{
          user_id: userProfile.id,
          title: 'Project Collaboration Invite',
          message: `You've been invited to collaborate on "${project.title}" as a ${inviteRole}.`,
          type: 'project_invite',
          payload: { project_id: project.id }
        }]);

      toast({
        title: "Invitation sent",
        description: "The user has been invited to join the project",
      });

      setInviteEmail('');
      setInviteRole('Collaborator');
      setIsInviteDialogOpen(false);
      fetchCollaborators();
    } catch (error) {
      console.error('Error inviting collaborator:', error);
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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeColor = (role: string, isOwner: boolean) => {
    if (isOwner) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (role?.toLowerCase().includes('producer')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (role?.toLowerCase().includes('engineer')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (role?.toLowerCase().includes('vocalist')) return 'bg-pink-100 text-pink-800 border-pink-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const isOwner = currentUser?.id === project.owner_id;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Members ({collaborators.length})</span>
          </CardTitle>
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
                  <DialogTitle>Invite Collaborator</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter collaborator's email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleInviteCollaborator}
                      disabled={isInviting || !inviteEmail.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isInviting ? 'Sending...' : 'Send Invite'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {collaborator.profiles.avatar_url ? (
                      <img
                        src={collaborator.profiles.avatar_url}
                        alt={collaborator.profiles.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-700">
                          {getInitials(collaborator.profiles.name || 'Unknown')}
                        </span>
                      </div>
                    )}
                    {collaborator.is_owner && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {collaborator.profiles.name || 'Unknown User'}
                      </h4>
                      {collaborator.is_owner && (
                        <span className="text-sm text-gray-500">(You)</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getRoleBadgeColor(collaborator.role_name, collaborator.is_owner)}
                      >
                        {collaborator.role_name}
                      </Badge>
                      {collaborator.profiles.role && collaborator.profiles.role !== collaborator.role_name && (
                        <Badge variant="outline" className="text-gray-600">
                          {collaborator.profiles.role}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {collaborator.profiles.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{collaborator.profiles.email}</span>
                        </div>
                      )}
                      {collaborator.profiles.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{collaborator.profiles.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {collaborator.profiles.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {collaborator.profiles.bio}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {collaborator.joined_at && (
                    <div className="text-right text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {new Date(collaborator.joined_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                  
                  {isOwner && !collaborator.is_owner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{collaborators.length}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {collaborators.filter(c => c.role_name?.toLowerCase().includes('producer')).length}
              </p>
              <p className="text-sm text-gray-600">Producers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {collaborators.filter(c => c.role_name?.toLowerCase().includes('engineer')).length}
              </p>
              <p className="text-sm text-gray-600">Engineers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {collaborators.filter(c => c.role_name?.toLowerCase().includes('vocalist')).length}
              </p>
              <p className="text-sm text-gray-600">Vocalists</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCollaborators;
