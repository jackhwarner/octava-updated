
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ExternalLink, Music, Video, Camera, Music2, Link as LinkIcon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { EditLinksDialog } from './EditLinksDialog';

interface LinksTabProps {
  isOwnProfile?: boolean;
  profile?: any; // Accepts profile prop for UserProfile usage, optional
}

export const LinksTab = ({
  isOwnProfile = true,
  profile: profileProp,
}: LinksTabProps) => {
  const {
    profile: ownProfile,
  } = useProfile?.() ?? {};
  const profile = profileProp || ownProfile;

  const [showEditDialog, setShowEditDialog] = useState(false);

  const getPlatformInfo = (url: string) => {
    if (url.includes('spotify.com')) return {
      name: 'Spotify',
      icon: Music,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    };
    if (url.includes('music.apple.com')) return {
      name: 'Apple Music',
      icon: Music2,
      color: 'text-gray-800',
      bgColor: 'bg-gray-100'
    };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return {
      name: 'YouTube',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    };
    if (url.includes('soundcloud.com')) return {
      name: 'SoundCloud',
      icon: Music,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    };
    if (url.includes('instagram.com')) return {
      name: 'Instagram',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    };
    if (url.includes('tiktok.com')) return {
      name: 'TikTok',
      icon: Video,
      color: 'text-black',
      bgColor: 'bg-gray-100'
    };
    return {
      name: 'Website',
      icon: ExternalLink,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    };
  };
  const portfolioUrls = profile?.portfolio_urls || [];
  return (
    <>
      <Card>
        <CardHeader className="pt-4">
          {/* Main image banner and icon for the Links tab */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-4 w-full">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
                alt="Links banner"
                className="w-full h-32 md:h-40 object-cover rounded-lg shadow"
                loading="lazy"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border w-16 h-16 flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-blue-700" />
              </div>
            </div>
            {/* CardTitle */}
            <CardTitle className="font-semibold text-2xl mt-8 flex items-center gap-3">
              Links
              {isOwnProfile && (
                <Button variant="outline" className="ml-3" onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Links
                </Button>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {portfolioUrls.length > 0 ? (
            <div className="space-y-3">
              {portfolioUrls.map((url, index) => {
                const platformInfo = getPlatformInfo(url);
                const PlatformIcon = platformInfo.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${platformInfo.bgColor} flex items-center justify-center`}>
                        <PlatformIcon className={`w-5 h-5 ${platformInfo.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{platformInfo.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{url}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => window.open(url, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No links added yet</p>
              {isOwnProfile && (
                <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Add Links
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {isOwnProfile && <EditLinksDialog open={showEditDialog} onOpenChange={setShowEditDialog} />}
    </>
  );
};
