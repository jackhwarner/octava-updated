import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Music, Users, DollarSign, Calendar, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface BulletinBoardProps {
  userProfile?: {
    role?: string;
    genres?: string[];
  };
}
interface ProjectOpportunity {
  id: string;
  project_id: string;
  project_title: string;
  project_genre: string;
  role: string;
  payout: number;
  deadline?: string;
  description?: string;
  created_at: string;
  project_owner: {
    name: string;
    username: string;
  };
}
const BulletinBoard = ({
  userProfile
}: BulletinBoardProps) => {
  const [opportunities, setOpportunities] = useState<ProjectOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ProjectOpportunity | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchOpportunities();
  }, []);
  const fetchOpportunities = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('project_looking_for').select(`
          id,
          role,
          payout,
          created_at,
          projects!inner (
            id,
            title,
            genre,
            deadline,
            description,
            visibility,
            status,
            profiles!projects_owner_id_fkey (
              name,
              username
            )
          )
        `).eq('projects.visibility', 'public').eq('projects.status', 'active').order('created_at', {
        ascending: false
      }).limit(20);
      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        project_id: item.projects.id,
        project_title: item.projects.title,
        project_genre: item.projects.genre,
        role: item.role,
        payout: item.payout,
        deadline: item.projects.deadline,
        description: item.projects.description,
        created_at: item.created_at,
        project_owner: item.projects.profiles
      }));

      // Filter based on user's role and genres if available
      let filteredOpportunities = transformedData;
      if (userProfile?.role || userProfile?.genres) {
        filteredOpportunities = transformedData.filter(opp => {
          const matchesRole = !userProfile.role || opp.role.toLowerCase().includes(userProfile.role.toLowerCase());
          const matchesGenre = !userProfile.genres || userProfile.genres.some(genre => opp.project_genre?.toLowerCase().includes(genre.toLowerCase()));
          return matchesRole || matchesGenre;
        });
      }
      setOpportunities(filteredOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load project opportunities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleApply = (opportunity: ProjectOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsApplicationDialogOpen(true);
  };
  const handleSubmitApplication = async () => {
    if (!selectedOpportunity || !applicationMessage.trim()) return;
    setIsApplying(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create collaboration request
      const {
        data,
        error
      } = await supabase.from('project_collaborators').insert([{
        project_id: selectedOpportunity.project_id,
        user_id: user.id,
        role_name: selectedOpportunity.role,
        status: 'pending'
      }]).select().single();
      if (error) throw error;

      // Send message to project owner
      await supabase.from('messages').insert([{
        sender_id: user.id,
        recipient_id: selectedOpportunity.project_owner.id,
        content: applicationMessage,
        project_id: selectedOpportunity.project_id
      }]);

      // Create notification
      await supabase.from('notifications').insert([{
        user_id: selectedOpportunity.project_owner.id,
        title: 'New Project Application',
        message: `Someone applied for the ${selectedOpportunity.role} role in "${selectedOpportunity.project_title}"`,
        type: 'project_application',
        payload: {
          project_id: selectedOpportunity.project_id,
          collaboration_id: data.id,
          role: selectedOpportunity.role
        }
      }]);
      setIsApplicationDialogOpen(false);
      setApplicationMessage('');
      setSelectedOpportunity(null);
      toast({
        title: "Application sent",
        description: "Your application has been sent to the project owner"
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };
  if (loading) {
    return <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded"></div>)}
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            
            <span>Project Opportunities</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            {userProfile?.role || userProfile?.genres ? "Opportunities matching your profile" : "Latest project opportunities"}
          </p>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? <div className="text-center py-8">
              <Music className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No opportunities available at the moment</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map(opportunity => <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {opportunity.project_title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {opportunity.project_owner?.name}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-600 border-purple-600">
                          {opportunity.role}
                        </Badge>
                        {opportunity.project_genre && <Badge variant="outline">
                            {opportunity.project_genre}
                          </Badge>}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${opportunity.payout}</span>
                        </div>
                        {opportunity.deadline && <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                          </div>}
                      </div>

                      {opportunity.description && <p className="text-sm text-gray-600 line-clamp-2">
                          {opportunity.description}
                        </p>}

                      <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleApply(opportunity)}>
                        <Send className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </CardContent>
      </Card>

      {/* Application Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apply for {selectedOpportunity?.role} - {selectedOpportunity?.project_title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="application-message">Application Message</Label>
              <Textarea id="application-message" value={applicationMessage} onChange={e => setApplicationMessage(e.target.value)} placeholder="Tell the project owner why you're a good fit for this role..." rows={4} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication} disabled={isApplying || !applicationMessage.trim()} className="bg-purple-600 hover:bg-purple-700">
                {isApplying ? 'Sending...' : 'Send Application'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default BulletinBoard;