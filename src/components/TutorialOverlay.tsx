
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, Home, Search, MessageCircle, FolderOpen, Users } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  target: string;
  position: { top: number; left: number };
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your creative headquarters. View projects, recent activity, and find collaborators.',
    icon: Home,
    target: '[data-tutorial="dashboard"]',
    position: { top: 120, left: 120 }
  },
  {
    id: 'browse',
    title: 'Browse',
    description: 'Discover talented musicians, producers, and creators. Find your next collaborator.',
    icon: Search,
    target: '[data-tutorial="browse"]',
    position: { top: 175, left: 120 }
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Communicate with collaborators through direct messages and project chats.',
    icon: MessageCircle,
    target: '[data-tutorial="messages"]',
    position: { top: 230, left: 120 }
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Create and manage your musical projects. Upload files, set deadlines, invite collaborators.',
    icon: FolderOpen,
    target: '[data-tutorial="projects"]',
    position: { top: 285, left: 120 }
  },
  {
    id: 'following',
    title: 'Following',
    description: 'Keep track of musicians you follow and manage connection requests.',
    icon: Users,
    target: '[data-tutorial="following"]',
    position: { top: 340, left: 120 }
  }
];

const TutorialOverlay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tutorialParam = searchParams.get('tutorial');
    if (tutorialParam === 'true') {
      setIsVisible(true);
    }
  }, [searchParams]);

  const currentTutorialStep = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Remove tutorial parameter from URL
    searchParams.delete('tutorial');
    setSearchParams(searchParams);
  };

  if (!isVisible || !currentTutorialStep) {
    return null;
  }

  const Icon = currentTutorialStep.icon;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Tutorial popup */}
      <div
        className="fixed z-50 animate-in fade-in-0 scale-in-95"
        style={{
          top: currentTutorialStep.position.top,
          left: currentTutorialStep.position.left,
        }}
      >
        <Card className="w-80 shadow-xl border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentTutorialStep.title}</h3>
                  <p className="text-sm text-gray-500">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-gray-700 mb-6">
              {currentTutorialStep.description}
            </p>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="text-gray-600"
              >
                Skip Tutorial
              </Button>

              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tutorialSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow pointing to sidebar */}
        <div 
          className="absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"
          style={{ top: '50%', left: '-8px', transform: 'translateY(-50%)' }}
        />
      </div>
    </>
  );
};

export default TutorialOverlay;
