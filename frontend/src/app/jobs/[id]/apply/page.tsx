'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/header';
import { useToast } from '@/components/ui/use-toast';
import { useJobDetails } from '@/lib/hooks';
import { jobsApi } from '@/lib/api';
import { API_URL } from '@/lib/utils';

export default function JobApplyPage({ params }: { params: { id: string } }) {
  const {
    job,
    error: jobError,
    isLoading: isJobLoading,
  } = useJobDetails(params.id);
  const { toast } = useToast();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Resume file handling
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) return;

    try {
      setIsSubmitting(true);

      // First upload the resume file
      let resumeId = null;
      if (resume) {
        const formData = new FormData();
        formData.append('files', resume);

        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }

        const uploadResult = await uploadResponse.json();
        resumeId = uploadResult[0].id;
      }

      // Submit the application
      const applicationData = {
        fullName,
        email,
        phone,
        coverLetter,
        resume: resumeId,
        job: job.id,
        applicationDate: new Date().toISOString(),
        status: 'pending',
      };

      await jobsApi.submitApplication(job.id, applicationData);

      setSubmitSuccess(true);
      toast({
        title: 'Application submitted',
        description: 'Your application has been successfully submitted.',
      });
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: 'Application failed',
        description:
          'There was a problem submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isJobLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-6 md:px-6 md:py-12">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (jobError || !job) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-6 md:px-6 md:py-12">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Job not found</h2>
              <p className="mb-8 text-muted-foreground">
                The job listing you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
              <Button asChild>
                <Link href="/">Browse all jobs</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="mb-4">
            <Link
              href={`/jobs/${params.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to job details
            </Link>
          </div>

          {/* Success state */}
          {submitSuccess ? (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Application Submitted!
                </CardTitle>
                <CardDescription className="text-center">
                  Thank you for applying to {job.attributes.Title} at{' '}
                  {job.attributes.company?.data?.attributes?.name ||
                    'the company'}
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p>
                  Your application has been successfully submitted. The company
                  will review your application and contact you if they&apos;re
                  interested.
                </p>
                <p>
                  You can view your application status in your profile
                  dashboard.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/">Find more jobs</Link>
                </Button>
                <Button asChild>
                  <Link href="/applications">View my applications</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  Apply for: {job.attributes.Title}
                </h1>
                <p className="text-muted-foreground">
                  at{' '}
                  {job.attributes.company?.data?.attributes?.name || 'Company'}
                </p>
              </div>

              <Card className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                      Please fill out the form below to apply for this position.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Upload Resume</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('resume')?.click()
                          }
                          className="flex gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {resume ? 'Change File' : 'Select File'}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {resume ? resume.name : 'No file selected'}
                        </span>
                      </div>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX. Max size: 5MB.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Tell us why you're a good fit for this position"
                        className="min-h-[200px]"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" asChild>
                      <Link href={`/jobs/${params.id}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Application
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
