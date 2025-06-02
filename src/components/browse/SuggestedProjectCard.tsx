import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Music } from 'lucide-react';
import { SuggestedProject } from '../../hooks/useSuggestedProjects'; // Import the SuggestedProject type

interface SuggestedProjectCardProps {
  project: SuggestedProject;
}

export const SuggestedProjectCard = ({ project }: SuggestedProjectCardProps) => {
  // Function to format budget as potential payout
  const formatPayout = (budget: number | null | undefined) => {
    if (budget === null || budget === undefined) return 'N/A';
    return `$\${budget.toFixed(0)}`; // Format as dollar amount, no cents
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4 space-y-4">
        {/* Project Title and Owner */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title || 'Untitled Project'}</h3>
          <p className="text-sm text-gray-600">by {project.profiles?.name || project.profiles?.username || 'Unknown Artist'}</p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {project.description || 'No description provided.'}
        </p>

        {/* Collaborator Count, Genre, and Payout */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            <span>{project.project_collaborators.length} collaborators</span>
          </div>
          {project.genre && (
            <span>• {project.genre}</span>
          )}
          {project.budget !== null && project.budget !== undefined && ( // Only show payout if budget exists
            <span>• Payout: {formatPayout(project.budget)}</span>
          )}
        </div>

        {/* Looking For Roles */}
        {project.project_looking_for && project.project_looking_for.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Looking for:</span> {project.project_looking_for.map(role => role.role).join(', ')}
          </div>
        )}

        {/* View Project Button */}
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}; 