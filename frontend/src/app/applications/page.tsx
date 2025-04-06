"use client";

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Building2, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/header';
import { jobsApi } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 1;

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch user's job applications
  const { data, error, isLoading, mutate } = useSWR(
    '/api/applications',
    () => jobsApi.getUserApplications(MOCK_USER_ID),
    {
      revalidateOnFocus: false,
    }
  );
  
  // Status badge styles based on application status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case 'reviewed':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case 'interview':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
      case 'rejected':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      case 'accepted':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Format status label
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter applications based on active tab
  const filteredApplications = data?.data.filter(application => {
    if (activeTab === "all") return true;
    return application.attributes.status === activeTab;
  }) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
            <p className="text-muted-foreground">
              Track and manage your job applications
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-5 w-full md:w-[600px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="company">Company Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 mb-4">Failed to load your applications</p>
                <Button onClick={() => mutate()}>Try Again</Button>
              </CardContent>
            </Card>
          )}

          {/* No applications yet */}
          {!isLoading && !error && filteredApplications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-muted-foreground mb-4">
                  {activeTab === "all" 
                    ? "You haven't submitted any job applications yet." 
                    : `You don't have any ${activeTab} applications.`}
                </p>
                <Button asChild>
                  <Link href="/">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Applications list */}
          {!isLoading && !error && filteredApplications.length > 0 && (
            <div className="grid gap-6">
              {filteredApplications.map((application) => {
                const job = application.attributes.job?.data?.attributes;
                const company = job?.company?.data?.attributes;
                return (
                  <Card key={application.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <CardTitle className="text-xl">
                            <Link 
                              href={`/jobs/${job?.slug || application.attributes.job?.data?.id}`}
                              className="hover:underline"
                            >
                              {job?.Title || "Job Listing"}
                            </Link>
                          </CardTitle>
                          <div className="text-muted-foreground flex items-center mt-1">
                            <Building2 className="mr-1 h-4 w-4" />
                            {company?.name || "Company"}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getStatusBadgeClass(application.attributes.status)}`}>
                            {formatStatus(application.attributes.status)}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Applied {formatRelativeDate(application.attributes.applicationDate)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <div className="text-sm font-medium">Position</div>
                            <div className="text-sm text-muted-foreground">
                              {job?.jobType === 'full_time' ? 'Full-time' : 
                               job?.jobType === 'part_time' ? 'Part-time' :
                               job?.jobType === 'contract' ? 'Contract' :
                               job?.jobType === 'internship' ? 'Internship' :
                               job?.jobType === 'freelance' ? 'Freelance' :
                               job?.jobType || 'Not specified'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Location</div>
                            <div className="text-sm text-muted-foreground">
                              {job?.isRemote ? `Remote${job?.location ? ` (${job.location})` : ''}` : job?.location || 'Not specified'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Resume</div>
                            <div className="text-sm text-muted-foreground">
                              {application.attributes.resume?.data ? (
                                <a 
                                  href={application.attributes.resume.data.attributes.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {application.attributes.resume.data.attributes.name || 'View Resume'}
                                </a>
                              ) : (
                                'Not available'
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Last Updated</div>
                            <div className="text-sm text-muted-foreground">
                              {formatRelativeDate(application.attributes.updatedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${job?.slug || application.attributes.job?.data?.id}`}>
                              View Job
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/applications/${application.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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

