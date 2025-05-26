
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
        .select(`
          *,
          collaborators:project_collaborators (
            id,
            user_id,
            role,
            status,
            profiles (
              name,
              username
            )
          )
        `)
        .eq('owner_id', userId)
        .eq('visibility', 'public');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchCityName = async (zipCode: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        const city = data.places[0]['place name'];
        const state = data.places[0]['state abbreviation'];
        setCityName(`${city}, ${state}`);
      } else {
        setCityName('Location not found');
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
      setCityName(profile?.location || 'Location not available');
    }
  };

  if (loading) {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600">The user profile you're looking for doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalCollaborations = projects.reduce((acc, p) => acc + (p.collaborators?.length || 0), 0);

  return (
    <TooltipProvider>
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader 
            profile={profile}
            cityName={cityName}
            onEditClick={() => {}}
            isOwnProfile={false}
          />

          <ProfileStats 
            totalCollaborations={totalCollaborations}
            activeProjects={activeProjects}
            profile={profile}
          />

          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <AboutTab profile={profile} />
            </TabsContent>

            <TabsContent value="music" className="space-y-6">
              <MusicTab />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectsTab projects={projects} />
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <LinksTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UserProfile;
