
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
  const [inviteRole, setInviteRole] = useState('Collaborator');
  const [isInviting, setIsInviting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

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

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      // First, find the user by email
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, username')
        .eq('email', inviteEmail.trim())
        .single();

      if (profileError || !userProfile) {
        toast({
          title: "User not found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Check if already a collaborator
      const existingCollaborator = collaborators.find(c => c.user_id === userProfile.id);
      if (existingCollaborator) {
        toast({
          title: "Already a collaborator",
          description: "This user is already part of the project",
          variant: "destructive",
        });
        return;
      }

      // Create collaboration invitation
      const { data, error } = await supabase
        .from('project_collaborators')
        .insert([{
          project_id: project.id,
          user_id: userProfile.id,
          role_name: inviteRole,
          status: 'pending'
        }])
        .select(`
          *,
          profiles (
            name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert([{
          user_id: userProfile.id,
          title: 'Project Collaboration Invitation',
          message: `You've been invited to collaborate on "${project.title}"`,
          type: 'collaboration_invite',
          payload: { project_id: project.id, collaboration_id: data.id }
        }]);

      setCollaborators(prev => [...prev, data]);
      setInviteEmail('');
      setInviteRole('Collaborator');
      setIsInviteDialogOpen(false);
      
      toast({
        title: "Invitation sent",
        description: `Collaboration invitation sent to ${userProfile.name}`,
      });
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to send collaboration invitation",
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
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="collaborator@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
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
                      onClick={handleInviteCollaborator}
                      disabled={isInviting || !inviteEmail.trim()}
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
