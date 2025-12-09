import { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegistrationLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepSubtitle: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveLater?: () => void;
  showPrevious?: boolean;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

const RegistrationLayout = ({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  stepSubtitle,
  onPrevious,
  onNext,
  onSaveLater,
  showPrevious = true,
  nextLabel = "Next",
  isNextDisabled = false,
}: RegistrationLayoutProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const isDemoMode = sessionStorage.getItem('demo_registration') === 'true';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo1.png" alt="Ellure NexHire" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-lg font-bold">Ellure NexHire</h1>
            </div>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Demo Mode Alert */}
          {isDemoMode && (
            <Alert className="mb-6 border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                <strong>Demo Mode:</strong> You're filling the form in demo mode. No data will be saved to the database.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </p>
              <p className="text-sm font-medium text-primary">
                {progressPercentage.toFixed(0)}% Complete
              </p>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-bold mb-2">{stepTitle}</h2>
                <p className="text-muted-foreground">{stepSubtitle}</p>
              </div>
              {onSaveLater && currentStep < totalSteps && (
                <Button variant="ghost" onClick={onSaveLater}>
                  Save & Continue Later
                </Button>
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-xl shadow-elegant border p-8 mb-8">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            {showPrevious && onPrevious ? (
              <Button variant="outline" onClick={onPrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}
            {onNext && (
              <Button onClick={onNext} disabled={isNextDisabled} size="lg">
                {nextLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Ellure NexHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationLayout;
