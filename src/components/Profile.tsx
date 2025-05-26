
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { AboutTab } from '@/components/profile/AboutTab';
import { MusicTab } from '@/components/profile/MusicTab';
import ProjectsTab from '@/components/profile/ProjectsTab';
import { LinksTab } from '@/components/profile/LinksTab';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { projects } = useProjects();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    if (profile?.zip_code && profile.zip_code.length === 5) {
      fetchCityName(profile.zip_code);
    } else if (profile?.location) {
      setCityName(profile.location);
    }
  }, [profile]);

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

  // Calculate stats from actual data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalCollaborations = projects.reduce((acc, p) => acc + (p.collaborators?.length || 0), 0);

  const handleUpdateProfile = async (updates: Partial<typeof profile>) => {
    await updateProfile(updates);
    // Refetch city name if zip code was updated
    if (updates.zip_code && updates.zip_code.length === 5) {
      fetchCityName(updates.zip_code);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader 
            profile={profile}
            cityName={cityName}
            onEditClick={() => setShowEditDialog(true)}
            isOwnProfile={true}
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
              <ProjectsTab />
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <LinksTab />
            </TabsContent>
          </Tabs>
        </div>

        <EditProfileDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          profile={profile}
          onSave={handleUpdateProfile}
        />
      </div>
    </TooltipProvider>
  );
};

export default Profile;
