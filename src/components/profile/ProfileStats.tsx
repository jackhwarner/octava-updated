
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileStatsProps {
  totalCollaborations: number;
  activeProjects: number;
  profile: any;
}

export const ProfileStats = ({ totalCollaborations, activeProjects, profile }: ProfileStatsProps) => {
  const [stats, setStats] = useState({
    plays: 0,
    followers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get followers count
        const { data: followersData } = await supabase
          .from('followers')
          .select('id')
          .eq('following_id', user.id);

        // Get plays count from songs
        const { data: songsData } = await supabase
          .from('songs')
          .select('id')
          .eq('user_id', user.id);

        // Simulate plays count (in a real app, you'd track this)
        const totalPlays = (songsData?.length || 0) * 1250; // Average plays per song

        setStats({
          plays: totalPlays,
          followers: followersData?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="mb-8">
      <CardContent className="py-6 px-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">{totalCollaborations}</div>
            <div className="text-sm text-gray-500">Collaborations</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{formatNumber(stats.plays)}</div>
            <div className="text-sm text-gray-500">Plays</div>
          </div>
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
