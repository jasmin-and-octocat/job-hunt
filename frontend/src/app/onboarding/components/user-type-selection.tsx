"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, UserIcon } from "lucide-react";

interface UserTypeSelectionProps {
  onSelect: (type: 'employer' | 'job-seeker') => void;
  selected: 'employer' | 'job-seeker' | null;
  onNext: () => void;
}

export const UserTypeSelection = ({ onSelect, selected, onNext }: UserTypeSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className={`cursor-pointer transition-all ${
            selected === 'job-seeker' 
              ? 'border-primary shadow-md' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onSelect('job-seeker')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <UserIcon size={64} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job Seeker</h3>
            <p className="text-muted-foreground text-sm mb-4">
              I'm looking for new job opportunities
            </p>
            <ul className="text-sm text-left space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Create a professional profile</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Apply for jobs</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Get matched with employers</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selected === 'employer' 
              ? 'border-primary shadow-md' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onSelect('employer')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <BriefcaseIcon size={64} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Employer</h3>
            <p className="text-muted-foreground text-sm mb-4">
              I want to post jobs and find candidates
            </p>
            <ul className="text-sm text-left space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Create company profile</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Post job opportunities</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Find qualified candidates</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={onNext} 
          disabled={!selected}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};