import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ProjectCollaboratorsProps {
  project: any;
}

const ProjectCollaborators = ({ project }: ProjectCollaboratorsProps) => {
  const [collaborators] = useState(project.collaborators || []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'producer':
        return 'bg-blue-100 text-blue-800';
      case 'vocalist':
        return 'bg-green-100 text-green-800';
      case 'instrumentalist':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Collaborator */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Invite by Email
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Invite from Connections
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Collaborators */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({collaborators.length + 1})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project Owner */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm text-purple-700">AR</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alex Rodriguez (You)</p>
                  <p className="text-sm text-gray-500">@alex_producer</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800">Owner</Badge>
              </div>
            </div>

            {/* Other Collaborators */}
            {collaborators.map((collaborator, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm text-purple-700">
                      {getInitials(collaborator.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-sm text-gray-500">{collaborator.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Collaborator</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Remove from Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {collaborators.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No collaborators yet</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Your First Collaborator
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No pending invitations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCollaborators;
