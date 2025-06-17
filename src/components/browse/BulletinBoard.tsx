import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulletinBoardProps {
  userProfile: any;
}

const BulletinBoard = ({ userProfile }: BulletinBoardProps) => {
  const { projects, loading } = useProjects();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    portfolio: '',
    expectedPayout: ''
  });
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  // Filter projects to show only ones that:
  // 1. Are not owned by the current user
  // 2. Are public or connections_only
  // 3. Have looking_for roles that match user's role/genres
  const relevantProjects = projects.filter(project => {
    // Don't show user's own projects
    if (project.owner_id === profile?.id) return false;
    
    // Only show public or connections_only projects
    if (project.visibility === 'private') return false;
    
    // Show if project matches user's role or genres (simplified check)
    if (userProfile?.role || userProfile?.genres) {
      return true; // For now, show all non-private projects that aren't user's own
    }
    
    return true;
  });

  const handleApplyToProject = async () => {
    if (!selectedProject || !profile) return;

    try {
      // Create application in project_collaborators table
      const { error } = await supabase
        .from('project_collaborators')
        .insert([{
          project_id: selectedProject.id,
          user_id: profile.id,
          status: 'pending',
          role: userProfile?.role || 'Collaborator'
        }]);

      if (error) throw error;

      // Create notification for project owner
      await supabase
        .from('notifications')
        .insert([{
          user_id: selectedProject.owner_id,
          title: 'New Project Application',
          message: `${profile.name || 'A user'} applied to join your project "${selectedProject.title}"`,
          type: 'project_application',
          payload: { project_id: selectedProject.id, applicant_id: profile.id }
        }]);

      toast({
        title: "Application sent",
        description: "Your application has been sent to the project owner.",
      });

      setIsApplicationDialogOpen(false);
      setApplicationData({ coverLetter: '', portfolio: '', expectedPayout: '' });
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        title: "Error",
        description: "Failed to send application",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Project Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5">
        Project Opportunities
      </h2>
      
      {relevantProjects.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No relevant opportunities found</p>
          <p className="text-sm text-gray-400">Check back later for new projects</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relevantProjects.map(project => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      {project.genre || 'No Genre'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {project.budget && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Budget: ${project.budget}</span>
                      </div>
                    )}
                    
                    {project.deadline && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => setSelectedProject(project)}
                      >
                        Apply to Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to {selectedProject?.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cover-letter">Cover Letter</Label>
                          <Textarea
                            id="cover-letter"
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                            placeholder="Tell them why you're interested in this project..."
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="portfolio">Portfolio Link (optional)</Label>
                          <Input
                            id="portfolio"
                            value={applicationData.portfolio}
                            onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                            placeholder="Link to your work..."
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="expected-payout">Expected Payout (optional)</Label>
                          <Input
                            id="expected-payout"
                            value={applicationData.expectedPayout}
                            onChange={(e) => setApplicationData(prev => ({ ...prev, expectedPayout: e.target.value }))}
                            placeholder="$0"
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleApplyToProject} className="bg-purple-600 hover:bg-purple-700">
                            Send Application
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
