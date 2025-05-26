
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { AboutTab } from '@/components/profile/AboutTab';
import { MusicTab } from '@/components/profile/MusicTab';

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading } = usePublicProfile(userId);
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

  if (!profile) {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <p className="text-gray-600">This user profile doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  // Check if profile is private and we're not the owner
  if (profile.visibility === 'private') {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Private Profile</h1>
          <p className="text-gray-600">This profile is private and cannot be viewed.</p>
        </div>
      </div>
    );
  }

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
            totalCollaborations={0}
            activeProjects={0}
            profile={profile}
          />

          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <AboutTab profile={profile} />
            </TabsContent>

            <TabsContent value="music" className="space-y-6">
              <MusicTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PublicProfile;
