
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';

interface LinkAccountsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onComplete: () => void;
  onBack: () => void;
}

const LinkAccountsStep = ({ data, onUpdate, onComplete, onBack }: LinkAccountsStepProps) => {
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
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        [platform]: url
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Connect Your Accounts</h3>
        <p className="text-gray-600">
          Link your social media and streaming platforms to help others discover your music
        </p>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => (
          <div key={platform.key} className="space-y-2">
            <Label className="flex items-center space-x-2">
              <span className="text-lg">{platform.icon}</span>
              <span className={platform.color}>{platform.name}</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder={platform.placeholder}
                value={data.socialLinks[platform.key]}
                onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                className="flex-1"
              />
              {data.socialLinks[platform.key] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(data.socialLinks[platform.key], '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-purple-900 mb-2">Why connect your accounts?</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Help other musicians discover your work</li>
          <li>• Build credibility with your existing audience</li>
          <li>• Make it easier to collaborate and network</li>
          <li>• Showcase your musical style and experience</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onComplete}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default LinkAccountsStep;
