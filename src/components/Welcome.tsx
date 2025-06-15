
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Music, Users, MessageCircle, FolderOpen, Settings, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Octava!",
      subtitle: "Your musical collaboration platform",
      content: "Octava connects musicians, producers, and creators to collaborate on amazing projects. Let's take a quick tour to get you started!",
      icon: <Sparkles className="w-12 h-12 text-purple-600" />,
      image: "/lovable-uploads/octava-large-purple.png"
    },
    {
      title: "Dashboard",
      subtitle: "Your creative headquarters",
      content: "The dashboard shows your projects, recent activity, and suggested collaborators. It's your home base for managing all your musical endeavors.",
      icon: <FolderOpen className="w-12 h-12 text-blue-600" />,
      features: [
        "View all your projects at a glance",
        "See recent activity and updates",
        "Find suggested collaborators",
        "Quick access to create new projects"
      ]
    },
    {
      title: "Browse & Connect",
      subtitle: "Discover amazing musicians",
      content: "Browse through talented musicians, producers, and creators. Filter by genre, location, and skills to find the perfect collaborators.",
      icon: <Users className="w-12 h-12 text-green-600" />,
      features: [
        "Search musicians by genre and skills",
        "View detailed profiles and portfolios",
        "Send connection requests",
        "Join open collaboration projects"
      ]
    },
    {
      title: "Projects",
      subtitle: "Bring your ideas to life",
      content: "Create and manage your musical projects. Upload files, set deadlines, invite collaborators, and track progress all in one place.",
      icon: <Music className="w-12 h-12 text-orange-600" />,
      features: [
        "Create unlimited projects",
        "Upload and organize audio files",
        "Set project goals and deadlines",
        "Invite specific collaborators"
      ]
    },
    {
      title: "Messages",
      subtitle: "Stay in sync with your team",
      content: "Communicate with your collaborators through direct messages and project-specific chat rooms. Keep everyone on the same page.",
      icon: <MessageCircle className="w-12 h-12 text-pink-600" />,
      features: [
        "Direct messaging with collaborators",
        "Project-specific chat rooms",
        "Share files and feedback",
        "Real-time notifications"
      ]
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to make music together",
      content: "You now know the basics of Octava! Start by exploring the browse page to find collaborators, or create your first project to get the ball rolling.",
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      cta: true
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const progressPercentage = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipToApp = () => {
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <img 
            src="/lovable-uploads/octava-large-purple.png" 
            alt="Octava" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {currentStepData.subtitle}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </div>
        </div>

        {/* Tutorial Content */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {currentStepData.icon}
            </div>

            {/* Welcome step with image */}
            {isFirstStep && currentStepData.image && (
              <div className="text-center mb-6">
                <img 
                  src={currentStepData.image} 
                  alt="Octava Welcome" 
                  className="h-32 mx-auto mb-4 opacity-80"
                />
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {currentStepData.content}
              </p>
            </div>

            {/* Feature List */}
            {currentStepData.features && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Step Call to Action */}
            {currentStepData.cta && (
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Collaborators
                  </Button>
                  <Button 
                    onClick={handleSkipToApp}
                    variant="outline"
                    size="lg"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        {!isLastStep && (
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleSkipToApp}
              className="text-gray-600"
            >
              Skip Tutorial
            </Button>
            
            <div className="flex space-x-3">
              {!isFirstStep && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Skip option for final step */}
        {isLastStep && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={handleSkipToApp}
              className="text-gray-600"
            >
              Go to Dashboard Instead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
