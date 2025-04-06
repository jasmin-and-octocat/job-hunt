// Common Strapi response types
export interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

// Company related types
export interface Company {
  name: string;
  logo?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  description?: string;
  website?: string;
  location?: string;
  industry?: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    };
  };
  jobs?: {
    data: Array<{
      id: number;
      attributes: Job;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanySearchParams {
  name?: string;
  location?: string;
  industry?: string[];
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

// Job related types
export interface Job {
  Title: string;
  slug: string;
  Description: any; // Strapi blocks content
  responsibilities: any;
  requirements: any;
  benefits: any;
  location: string;
  isRemote: boolean;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  datePosted: string;
  applicationDeadline: string;
  jobStatus: 'draft' | 'published' | 'closed' | 'filled';
  eligibilityCriteria: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  company: {
    data: {
      id: number;
      attributes: Company;
    }
  };
  skills: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
      };
    }>;
  };
  tags: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
      };
    }>;
  };
}

export interface JobSearchParams {
  title?: string;
  location?: string;
  remoteOnly?: boolean;
  jobType?: string[];
  experienceLevel?: string[];
  skills?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface JobFiltersState {
  jobType: string[];
  experienceLevel: string[];
  remoteOnly: boolean;
  salary: {
    min: number;
    max: number;
  };
  skills: string[];
}

// Application related types
export interface JobApplication {
  coverLetter: string;
  resume: {
    data: {
      id: number;
      attributes: {
        url: string;
        name: string;
      };
    };
  };
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applicationDate: string;
  applicant: {
    data: {
      id: number;
      attributes: any;
    };
  };
  job: {
    data: {
      id: number;
      attributes: Job;
    };
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User profile types
export interface JobSeekerProfile {
  firstName: string;
  lastName: string;
  headline?: string;
  about?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  skills: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
      };
    }>;
  };
  education: {
    data: Array<{
      id: number;
      attributes: Education;
    }>;
  };
  experience: {
    data: Array<{
      id: number;
      attributes: Experience;
    }>;
  };
  certifications?: {
    data: Array<{
      id: number;
      attributes: Certification;
    }>;
  };
  resumeFile?: {
    data: {
      attributes: {
        url: string;
        name: string;
      };
    };
  };
  profilePicture?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  user: {
    data: {
      id: number;
    };
  };
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentEducation: boolean;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  isRemote?: boolean;
  startDate: string;
  endDate?: string;
  isCurrentPosition: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  name: string;
  category?: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  name: string;
  query: string;
  filters: JobSearchParams;
  user: {
    data: {
      id: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  content: any; // Can be blocks format or string
  isRead: boolean;
  users_permissions_user?: {
    data: {
      id: number;
    };
  };
  job?: {
    data: {
      id: number;
      attributes: Job;
    };
  };
  job_application?: {
    data: {
      id: number;
      attributes: JobApplication;
    };
  };
  createdAt: string;
  updatedAt: string;
}