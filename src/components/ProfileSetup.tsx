import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AboutYouStep from './ProfileSetup/AboutYouStep';
import UploadFilesStep from './ProfileSetup/UploadFilesStep';
import LinkAccountsStep from './ProfileSetup/LinkAccountsStep';
import { REDIRECT_IF_NO_SUBSCRIPTION } from '@/constants/subscription';
import { useAuthAndProfile } from '@/hooks/useAuthAndProfile';

const ProfileSetup = () => {
  console.log('ProfileSetup component rendering');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reloadProfile } = useAuthAndProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profileData, setProfileData] = useState({
    name: location.state?.fullName || '',
    username: '',
    bio: '',
    location: '',
    genres: [] as string[],
    experience: '',
    instruments: [] as string[],
    role: location.state?.role || '',
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
    profile_setup_completed: false
  });

  console.log('ProfileSetup state:', { currentStep, profileData });

  const steps = [
    { id: 1, title: 'About You', description: 'Tell us about yourself' },
    { id: 2, title: 'Upload Files', description: 'Add your profile picture and music' },
    { id: 3, title: 'Link Accounts', description: 'Connect your social platforms' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);

      // Mark profile not completed yet (each step that is not the last)
      setProfileData(prev => ({
        ...prev,
        profile_setup_completed: false
      }));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          experience: profileData.experience,
          role: profileData.role,
          genres: profileData.genres,
          skills: profileData.instruments,
          profile_setup_completed: true
        });

      if (error) throw error;

      setCompletedSteps(prev => [...prev, currentStep]);
      toast({
        title: "Profile setup complete!",
        description: "Welcome to Octava! Let's show you around.",
      });

      // Reload the profile state so downstream hooks show it's completed
      await reloadProfile();

      // Navigate to dashboard with tutorial flag
      navigate('/dashboard?tutorial=true');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 p-6">
      {console.log('ProfileSetup render method called')}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your musical profile in just a few steps</p>
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
