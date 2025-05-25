
import { Card, CardContent } from '@/components/ui/card';

interface ProfileStatsProps {
  totalCollaborations: number;
  activeProjects: number;
}

export const ProfileStats = ({ totalCollaborations, activeProjects }: ProfileStatsProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="py-6 px-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">{totalCollaborations}</div>
            <div className="text-sm text-gray-500">Collaborations</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">45K</div>
            <div className="text-sm text-gray-500">Plays</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">892</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{activeProjects}</div>
            <div className="text-sm text-gray-500">Active Projects</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
