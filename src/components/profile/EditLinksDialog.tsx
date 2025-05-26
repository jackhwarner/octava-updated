
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface EditLinksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditLinksDialog = ({ open, onOpenChange }: EditLinksDialogProps) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [socialLinks, setSocialLinks] = useState({
    spotify: '',
    appleMusic: '',
    youtube: '',
    soundcloud: '',
    instagram: '',
    tiktok: ''
  });

  // Load existing links when dialog opens
  useState(() => {
    if (open && profile?.portfolio_urls) {
      // Parse existing portfolio URLs to extract social links
      const links = {
        spotify: '',
        appleMusic: '',
        youtube: '',
        soundcloud: '',
        instagram: '',
        tiktok: ''
      };
      
      profile.portfolio_urls.forEach(url => {
        if (url.includes('spotify.com')) links.spotify = url;
        else if (url.includes('music.apple.com')) links.appleMusic = url;
        else if (url.includes('youtube.com') || url.includes('youtu.be')) links.youtube = url;
        else if (url.includes('soundcloud.com')) links.soundcloud = url;
        else if (url.includes('instagram.com')) links.instagram = url;
        else if (url.includes('tiktok.com')) links.tiktok = url;
      });
      
      setSocialLinks(links);
    }
  });

  const socialPlatforms = [
    {
      key: 'spotify',
      name: 'Spotify',
      placeholder: 'https://spotify.com/artist/your-profile',
      color: 'text-green-600',
      icon: '🎵'
    },
    {
      key: 'appleMusic',
      name: 'Apple Music',
      placeholder: 'https://music.apple.com/artist/your-profile',
      color: 'text-gray-800',
      icon: '🍎'
    },
    {
      key: 'youtube',
      name: 'YouTube',
      placeholder: 'https://youtube.com/@your-channel',
      color: 'text-red-600',
      icon: '📺'
    },
    {
      key: 'soundcloud',
      name: 'SoundCloud',
      placeholder: 'https://soundcloud.com/your-profile',
      color: 'text-orange-600',
      icon: '☁️'
    },
    {
      key: 'instagram',
      name: 'Instagram',
      placeholder: 'https://instagram.com/your-profile',
      color: 'text-pink-600',
      icon: '📷'
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      placeholder: 'https://tiktok.com/@your-profile',
      color: 'text-black',
      icon: '🎬'
    }
  ];

  const updateSocialLink = (platform: string, url: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: url
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert social links to portfolio URLs array
      const portfolioUrls = Object.values(socialLinks).filter(url => url.trim() !== '');
      
      await updateProfile({
        portfolio_urls: portfolioUrls
      });
      
      toast({
        title: "Success",
        description: "Links updated successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating links:', error);
      toast({
        title: "Error",
        description: "Failed to update links",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Social & Streaming Links</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className="space-y-2">
              <Label className="flex items-center space-x-2">
                <span className="text-lg">{platform.icon}</span>
                <span className={platform.color}>{platform.name}</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  placeholder={platform.placeholder}
                  value={socialLinks[platform.key as keyof typeof socialLinks]}
                  onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                  className="flex-1"
                />
                {socialLinks[platform.key as keyof typeof socialLinks] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(socialLinks[platform.key as keyof typeof socialLinks], '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
