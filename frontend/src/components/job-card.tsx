import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Job } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: number;
    attributes?: Job;
    // Add fields for flat structure
    Title?: string;
    slug?: string;
    Description?: any[];
    location?: string;
    isRemote?: boolean;
    company?: any;
    jobType?: string;
    salaryRange?: any;
    skills?: any;
    tags?: any;
    publishedAt?: string;
    documentId?: string;
  };
}

// Define types for rich text blocks
interface RichTextBlock {
  type: string;
  children?: RichTextChild[];
  format?: string;
  level?: number;
}

interface RichTextChild {
  type: string;
  text?: string;
  children?: RichTextChild[];
  bold?: boolean;
}

interface SkillData {
  id: number;
  attributes: {
    name: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  // If job is undefined, we can't render the card
  if (!job) return null;
  
  // Handle both nested and flat data structures
  const jobData = job.attributes || job;
  
  const {
    Title,
    slug,
    Description,
    location,
    isRemote,
    company,
    jobType,
    salaryRange,
    skills,
    publishedAt,
  } = jobData;
  
  // Extract company name - handle both data structures
  const companyName = company?.data?.attributes?.name || company?.name || "Company";
  
  // Format salary range
  const formattedSalary = salaryRange ? 
    `${salaryRange.currency || '₹'}${salaryRange.min || 'N/A'}${salaryRange.max ? ` - ${salaryRange.currency || '₹'}${salaryRange.max}k` : ''}` : 
    "Salary not specified";
    
  // Get job type display name
  const jobTypeDisplay = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance"
  }[jobType || ""] || jobType || "Not specified";
  
  // Get skills for display (limit to 3)
  const displaySkills = skills?.data?.slice(0, 3).map((skill: SkillData) => skill.attributes.name) || [];
  
  // Extract description text from rich text format and convert to a single line
  const getDescriptionText = () => {
    if (!Description || Description.length === 0) return "No description provided.";
    
    // Flatten all content from the rich text format into a single string
    let fullText = "";
    
    // Process different rich text block types
    Description.forEach((block: RichTextBlock) => {
      // Handle paragraph blocks
      if (block.type === 'paragraph' && block.children) {
        block.children.forEach((child: RichTextChild) => {
          if (child.text) fullText += child.text + " ";
        });
      }
      // Handle heading blocks
      else if (block.type?.startsWith('heading') && block.children) {
        block.children.forEach((child: RichTextChild) => {
          if (child.text) fullText += child.text + " ";
        });
      }
      // Handle list blocks
      else if (block.type === 'list' && block.children) {
        block.children.forEach((listItem: RichTextChild) => {
          if (listItem.children) {
            listItem.children.forEach((child: RichTextChild) => {
              if (child.text) fullText += child.text + " ";
            });
          }
        });
      }
    });
    
    // Clean up by removing extra spaces, line breaks, etc.
    fullText = fullText.replace(/\s+/g, ' ').trim();
    
    // Truncate to a reasonable length for card display (150 chars)
    return fullText.length > 150 ? `${fullText.substring(0, 150)}...` : fullText;
  };
  
  return (
    <Link href={`/jobs/${slug || job.id}`} className="block">
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-1">
              <h3 className="font-semibold">{Title || "Untitled Job"}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{companyName}</span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{isRemote ? `${location || "Remote"} (Remote)` : (location || "No location")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {getDescriptionText()}
          </div>
        </CardContent>
        <CardFooter className="flex items-center border-t bg-muted/50 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="rounded-md bg-background px-2 py-1">
              {jobTypeDisplay}
            </div>
            <div className="rounded-md bg-background px-2 py-1">
              {formattedSalary}
            </div>
            {displaySkills.map((skill: string, i: number) => (
              <div key={i} className="rounded-md bg-background px-2 py-1">
                {skill}
              </div>
            ))}
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            Posted {formatRelativeDate(publishedAt || "")}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}