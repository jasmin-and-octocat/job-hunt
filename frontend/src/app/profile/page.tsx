'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Plus,
  Settings,
  Star,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { ProfileSidebar } from '@/components/profile-sidebar';
import { userApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { formatRelativeDate } from '@/lib/utils';

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 1;

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
    mutate: mutateProfile,
  } = useSWR('/api/profile', () => userApi.getUserProfile(MOCK_USER_ID), {
    revalidateOnFocus: false,
  });

  // Fetch user's saved jobs
  const {
    data: savedJobsData,
    error: savedJobsError,
    isLoading: savedJobsLoading,
    mutate: mutateSavedJobs,
  } = useSWR('/api/saved-jobs', () => userApi.getSavedJobs(MOCK_USER_ID), {
    revalidateOnFocus: false,
  });

  const profile = profileData?.data;
  const savedJobs = savedJobsData?.data || [];

  // Form state for editing profile
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    location: '',
    about: '',
    phone: '',
    email: '',
    website: '',
    linkedIn: '',
    github: '',
  });

  // Initialize form state with profile data when available
  useState(() => {
    if (profile && !isEditing) {
      setFormState({
        firstName: profile.attributes.firstName || '',
        lastName: profile.attributes.lastName || '',
        headline: profile.attributes.headline || '',
        location: profile.attributes.location || '',
        about: profile.attributes.about || '',
        phone: profile.attributes.phone || '',
        email: profile.attributes.email || '',
        website: profile.attributes.website || '',
        linkedIn: profile.attributes.linkedIn || '',
        github: profile.attributes.github || '',
      });
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await userApi.updateUserProfile(MOCK_USER_ID, formState);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      setIsEditing(false);
      mutateProfile();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
      });
    }
  };

  const handleRemoveSavedJob = async (savedJobId: number | string) => {
    try {
      await userApi.removeJob(Number(savedJobId));

      toast({
        title: 'Job removed',
        description: 'The job has been removed from your saved jobs.',
      });

      mutateSavedJobs();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove the job. Please try again.',
      });
    }
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Failed to load profile</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your profile data.
            </p>
            <Button onClick={() => mutateProfile()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <ProfileSidebar />
        <main className="flex-1 p-6 pt-0">
          <div className="flex flex-col space-y-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Profile
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile, resume and saved jobs
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild variant="outline">
                  <Link href="/applications">View Applications</Link>
                </Button>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
              </TabsList>

              {/* Profile Tab Content */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal information
                        </CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formState.firstName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formState.lastName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="headline">
                            Professional Headline
                          </Label>
                          <Input
                            id="headline"
                            name="headline"
                            value={formState.headline}
                            onChange={handleInputChange}
                            placeholder="e.g., Senior Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formState.location}
                            onChange={handleInputChange}
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="about">About</Label>
                          <Textarea
                            id="about"
                            name="about"
                            value={formState.about}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Tell employers about yourself"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formState.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formState.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Personal Website</Label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formState.website}
                            onChange={handleInputChange}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="linkedIn">LinkedIn</Label>
                            <Input
                              id="linkedIn"
                              name="linkedIn"
                              value={formState.linkedIn}
                              onChange={handleInputChange}
                              placeholder="LinkedIn profile URL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              name="github"
                              value={formState.github}
                              onChange={handleInputChange}
                              placeholder="GitHub profile URL"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-muted-foreground/60" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {profile?.attributes.firstName}{' '}
                              {profile?.attributes.lastName}
                            </h3>
                            <p className="text-muted-foreground">
                              {profile?.attributes.headline ||
                                'No headline set'}
                            </p>
                            {profile?.attributes.location && (
                              <div className="flex items-center gap-1 mt-1 text-sm">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{profile.attributes.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">About</h4>
                          <p className="text-sm text-muted-foreground">
                            {profile?.attributes.about ||
                              'No information provided.'}
                          </p>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">
                            Contact Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Email:{' '}
                              </span>
                              <span>
                                {profile?.attributes.email || 'Not provided'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Phone:{' '}
                              </span>
                              <span>
                                {profile?.attributes.phone || 'Not provided'}
                              </span>
                            </div>
                            {profile?.attributes.website && (
                              <div>
                                <span className="text-muted-foreground">
                                  Website:{' '}
                                </span>
                                <a
                                  href={profile.attributes.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {profile.attributes.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">
                            Social Profiles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {profile?.attributes.linkedIn && (
                              <a
                                href={profile.attributes.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs"
                              >
                                LinkedIn
                              </a>
                            )}
                            {profile?.attributes.github && (
                              <a
                                href={profile.attributes.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs"
                              >
                                GitHub
                              </a>
                            )}
                            {!profile?.attributes.linkedIn &&
                              !profile?.attributes.github && (
                                <span className="text-sm text-muted-foreground">
                                  No social profiles added.
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardFooter>
                  )}
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>
                          Add skills to your profile to stand out to employers
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skills
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile?.attributes.skills?.data?.length > 0 ? (
                        profile.attributes.skills.data.map((skill: { id: number | string; attributes: { name: string } }) => (
                          <div
                            key={skill.id}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-primary/10 text-xs font-medium"
                          >
                            {skill.attributes.name}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No skills added yet.
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>
                          Add your education history
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile?.attributes.education?.data?.length > 0 ? (
                      <div className="space-y-6">
                        {profile.attributes.education.data.map((edu: { id: number | string; attributes: { institution: string; degree: string; fieldOfStudy?: string; startDate?: string; endDate?: string; description?: string } }) => (
                          <div key={edu.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {edu.attributes.institution}
                              </h4>
                              <p className="text-sm">
                                {edu.attributes.degree}
                                {edu.attributes.fieldOfStudy
                                  ? `, ${edu.attributes.fieldOfStudy}`
                                  : ''}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {edu.attributes.startDate && (
                                  <>
                                    {new Date(
                                      edu.attributes.startDate
                                    ).getFullYear()}{' '}
                                    -{' '}
                                    {edu.attributes.endDate
                                      ? new Date(
                                          edu.attributes.endDate
                                        ).getFullYear()
                                      : 'Present'}
                                  </>
                                )}
                              </p>
                              {edu.attributes.description && (
                                <p className="text-sm mt-2">
                                  {edu.attributes.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground/60" />
                        <p className="text-sm text-muted-foreground mt-2">
                          No education history added yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Experience</CardTitle>
                        <CardDescription>
                          Add your work experience
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile?.attributes.experience?.data?.length > 0 ? (
                      <div className="space-y-6">
                        {profile.attributes.experience.data.map((exp: { id: number | string; attributes: { title: string; company: string; startDate?: string; endDate?: string; location?: string; description?: string } }) => (
                          <div key={exp.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {exp.attributes.title}
                              </h4>
                              <p className="text-sm">
                                {exp.attributes.company}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {exp.attributes.startDate && (
                                  <>
                                    {new Date(
                                      exp.attributes.startDate
                                    ).toLocaleDateString(undefined, {
                                      month: 'short',
                                      year: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {exp.attributes.endDate
                                      ? new Date(
                                          exp.attributes.endDate
                                        ).toLocaleDateString(undefined, {
                                          month: 'short',
                                          year: 'numeric',
                                        })
                                      : 'Present'}
                                    {exp.attributes.location &&
                                      ` · ${exp.attributes.location}`}
                                  </>
                                )}
                              </p>
                              {exp.attributes.description && (
                                <p className="text-sm mt-2">
                                  {exp.attributes.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Briefcase className="h-8 w-8 mx-auto text-muted-foreground/60" />
                        <p className="text-sm text-muted-foreground mt-2">
                          No work experience added yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resume Tab Content */}
              <TabsContent value="resume" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Resume Management</CardTitle>
                        <CardDescription>
                          Upload and manage your resume
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload New Resume
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile?.attributes.resumeFile?.data ? (
                      <div className="space-y-4">
                        <div className="flex items-center p-3 border rounded-md">
                          <div className="flex-shrink-0 mr-3">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {
                                profile.attributes.resumeFile.data.attributes
                                  .name
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded{' '}
                              {formatRelativeDate(
                                profile.attributes.resumeFile.data.attributes
                                  .updatedAt
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={
                                  profile.attributes.resumeFile.data.attributes
                                    .url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
                        <h3 className="text-lg font-medium mb-1">
                          No resume uploaded yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload your resume to apply for jobs more quickly
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Upload Resume
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Saved Jobs Tab Content */}
              <TabsContent value="saved" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Jobs</CardTitle>
                    <CardDescription>
                      Jobs you&apos;ve saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedJobsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : savedJobsError ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-red-500">
                          Failed to load saved jobs
                        </p>
                        <Button
                          onClick={() => mutateSavedJobs()}
                          size="sm"
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : savedJobs.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
                        <h3 className="text-lg font-medium mb-1">
                          No saved jobs yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Save jobs you&apos;re interested in to view them later
                        </p>
                        <Button asChild>
                          <Link href="/">Browse Jobs</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {savedJobs.map((savedJob: {
                          id: number | string;
                          attributes: {
                            job: {
                              data: {
                                id: number | string;
                                attributes: {
                                  Title?: string;
                                  slug?: string;
                                  location?: string;
                                  skills?: {
                                    data: Array<{id: number | string; attributes: {name: string}}>;
                                  };
                                  company?: {
                                    data: {
                                      attributes: {
                                        name: string;
                                      }
                                    }
                                  };
                                };
                              };
                            };
                            createdAt: string;
                          };
                        }) => {
                          const job = savedJob.attributes.job?.data?.attributes;
                          const company = job?.company?.data?.attributes;

                          return (
                            <div
                              key={savedJob.id}
                              className="flex flex-col border rounded-md p-4"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">
                                    <Link
                                      href={`/jobs/${
                                        job?.slug ||
                                        savedJob.attributes.job.data.id
                                      }`}
                                      className="hover:underline"
                                    >
                                      {job?.Title || 'Job Listing'}
                                    </Link>
                                  </h3>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5 mr-1" />
                                    <span>{company?.name || 'Company'}</span>
                                    {job?.location && (
                                      <>
                                        <span className="mx-1.5">•</span>
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        <span>{job.location}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="mt-2">
                                    {job?.skills?.data
                                      ?.slice(0, 3)
                                      .map((skill: { id: number | string; attributes: { name: string } }) => (
                                        <span
                                          key={skill.id}
                                          className="inline-block mr-1.5 mb-1.5 px-2 py-0.5 bg-muted text-xs rounded-md"
                                        >
                                          {skill.attributes.name}
                                        </span>
                                      ))}
                                    {(job?.skills?.data?.length || 0) > 3 && (
                                      <span className="inline-block mb-1.5 text-xs text-muted-foreground">
                                        +{(job?.skills?.data?.length || 0) - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-xs text-muted-foreground">
                                    Saved{' '}
                                    {formatRelativeDate(
                                      savedJob.attributes.createdAt
                                    )}
                                  </div>
                                  <div className="mt-auto pt-2 flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/jobs/${
                                          job?.slug ||
                                          savedJob.attributes.job.data.id
                                        }`}
                                      >
                                        View Job
                                      </Link>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveSavedJob(savedJob.id)
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
