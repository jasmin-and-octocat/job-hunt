"use client";

import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSimilarJobs } from "@/lib/hooks";
import { formatRelativeDate } from "@/lib/utils";

interface SimilarJobsProps {
  jobId: number;
  limit?: number;
}

export function SimilarJobs({ jobId, limit = 3 }: SimilarJobsProps) {
  const { jobs, error, isLoading } = useSimilarJobs(jobId, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">
            Failed to load similar jobs
          </div>
        )}

        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No similar jobs found
          </div>
        )}

        {!isLoading &&
          !error &&
          jobs.map((job, index) => (
            <div key={job.id}>
              <Link href={`/jobs/${job.attributes.slug}`} className="block">
                <div className="space-y-2 hover:opacity-80">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{job.attributes.Title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>
                          {job.attributes.company?.data?.attributes?.name ||
                            "Company"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>
                          {job.attributes.isRemote
                            ? `${job.attributes.location || "Remote"} (Remote)`
                            : job.attributes.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      <Briefcase className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.attributes.salaryRange && (
                      <div className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                        {job.attributes.salaryRange.currency || "₹"}
                        {job.attributes.salaryRange.min}k - {job.attributes.salaryRange.currency || "₹"}
                        {job.attributes.salaryRange.max}k
                      </div>
                    )}
                    <div className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                      {job.attributes.jobType === "full_time"
                        ? "Full-time"
                        : job.attributes.jobType === "part_time"
                        ? "Part-time"
                        : job.attributes.jobType === "contract"
                        ? "Contract"
                        : job.attributes.jobType === "internship"
                        ? "Internship"
                        : job.attributes.jobType}
                    </div>
                    {job.attributes.publishedAt && (
                      <div className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                        {formatRelativeDate(job.attributes.publishedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              {index < jobs.length - 1 && <Separator className="my-4" />}
            </div>
          ))}

        <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
          View all similar jobs
        </Link>
      </CardContent>
    </Card>
  );
}

