"use client";

import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserTypeSelection } from "./components/user-type-selection";
import { JobSeekerProfileForm } from "./components/job-seeker-profile-form";
import { EmployerProfileForm } from "./components/employer-profile-form";
import { CompanyForm } from "./components/company-form";
import { EducationForm } from "./components/education-form";
import { ExperienceForm } from "./components/experience-form";
import { SkillsForm } from "./components/skills-form";
import { OnboardingComplete } from "./components/onboarding-complete";

const OnboardingPage = () => {
  const { user, isAuthenticated, loading, userType, setUserType, hasCompletedOnboarding } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
    
    // Redirect to home if user has already completed onboarding
    if (!loading && hasCompletedOnboarding) {
      router.push('/');
    }
  }, [loading, isAuthenticated, hasCompletedOnboarding, router]);

  // Calculate progress based on current step and max steps
  useEffect(() => {
    // Different max steps based on user type
    const maxSteps = userType === 'employer' ? 3 : 5;
    setProgress((step / maxSteps) * 100);
  }, [step, userType]);

  // If loading or not authenticated, show a simple loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Different steps based on user type
  const renderStep = () => {
    // Step 1 is always user type selection
    if (step === 1) {
      return <UserTypeSelection onSelect={setUserType} selected={userType} onNext={handleNext} />;
    }

    // For job seekers
    if (userType === 'job-seeker') {
      switch (step) {
        case 2:
          return <JobSeekerProfileForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 3:
          return <EducationForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 4:
          return <ExperienceForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 5:
          return <SkillsForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 6:
          return <OnboardingComplete userType={userType} />;
        default:
          return null;
      }
    }

    // For employers
    if (userType === 'employer') {
      switch (step) {
        case 2:
          return <EmployerProfileForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 3:
          return <CompanyForm user={user} onNext={handleNext} onBack={handleBack} />;
        case 4:
          return <OnboardingComplete userType={userType} />;
        default:
          return null;
      }
    }

    return null;
  };

  const getStepTitle = () => {
    if (step === 1) return "Select Account Type";
    
    if (userType === 'job-seeker') {
      switch (step) {
        case 2: return "Personal Information";
        case 3: return "Education";
        case 4: return "Work Experience";
        case 5: return "Skills & Expertise";
        case 6: return "All Done!";
        default: return "";
      }
    }

    if (userType === 'employer') {
      switch (step) {
        case 2: return "Your Information";
        case 3: return "Company Details";
        case 4: return "All Done!";
        default: return "";
      }
    }

    return "";
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-3xl pt-4 pb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center py-4">{getStepTitle()}</CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? (
              "Let's get started by selecting your account type"
            ) : (
              "Complete your profile to get the most out of JobHunt"
            )}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;