import { Card, CardContent } from '../ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';

interface ProfileStatsProps {
  totalCollaborations: number;
  activeProjects: number;
  profile: any; // Assuming profile includes total_plays and potentially followers if fetched elsewhere
}

export const ProfileStats = ({ totalCollaborations, activeProjects, profile }: ProfileStatsProps) => {
  // Restore state for followers
  const [stats, setStats] = useState({
    followers: 0
  });

  // Restore effect to fetch followers count
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get followers count
        const { data: followersData } = await supabase
          .from('followers')
          .select('id')
          .eq('following_id', user.id);

        setStats({
          followers: followersData?.length || 0
        });
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, []); // Dependency array is empty as this only needs to run once on mount

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Access actual total_plays from profile prop
  const actualTotalPlays = profile?.total_plays || 0;

  return (
    <Card className="mb-8">
      <CardContent className="py-6 px-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">{totalCollaborations}</div>
            <div className="text-sm text-gray-500">Collaborations</div>
          </div>
          <div>
            {/* Display actual total_plays */}
            <div className="text-xl font-bold text-gray-900">{formatNumber(actualTotalPlays)}</div>
            <div className="text-sm text-gray-500">Plays</div>
          </div>
          {/* Display followers count */}
          <div>
            <div className="text-xl font-bold text-gray-900">{stats.followers}</div>
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
