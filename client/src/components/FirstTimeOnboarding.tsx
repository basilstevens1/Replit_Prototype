import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  Shield, 
  Plus, 
  Star,
  ArrowRight,
  CheckCircle,
  X
} from "lucide-react";

interface FirstTimeOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function FirstTimeOnboarding({ isOpen, onClose, onComplete }: FirstTimeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Impact Altruism!",
      description: "Let's get you started with tracking the real-world impact of your charitable giving.",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Heart className="h-16 w-16 text-chart-1 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transform Your Giving</h3>
            <p className="text-muted-foreground">
              See exactly how your donations save lives, improve health, and help communities worldwide 
              with research-based impact estimates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Research-based estimates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Confidence levels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Achievement badges</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How Impact Calculation Works",
      description: "We use effectiveness research to estimate your donation's real-world impact.",
      content: (
        <div className="space-y-6">
          <Card className="p-4 bg-muted/30">
            <div className="text-center space-y-3">
              <div className="text-lg font-semibold text-chart-1">Example: $100 Donation</div>
              <div className="text-sm text-muted-foreground">to Against Malaria Foundation</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="font-semibold text-chart-2">0.3</div>
                  <div className="text-xs text-muted-foreground">Lives Saved</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-chart-3">12.5</div>
                  <div className="text-xs text-muted-foreground">QUALYs Gained</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-chart-1">167</div>
                  <div className="text-xs text-muted-foreground">People Helped</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-3 w-3 text-green-500" />
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">High Confidence</Badge>
              </div>
            </div>
          </Card>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-chart-2/10 p-2 rounded">
                <BarChart3 className="h-4 w-4 text-chart-2" />
              </div>
              <div>
                <div className="font-medium">Research-Based</div>
                <div className="text-muted-foreground">Uses GiveWell estimates and academic research</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-chart-1/10 p-2 rounded">
                <Shield className="h-4 w-4 text-chart-1" />
              </div>
              <div>
                <div className="font-medium">Confidence Levels</div>
                <div className="text-muted-foreground">High/Medium/Low based on evidence quality</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Progress Tracking & Gamification", 
      description: "Level up as you give! Earn XP, maintain streaks, and unlock achievements.",
      content: (
        <div className="space-y-6">
          <Card className="p-4 bg-muted/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Level 1 Donor</span>
                </div>
                <Badge variant="secondary" className="text-xs">0 XP</Badge>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground">100 XP to Level 2 (1 XP per $10 donated)</p>
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 text-chart-2 mx-auto mb-1" />
                <div className="text-sm font-medium">Giving Streaks</div>
                <div className="text-xs text-muted-foreground">Donate on consecutive days</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <Award className="h-6 w-6 text-chart-1 mx-auto mb-1" />
                <div className="text-sm font-medium">Achievement Badges</div>
                <div className="text-xs text-muted-foreground">Unlock milestones & goals</div>
              </div>
            </Card>
          </div>

          <div className="text-sm space-y-2">
            <div className="font-medium">Unlock achievements for:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• First donation</div>
              <div>• Streak milestones</div>
              <div>• Amount targets ($100, $500...)</div>
              <div>• Level achievements</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start Tracking?",
      description: "Add your first donation to begin seeing your impact and start leveling up!",
      content: (
        <div className="space-y-6 text-center">
          <div className="bg-muted/30 p-6 rounded-lg">
            <Plus className="h-12 w-12 text-chart-1 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Add Your First Donation</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Add Donation" button in the dashboard to log your charitable giving 
              and see its estimated impact.
            </p>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="font-medium">What happens next:</div>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-2" />
                <span>Your impact metrics will be calculated</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                <span>You'll earn experience points and level up</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-chart-1" />
                <span>Unlock your first achievement badge</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-chart-2" />
                <span>Read stories from communities you've helped</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    console.log('Onboarding handleNext called, current step:', currentStep, 'of', steps.length - 1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Completing onboarding...');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    console.log('Skipping onboarding...');
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('Dialog onOpenChange called:', open);
      if (!open) {
        console.log('Dialog closing, calling onClose...');
        onClose();
      }
    }}>
      <DialogContent 
        className="max-w-2xl" 
        data-testid="dialog-first-time-onboarding"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleSkip} data-testid="button-skip-onboarding">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              data-testid="button-onboarding-previous"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                data-testid="button-onboarding-skip"
              >
                Skip Tour
              </Button>
              <Button 
                onClick={handleNext}
                className="flex items-center gap-2"
                data-testid="button-onboarding-next"
              >
                {isLastStep ? "Get Started" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}