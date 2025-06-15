
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { AboutTab } from '@/components/profile/AboutTab';
import { MusicTab } from '@/components/profile/MusicTab';
import { ProjectsTab } from '@/components/profile/ProjectsTab';
import { LinksTab } from '@/components/profile/LinksTab';
import { Profile } from '@/hooks/useProfile';
import { ConnectionButton } from '@/components/connections/ConnectionButton';
import { Link } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserProjects();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const mappedProfile: Profile = {
        ...data,
        visibility: data.visibility === 'unlisted' ? 'connections_only' : data.visibility as 'public' | 'private' | 'connections_only'
      };
      
      setProfile(mappedProfile);

      if (data?.zip_code && data.zip_code.length === 5) {
        fetchCityName(data.zip_code);
      } else if (data?.location) {
        setCityName(data.location);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchCityName = async (zipCode: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      const data = await response.json();
      setCityName(data.places[0]['place name']);
    } catch (error) {
      console.error('Error fetching city name:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
        <p className="text-gray-500 mt-2">The user profile you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <ProfileHeader 
        profile={profile} 
        cityName={cityName}
        actionButton={
          <ConnectionButton 
            userId={profile.id}
            variant="default"
            size="lg"
          />
        }
      />
      <ProfileStats 
        totalCollaborations={projects.length} 
        activeProjects={projects.filter((p: any) => p.status === 'active').length}
        profile={profile}
      />
      
      <TooltipProvider>
        <Tabs defaultValue="about" className="mt-8">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="links">
              <Link className="w-4 h-4 mr-1" />
              Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <AboutTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="music">
            <MusicTab userId={profile.id} />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsTab projects={projects} />
          </TabsContent>
          
          <TabsContent value="links">
            <LinksTab profile={profile} />
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
};

export default UserProfile;

