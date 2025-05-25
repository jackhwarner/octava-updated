
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AboutYouStep from './ProfileSetup/AboutYouStep';
import UploadFilesStep from './ProfileSetup/UploadFilesStep';
import LinkAccountsStep from './ProfileSetup/LinkAccountsStep';

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    genres: [] as string[],
    experience: '',
    instruments: [] as string[],
    profilePic: null as File | null,
    musicFiles: [] as File[],
    socialLinks: {
      spotify: '',
      appleMusic: '',
      youtube: '',
      soundcloud: '',
      instagram: '',
      tiktok: '',
    },
    role: '' // Store the role from signup
  });

  useEffect(() => {
    // Check if user is authenticated and get their role
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      
      // Get the role from user metadata
      const userRole = user.user_metadata?.primary_role || '';
      setProfileData(prev => ({ ...prev, role: userRole }));
    });
  }, [navigate]);

  const steps = [
    { id: 1, title: 'About You', description: 'Tell us about yourself' },
    { id: 2, title: 'Upload Files', description: 'Add your profile picture and music' },
    { id: 3, title: 'Link Accounts', description: 'Connect your social platforms' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-picture.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  };

  const uploadMusicFiles = async (files: File[]): Promise<string[]> => {
    if (!user || files.length === 0) return [];
    
    const uploadPromises = files.map(async (file, index) => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/music-${index}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return null;
        }

        const { data } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);

        return data.publicUrl;
      } catch (error) {
        console.error('Error uploading music file:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setCompletedSteps(prev => [...prev, currentStep]);
    
    try {
      // Upload profile picture if provided
      let avatarUrl = null;
      if (profileData.profilePic) {
        avatarUrl = await uploadProfilePicture(profileData.profilePic);
      }

      // Upload music files if provided
      const musicUrls = await uploadMusicFiles(profileData.musicFiles);

      // Update the user's profile in the database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          experience_level: profileData.experience,
          genres: profileData.genres,
          skills: profileData.instruments,
          primary_role: profileData.role,
          avatar_url: avatarUrl,
          portfolio_urls: musicUrls.length > 0 ? musicUrls : null,
        });

      if (error) {
        throw error;
      }

      console.log('Profile setup completed:', profileData);
      
      toast({
        title: "Profile setup completed!",
        description: "Welcome to Octava! Your profile has been created successfully."
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        variant: "destructive",
        title: "Profile setup failed",
        description: error.message || "There was an error saving your profile. Please try again."
      });
    }
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  const updateProfileData = (newData: Partial<typeof profileData>) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AboutYouStep 
            data={profileData} 
            onUpdate={updateProfileData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <UploadFilesStep 
            data={profileData} 
            onUpdate={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <LinkAccountsStep 
            data={profileData} 
            onUpdate={updateProfileData}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your musical profile in just a few steps</p>
          {profileData.role && (
            <p className="text-sm text-purple-600 mt-2">Setting up as: {profileData.role}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                {isStepCompleted(step.id) ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      currentStep === step.id 
                        ? 'border-purple-600 bg-purple-600 text-white' 
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
