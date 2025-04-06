'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { userApi } from '@/lib/api';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface Skill {
  id: number;
  attributes: {
    name: string;
  };
}

interface Company {
  data: {
    attributes: {
      name: string;
    };
  };
}

interface Job {
  data: {
    id: number;
    attributes: {
      title: string;
      location: string;
      jobType: string;
      experienceLevel: string;
      company: Company;
      skills?: {
        data?: Skill[];
      };
    };
  };
}

interface SavedJob {
  id: number;
  attributes: {
    createdAt: string;
    job: Job;
  };
}

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock user ID for demonstration - in a real app, this would come from auth
  const userId = 1;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const response = await userApi.getSavedJobs(userId);
        setSavedJobs(response.data || []);
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load saved jobs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [toast]);

  const handleRemoveJob = async (savedJobId: number) => {
    try {
      await userApi.removeJob(savedJobId);
      // Update UI after removing job
      setSavedJobs(savedJobs.filter((job) => job.id !== savedJobId));
      toast({
        title: 'Success',
        description: 'Job removed from saved jobs',
      });
    } catch (error) {
      console.error('Failed to remove job:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove job. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="grid gap-4">
          {savedJobs.map((savedJob) => {
            const job = savedJob.attributes.job.data.attributes;
            const company = job.company.data.attributes;

            return (
              <Card key={savedJob.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      <Link
                        href={`/jobs/${savedJob.attributes.job.data.id}`}
                        className="hover:text-primary"
                      >
                        {job.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {company.name} • {job.location}
                    </p>

                    <div className="mt-3">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {job.jobType}
                      </span>
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-700">
                        Saved on{' '}
                        {new Date(
                          savedJob.attributes.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveJob(savedJob.id)}
                      className="mr-2"
                    >
                      Remove
                    </Button>
                    <Link href={`/jobs/${savedJob.attributes.job.data.id}`}>
                      <Button>View Job</Button>
                    </Link>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills?.data?.map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                    >
                      {skill.attributes.name}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No saved jobs found</h3>
          <p className="text-gray-600 mb-6">
            Start saving jobs you&apos;re interested in to view them here later.
          </p>
          <Link href="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
