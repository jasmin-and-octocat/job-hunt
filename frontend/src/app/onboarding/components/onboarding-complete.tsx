"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Briefcase, Search } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";

interface OnboardingCompleteProps {
  userType: 'job-seeker' | 'employer' | null;
}

export const OnboardingComplete = ({ userType }: OnboardingCompleteProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleContinue = () => {
    if (userType === 'employer') {
      router.push('/jobs/create');
    } else {
      router.push('/jobs');
    }
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="flex flex-col items-center py-6 space-y-8">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle size={48} />
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-bold">Onboarding Complete!</h3>
        <p className="text-muted-foreground max-w-md">
          {userType === 'job-seeker'
            ? "Your job seeker profile has been created. You're now ready to explore jobs and apply for positions."
            : "Your employer profile has been created. You can now post jobs and find qualified candidates."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {userType === 'job-seeker' ? (
          <>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <Search className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Browse Jobs</h4>
              <p className="text-sm text-muted-foreground">Find and apply to jobs that match your skills</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <BookOpen className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Complete Profile</h4>
              <p className="text-sm text-muted-foreground">Add more details to stand out to employers</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <Briefcase className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Track Applications</h4>
              <p className="text-sm text-muted-foreground">Monitor your job application progress</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <Briefcase className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Post Jobs</h4>
              <p className="text-sm text-muted-foreground">Create and publish job listings</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <Search className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Find Candidates</h4>
              <p className="text-sm text-muted-foreground">Browse qualified candidates for your openings</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md text-center">
              <BookOpen className="w-10 h-10 mb-2 text-primary" />
              <h4 className="font-medium">Complete Company</h4>
              <p className="text-sm text-muted-foreground">Add more details about your organization</p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={handleGoToProfile}>
          Go to Profile
        </Button>
        <Button onClick={handleContinue}>
          {userType === 'job-seeker' ? 'Start Exploring Jobs' : 'Create Your First Job Post'}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Need help? Contact our support team at support@job-hunt-toy-project.com
      </p>
    </div>
  );
};