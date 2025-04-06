"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import { SimilarJobs } from '@/components/similar-jobs';
import { useJobDetails, useCompanyDetails } from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import { userApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Get job ID or slug from URL params
  const jobIdOrSlug = params.id;
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch job details
  const { job, error: jobError, isLoading: isJobLoading } = useJobDetails(jobIdOrSlug);
  
  // Fetch company details if job data is available
  const companyId = job?.attributes?.company?.data?.id;
  const { company, error: companyError, isLoading: isCompanyLoading } = 
    useCompanyDetails(companyId || null);

  // Function to save job
  const handleSaveJob = async () => {
    // This is a placeholder - in a real app, you would get the user ID from auth context
    const userId = 1; // Replace with actual user ID from auth
    
    try {
      setIsSaving(true);
      await userApi.saveJob(userId, Number(jobIdOrSlug));
      setIsSaved(true);
      toast({
        title: "Job saved",
        description: "This job has been added to your saved jobs",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
      console.error('Error saving job:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle loading state
  if (isJobLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-6 md:px-6 md:py-12">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to jobs
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-6 animate-pulse">
                    <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-6 animate-pulse">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-muted rounded w-full"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6 animate-pulse">
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 JobHunt. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Handle error state
  if (jobError || !job) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-6 md:px-6 md:py-12">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to jobs
              </Link>
            </div>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Job not found</h2>
              <p className="mb-8 text-muted-foreground">
                The job listing you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/">Browse all jobs</Link>
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 JobHunt. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Get job data
  const {
    Title,
    Description,
    responsibilities,
    requirements,
    benefits,
    location,
    isRemote,
    salaryRange,
    jobType,
    datePosted,
    skills,
    publishedAt,
  } = job.attributes;

  // Format job type display
  const formatJobType = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Full-time';
      case 'part_time':
        return 'Part-time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      case 'freelance':
        return 'Freelance';
      default:
        return type;
    }
  };

  // Format salary display
  const formatSalary = (salary: { min?: number; max?: number; currency?: string } | null | undefined) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency || '₹'}${salary.min}k - ${salary.currency || '₹'}${salary.max}k`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <Card>
                <CardHeader className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">{Title}</CardTitle>
                      <CardDescription className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{job.attributes.company?.data?.attributes?.name || 'Company'}</span>
                        </div>
                        <span className="hidden sm:inline-block">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{isRemote ? `${location} (Remote)` : location}</span>
                        </div>
                        <span className="hidden sm:inline-block">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Posted {formatRelativeDate(datePosted || publishedAt)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-row gap-2 sm:flex-col">
                      <Button asChild className="flex-1">
                        <Link href={`/jobs/${params.id}/apply`}>Apply Now</Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSaveJob}
                          disabled={isSaved || isSaving}
                          title={isSaved ? "Job saved" : "Save job"}
                        >
                          {isSaved ? 
                            <BookmarkCheck className="h-4 w-4" /> : 
                            <Bookmark className="h-4 w-4" />
                          }
                          <span className="sr-only">{isSaved ? "Saved" : "Save job"}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                              title: "Link copied",
                              description: "Job link copied to clipboard",
                            });
                          }}
                          title="Share job"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="rounded-md bg-muted px-2.5 py-1 text-sm">
                      {formatJobType(jobType)}
                    </div>
                    <div className="rounded-md bg-muted px-2.5 py-1 text-sm">
                      {formatSalary(salaryRange)}
                    </div>
                    {/* Display skills tags */}
                    {skills?.data?.slice(0, 5).map((skill: { id: number; attributes: { name: string } }) => (
                      <div
                        key={skill.id}
                        className="rounded-md bg-muted px-2.5 py-1 text-sm"
                      >
                        {skill.attributes.name}
                      </div>
                    ))}
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    {/* Description */}
                    <h3>About the Role</h3>
                    <div dangerouslySetInnerHTML={{ 
                      __html: Description ? 
                        Description.map((block: { 
                          type: string; 
                          children?: { text: string }[] 
                        }) => {
                          if (block.type === 'paragraph' && block.children && block.children.length > 0) {
                            return `<p>${block.children.map((child) => child.text).join('')}</p>`;
                          }
                          return '';
                        }).join('') 
                        : '<p>No description provided.</p>' 
                    }} />

                    {/* Responsibilities */}
                    {responsibilities && (
                      <>
                        <h3>Responsibilities</h3>
                        <div dangerouslySetInnerHTML={{ 
                          __html: responsibilities.map((block: {
                            type: string;
                            children?: { 
                              children?: { text: string }[];
                              text?: string;
                            }[]
                          }) => {
                            if (block.type === 'list' && block.children) {
                              return `<ul>${block.children.map((item) => 
                                `<li>${item.children?.map((child) => child.text).join('') || ''}</li>`
                              ).join('')}</ul>`;
                            } else if (block.type === 'paragraph' && block.children) {
                              return `<p>${block.children.map((child) => child.text).join('')}</p>`;
                            }
                            return '';
                          }).join('') 
                        }} />
                      </>
                    )}

                    {/* Requirements */}
                    {requirements && (
                      <>
                        <h3>Requirements</h3>
                        <div dangerouslySetInnerHTML={{ 
                          __html: requirements.map((block: {
                            type: string;
                            children?: { 
                              children?: { text: string }[];
                              text?: string;
                            }[]
                          }) => {
                            if (block.type === 'list' && block.children) {
                              return `<ul>${block.children.map((item) => 
                                `<li>${item.children?.map((child) => child.text).join('') || ''}</li>`
                              ).join('')}</ul>`;
                            } else if (block.type === 'paragraph' && block.children) {
                              return `<p>${block.children.map((child) => child.text).join('')}</p>`;
                            }
                            return '';
                          }).join('') 
                        }} />
                      </>
                    )}

                    {/* Benefits */}
                    {benefits && (
                      <>
                        <h3>Benefits</h3>
                        <div dangerouslySetInnerHTML={{ 
                          __html: benefits.map((block: {
                            type: string;
                            children?: { 
                              children?: { text: string }[];
                              text?: string;
                            }[]
                          }) => {
                            if (block.type === 'list' && block.children) {
                              return `<ul>${block.children.map((item) => 
                                `<li>${item.children?.map((child) => child.text).join('') || ''}</li>`
                              ).join('')}</ul>`;
                            } else if (block.type === 'paragraph' && block.children) {
                              return `<p>${block.children.map((child) => child.text).join('')}</p>`;
                            }
                            return '';
                          }).join('') 
                        }} />
                      </>
                    )}

                    {/* Company Information */}
                    {company?.attributes?.description && (
                      <>
                        <h3>About {company.attributes.name}</h3>
                        <p>{company.attributes.description}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Application section */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Apply</CardTitle>
                  <CardDescription>
                    Please submit your resume and a cover letter explaining why
                    you are interested in this position.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-start">
                  <Button size="lg" asChild>
                    <Link href={`/jobs/${params.id}/apply`}>Apply for this position</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar with company info and similar jobs */}
            <div className="space-y-6">
              {/* Company information card */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCompanyLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-12 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  ) : companyError || !company ? (
                    <div className="text-sm text-muted-foreground">
                      Company information not available
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          {company.attributes.logo?.data ? (
                            <Image 
                              src={company.attributes.logo.data.attributes.url} 
                              alt={company.attributes.name}
                              className="object-contain"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <Briefcase className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.attributes.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {company.attributes.industry?.data?.attributes?.name || 'Technology'}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      
                      {company.attributes.website && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Website</h4>
                          <p className="text-sm text-muted-foreground">
                            <a 
                              href={company.attributes.website.startsWith('http') ? 
                                company.attributes.website : 
                                `https://${company.attributes.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {company.attributes.website}
                            </a>
                          </p>
                        </div>
                      )}

                      {company.attributes.location && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Location</h4>
                          <p className="text-sm text-muted-foreground">
                            {company.attributes.location}
                          </p>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/companies/${company.id}`}>View Company Profile</Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Similar jobs component */}
              {job && <SimilarJobs jobId={job.id} limit={3} />}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 JobHunt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
