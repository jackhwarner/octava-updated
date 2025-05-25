
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfileEditDialog = ({ isOpen, onClose, profile, onProfileUpdate }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    primary_role: profile?.primary_role || '',
    experience_level: profile?.experience_level || '',
  });
  const [detectedCity, setDetectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 5) {
      setFormData(prev => ({ ...prev, location: value }));
      
      if (value.length === 5) {
        try {
          const response = await fetch(`https://api.zippopotam.us/us/${value}`);
          if (response.ok) {
            const data = await response.json();
            const city = data.places[0]['place name'];
            const state = data.places[0]['state abbreviation'];
            setDetectedCity(`(${city}, ${state})`);
          } else {
            setDetectedCity('');
          }
        } catch (error) {
          setDetectedCity('');
        }
      } else {
        setDetectedCity('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username.replace('@', ''), // Remove @ if user typed it
          bio: formData.bio,
          location: formData.location,
          primary_role: formData.primary_role || null,
          experience_level: formData.experience_level || null,
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="username"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-1">
                <span>Zip Code</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your zip code won't be public and is only used to determine your general area</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="location"
                  placeholder="12345"
                  value={formData.location}
                  onChange={handleZipCodeChange}
                  maxLength={5}
                  className="w-32"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {detectedCity && (
                  <span className="text-gray-600 text-sm">{detectedCity}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_role">Primary Role</Label>
              <Select value={formData.primary_role} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocalist">Vocalist</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                  <SelectItem value="songwriter">Songwriter</SelectItem>
                  <SelectItem value="composer">Composer</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select value={formData.experience_level} onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ProfileEditDialog;
