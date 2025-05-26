
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Clock, Music, Zap, Settings as SettingsIcon, CheckCircle2, Circle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectInfoProps {
  project: any;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const [currentPhase, setCurrentPhase] = useState(project.current_phase_index || 0);
  const [updatingPhase, setUpdatingPhase] = useState(false);
  const { updateProject } = useProjects();
  const { toast } = useToast();

  const phases = project.phases || ['Demo', 'Production', 'Mixing', 'Mastering', 'Complete'];
  const progressPercentage = phases.length > 1 ? (currentPhase / (phases.length - 1)) * 100 : 0;

  const handlePhaseChange = async (newPhaseIndex: string) => {
    const phaseIndex = parseInt(newPhaseIndex);
    setUpdatingPhase(true);
    
    try {
      await updateProject(project.id, {
        current_phase_index: phaseIndex
      });
      
      setCurrentPhase(phaseIndex);
      toast({
        title: "Success",
        description: `Project phase updated to ${phases[phaseIndex]}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project phase",
        variant: "destructive",
      });
    } finally {
      setUpdatingPhase(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'on_hold':
        return 'On Hold';
      case 'completed':
        return 'Complete';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status and Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Progress</span>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            
            <Progress value={progressPercentage} className="mb-4" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Phase:</span>
              <Select 
                value={currentPhase.toString()} 
                onValueChange={handlePhaseChange}
                disabled={updatingPhase}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      <div className="flex items-center space-x-2">
                        {index <= currentPhase ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        <span>{phase}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Description */}
          {project.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          )}

          {/* Project Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {project.genre && (
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Genre: {project.genre}</span>
              </div>
            )}
            
            {project.bpm && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">BPM: {project.bpm}</span>
              </div>
            )}
            
            {project.key && (
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Key: {project.key}</span>
              </div>
            )}
            
            {project.daw && (
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">DAW: {project.daw}</span>
              </div>
            )}
            
            {project.mood && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mood: {project.mood}</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium">{new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            {project.deadline && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="text-sm font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Team Size</p>
                <p className="text-sm font-medium">{(project.collaborators?.length || 0) + 1}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Phases Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentPhase 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentPhase ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : index === currentPhase ? (
                    <Circle className="w-4 h-4 fill-current" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      index <= currentPhase ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {phase}
                    </span>
                    {index === currentPhase && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        Current
                      </Badge>
                    )}
                    {index < currentPhase && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-600">Files</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-sm text-gray-600">Messages</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-600">Tasks Done</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{(project.collaborators?.length || 0) + 1}</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectInfo;
