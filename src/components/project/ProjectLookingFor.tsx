
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectLookingForProps {
  projectId: string;
}

interface LookingForRole {
  id: string;
  role: string;
  payout: number;
  project_id: string;
  created_at: string;
}

const ProjectLookingFor = ({ projectId }: ProjectLookingForProps) => {
  const [lookingForRoles, setLookingForRoles] = useState<LookingForRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newPayout, setNewPayout] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLookingForRoles();
  }, [projectId]);

  const fetchLookingForRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('project_looking_for')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLookingForRoles(data || []);
    } catch (error) {
      console.error('Error fetching looking for roles:', error);
      toast({
        title: "Error",
        description: "Failed to load looking for roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    setIsAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_looking_for')
        .insert([{
          project_id: projectId,
          role: newRole.trim(),
          payout: parseFloat(newPayout) || 0
        }])
        .select()
        .single();

      if (error) throw error;

      setLookingForRoles(prev => [data, ...prev]);
      setNewRole('');
      setNewPayout('');
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Role added to looking for list",
      });
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('project_looking_for')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      setLookingForRoles(prev => prev.filter(role => role.id !== roleId));
      toast({
        title: "Success",
        description: "Role removed from looking for list",
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Looking For</span>
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Role We're Looking For</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g., Vocalist, Guitarist, Producer"
                />
              </div>
              <div>
                <Label htmlFor="payout">Payout ($)</Label>
                <Input
                  id="payout"
                  type="number"
                  value={newPayout}
                  onChange={(e) => setNewPayout(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRole}
                  disabled={isAdding || !newRole.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAdding ? 'Adding...' : 'Add Role'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {lookingForRoles.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Not currently looking for any specific roles</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lookingForRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    {role.role}
                  </Badge>
                  {role.payout > 0 && (
                    <span className="text-sm text-gray-600">${role.payout}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRole(role.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectLookingFor;
