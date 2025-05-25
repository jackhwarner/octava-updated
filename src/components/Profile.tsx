
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, MessageCircle, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfileEditDialog from './ProfileEditDialog';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (isOwnProfile) {
        setProfile(currentUser);
        setIsLoading(false);
      } else {
        fetchUserProfile(userId!);
      }
    }
  }, [currentUser, userId, isOwnProfile]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setCurrentUser(profileData);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUserProfile = async (profileUserId: string) => {
    try {
      setIsLoading(true);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileUserId)
        .single();
      
      setProfile(profileData);
      
      // Check if following
      if (currentUser) {
        const { data: followData } = await supabase
          .from('followers')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', profileUserId)
          .single();
        
        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profile) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profile.id);
        
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profile.full_name || profile.username}`
        });
      } else {
        // Follow
        await supabase
          .from('followers')
          .insert({
            follower_id: currentUser.id,
            following_id: profile.id
          });
        
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${profile.full_name || profile.username}`
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status"
      });
    }
  };

  const handleMessage = async () => {
    // Navigate to messages with this user
    toast({
      title: "Message feature",
      description: "Message functionality will be implemented soon!"
    });
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
    if (isOwnProfile) {
      setCurrentUser(updatedProfile);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || profile.profile_picture_url} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.charAt(0) || profile.name?.charAt(0) || profile.email?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {profile.full_name || profile.name || 'Unknown User'}
                  </h1>
                  {profile.username && (
                    <p className="text-lg text-gray-600">@{profile.username}</p>
                  )}
                  {profile.role && (
                    <Badge variant="secondary" className="mt-2">
                      {profile.role}
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4 md:mt-0">
                  {isOwnProfile ? (
                    <Button onClick={() => setIsEditDialogOpen(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleFollow}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button onClick={handleMessage}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-gray-700 mb-4">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </div>
                )}
                {profile.experience && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {profile.experience} experience
                  </div>
                )}
                {profile.hourly_rate && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${profile.hourly_rate}/hour
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills and Genres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {profile.skills && profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {profile.genres && profile.genres.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.genres.map((genre: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Portfolio */}
      {profile.portfolio_urls && profile.portfolio_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.portfolio_urls.map((url: string, index: number) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-600 hover:underline"
                >
                  {url}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOwnProfile && (
        <ProfileEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
