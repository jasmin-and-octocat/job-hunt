import { API_URL } from './utils';
import { JobSearchParams, StrapiResponse, Job, CompanySearchParams } from './types';
import { getAuthHeader } from './auth';

// Helper to build query parameters for Strapi filters
function buildStrapiQuery(params: JobSearchParams): string {
  const queryParams: string[] = [];
  
  // Add pagination
  queryParams.push(`pagination[page]=${params.page || 1}`);
  queryParams.push(`pagination[pageSize]=${params.pageSize || 10}`);
  
  // Add filters
  if (params.title) {
    queryParams.push(`filters[Title][$containsi]=${encodeURIComponent(params.title)}`);
  }
  
  if (params.location) {
    queryParams.push(`filters[location][$containsi]=${encodeURIComponent(params.location)}`);
  }
  
  if (params.remoteOnly) {
    queryParams.push('filters[isRemote][$eq]=true');
  }
  
  if (params.jobType && params.jobType.length > 0) {
    const jobTypeFilters = params.jobType.map(type => 
      `filters[jobType][$eq]=${encodeURIComponent(type)}`
    ).join('&');
    queryParams.push(jobTypeFilters);
  }
  
  if (params.experienceLevel && params.experienceLevel.length > 0) {
    const expFilters = params.experienceLevel.map(level => 
      `filters[experience][$eq]=${encodeURIComponent(level)}`
    ).join('&');
    queryParams.push(expFilters);
  }
  
  if (params.skills && params.skills.length > 0) {
    params.skills.forEach(skill => {
      queryParams.push(`filters[skills][name][$containsi]=${encodeURIComponent(skill)}`);
    });
  }
  
  if (params.salary?.min) {
    queryParams.push(`filters[salaryRange][min][$gte]=${params.salary.min}`);
  }
  
  if (params.salary?.max) {
    queryParams.push(`filters[salaryRange][max][$lte]=${params.salary.max}`);
  }

  if (params.companyId) {
    queryParams.push(`filters[company][id][$eq]=${params.companyId}`);
  }
  
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach(category => {
      queryParams.push(`filters[categories][id][$eq]=${category}`);
    });
  }
  
  // Published jobs only
  queryParams.push('filters[jobStatus][$eq]=published');
  
  // Add sort
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'recent':
        queryParams.push('sort=datePosted:desc');
        break;
      case 'oldest':
        queryParams.push('sort=datePosted:asc');
        break;
      case 'salary-high':
        queryParams.push('sort=salaryRange.max:desc');
        break;
      case 'salary-low':
        queryParams.push('sort=salaryRange.min:asc');
        break;
      default:
        queryParams.push('sort=datePosted:desc');
    }
  } else {
    queryParams.push('sort=datePosted:desc');
  }
  
  // Add population for company, skills, and tags using the correct Strapi v4 format
  queryParams.push('populate[0]=company');
  queryParams.push('populate[1]=skills');
  queryParams.push('populate[2]=tags');
  
  return queryParams.join('&');
}

// Helper to build company query parameters
function buildCompanyQuery(params: CompanySearchParams): string {
  const queryParams: string[] = [];
  
  // Add pagination
  queryParams.push(`pagination[page]=${params.page || 1}`);
  queryParams.push(`pagination[pageSize]=${params.pageSize || 10}`);
  
  // Add filters
  if (params.name) {
    queryParams.push(`filters[name][$containsi]=${encodeURIComponent(params.name)}`);
  }
  
  if (params.location) {
    queryParams.push(`filters[location][$containsi]=${encodeURIComponent(params.location)}`);
  }
  
  if (params.industry && params.industry.length > 0) {
    params.industry.forEach(ind => {
      queryParams.push(`filters[industry][name][$eq]=${encodeURIComponent(ind)}`);
    });
  }
  
  // Add sort
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'name-asc':
        queryParams.push('sort=name:asc');
        break;
      case 'name-desc':
        queryParams.push('sort=name:desc');
        break;
      case 'recent':
        queryParams.push('sort=createdAt:desc');
        break;
      case 'jobs-count':
        queryParams.push('sort=jobs.count:desc');
        break;
      default:
        queryParams.push('sort=name:asc');
    }
  } else {
    queryParams.push('sort=name:asc');
  }
  
  // Add population using the correct Strapi v4 format
  queryParams.push('populate[0]=logo');
  queryParams.push('populate[1]=industry');
  queryParams.push('populate[2]=jobs');
  
  return queryParams.join('&');
}

// Skills and categories helpers
function buildSkillsQuery(params: any = {}): string {
  const queryParams: string[] = [];
  
  // Add pagination
  queryParams.push(`pagination[page]=${params.page || 1}`);
  queryParams.push(`pagination[pageSize]=${params.pageSize || 50}`);
  
  // Add filters
  if (params.name) {
    queryParams.push(`filters[name][$containsi]=${encodeURIComponent(params.name)}`);
  }
  
  if (params.category) {
    queryParams.push(`filters[category][id][$eq]=${params.category}`);
  }
  
  // Add sort
  queryParams.push('sort=name:asc');
  
  // Add category population using the correct format
  queryParams.push('populate[0]=category');
  
  return queryParams.join('&');
}

export const notificationsApi = {
  // Get user notifications
  getUserNotifications: async (userId: number, page = 1, pageSize = 10, onlyUnread = false): Promise<any> => {
    const queryParams = [
      `filters[users_permissions_user][id][$eq]=${userId}`,
      `pagination[page]=${page}`,
      `pagination[pageSize]=${pageSize}`,
      `sort=createdAt:desc`,
      `populate[0]=job`,
      `populate[1]=job_application`
    ];
    
    // Add filter for unread notifications if requested
    if (onlyUnread) {
      queryParams.push('filters[isRead][$eq]=false');
    }
    
    const response = await fetch(`${API_URL}/api/notifications?${queryParams.join('&')}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    return response.json();
  },
  
  // Get unread notification count
  getUnreadCount: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/notifications/count?filters[users_permissions_user][id][$eq]=${userId}&filters[isRead][$eq]=false`,
      {
        headers: {
          ...getAuthHeader()
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread notification count');
    }
    
    return response.json();
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          isRead: true
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    
    return response.json();
  },
  
  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
    
    return response.json();
  },
  
  // Delete a notification
  deleteNotification: async (notificationId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
    
    return response.json();
  }
};

export const jobsApi = {
  // Get all jobs with pagination and optional filters
  getJobs: async (params: JobSearchParams = {}): Promise<StrapiResponse<Job>> => {
    const queryString = buildStrapiQuery(params);
    const response = await fetch(`${API_URL}/api/jobs?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return response.json();
  },
  
  // Get a single job by ID or slug
  getJob: async (identifier: string | number): Promise<any> => {
    // Check if identifier is a number (ID) or string (slug)
    const isId = !isNaN(Number(identifier));
    
    // Build populate params using the correct Strapi v4 format
    const populateParams = [
      'populate[0]=company',
      'populate[1]=company.logo', 
      'populate[2]=skills',
      'populate[3]=tags',
      'populate[4]=responsibilities',
      'populate[5]=requirements',
      'populate[6]=benefits'
    ].join('&');
    
    const endpoint = isId 
      ? `${API_URL}/api/jobs/${identifier}?${populateParams}` 
      : `${API_URL}/api/jobs?filters[slug][$eq]=${identifier}&${populateParams}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }
    
    const data = await response.json();
    
    // If we queried by slug, we need to return the first item
    if (!isId && data.data && Array.isArray(data.data)) {
      return { data: data.data[0], meta: data.meta };
    }
    
    return data;
  },
  
  // Get similar jobs based on job ID, skills, or tags
  getSimilarJobs: async (jobId: number, limit = 5): Promise<StrapiResponse<Job>> => {
    // First fetch the job to get its skills and tags
    const jobResponse = await fetch(`${API_URL}/api/jobs/${jobId}?populate[0]=skills&populate[1]=tags`);
    
    if (!jobResponse.ok) {
      throw new Error('Failed to fetch job details for similar jobs');
    }
    
    const jobData = await jobResponse.json();
    const job = jobData.data;
    
    let queryParams: string[] = [
      `filters[id][$ne]=${jobId}`,
      `pagination[pageSize]=${limit}`,
      'populate[0]=company',
      'populate[1]=skills',
      'populate[2]=tags',
      'sort=datePosted:desc'
    ];
    
    // Add skill-based filtering if the job has skills
    if (job.attributes.skills?.data?.length > 0) {
      const skillIds = job.attributes.skills.data.map((skill: any) => skill.id);
      const skillParams = skillIds.map((id: number) => `filters[skills][id][$eq]=${id}`);
      queryParams = queryParams.concat(skillParams);
    }
    
    const response = await fetch(`${API_URL}/api/jobs?${queryParams.join('&')}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch similar jobs');
    }
    
    return response.json();
  },
  
  // Get popular job categories/tags
  getPopularTags: async (limit = 10): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/tags?pagination[pageSize]=${limit}&sort=jobs.count:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular job tags');
    }
    
    return response.json();
  },
  
  // Submit a job application
  submitApplication: async (jobId: number, applicationData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/job-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: {
          ...applicationData,
          job: jobId,
          applicationDate: new Date().toISOString(),
          status: 'pending'
        } 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }
    
    return response.json();
  },
  
  // Get job applications for a user
  getUserApplications: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/job-applications?filters[applicant][id][$eq]=${userId}&populate=job,job.company,resume&sort=applicationDate:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch user applications');
    }
    
    return response.json();
  },
  
  // Get details of a specific application
  getApplicationDetails: async (applicationId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/job-applications/${applicationId}?populate=job,job.company,job.skills,resume`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch application details');
    }
    
    return response.json();
  },
  
  // Update application status (e.g., withdrawn by applicant)
  updateApplicationStatus: async (applicationId: number, status: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/job-applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          status
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update application status');
    }
    
    return response.json();
  },
  
  // Get featured/premium job listings
  getFeaturedJobs: async (limit = 5): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/jobs?filters[featured][$eq]=true&pagination[pageSize]=${limit}&populate[0]=company&populate[1]=skills&sort=datePosted:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured jobs');
    }
    
    return response.json();
  },
  
  // Search jobs by skill matching
  searchJobsBySkills: async (skillIds: number[], limit = 10): Promise<any> => {
    const skillParams = skillIds.map(id => `filters[skills][id][$eq]=${id}`).join('&');
    const response = await fetch(
      `${API_URL}/api/jobs?${skillParams}&pagination[pageSize]=${limit}&populate[0]=company&populate[1]=skills&sort=datePosted:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs by skills');
    }
    
    return response.json();
  },
  
  // Get job statistics (for dashboard)
  getJobStatistics: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/api/jobs/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job statistics');
    }
    
    return response.json();
  }
};

export const companiesApi = {
  // Get all companies with pagination and filters
  getCompanies: async (params: CompanySearchParams = {}): Promise<any> => {
    const queryString = buildCompanyQuery(params);
    const response = await fetch(`${API_URL}/api/companies?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    
    return response.json();
  },
  
  // Get a single company by ID
  getCompany: async (id: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/companies/${id}?populate[0]=logo&populate[1]=industry&populate[2]=jobs&populate[3]=jobs.skills&populate[4]=jobs.tags`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }
    
    return response.json();
  },
  
  // Get company jobs
  getCompanyJobs: async (companyId: number, page = 1, pageSize = 5): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/jobs?filters[company][id][$eq]=${companyId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[0]=skills&populate[1]=tags&sort=datePosted:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch company jobs');
    }
    
    return response.json();
  },
  
  // Get trending companies (companies with most job postings)
  getTrendingCompanies: async (limit = 5): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/companies?pagination[pageSize]=${limit}&populate[0]=logo&sort=jobs.count:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending companies');
    }
    
    return response.json();
  },
  
  // Get company reviews
  getCompanyReviews: async (companyId: number, page = 1, pageSize = 5): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/reviews?filters[company][id][$eq]=${companyId}&pagination[page]=${page}&pagination[pageSize]==${pageSize}&sort=createdAt:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch company reviews');
    }
    
    return response.json();
  },
  
  // Submit company review
  submitCompanyReview: async (companyId: number, reviewData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...reviewData,
          company: companyId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit company review');
    }
    
    return response.json();
  },
  
  // Get company stats
  getCompanyStats: async (companyId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/companies/${companyId}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch company statistics');
    }
    
    return response.json();
  }
};

export const userApi = {
  // Get user profile
  getUserProfile: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/job-seeker-profiles/${userId}?populate[0]=skills&populate[1]=certifications&populate[2]=education&populate[3]=experience&populate[4]=resumeFile&populate[5]=user`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },
  
  // Update user profile
  updateUserProfile: async (userId: number, profileData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/job-seeker-profiles/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: profileData }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    return response.json();
  },
  
  // Save a job search
  saveJobSearch: async (userId: number, searchData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/saved-searches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: {
          ...searchData,
          user: userId
        } 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save search');
    }
    
    return response.json();
  },
  
  // Get saved job searches
  getSavedSearches: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/saved-searches?filters[user][id][$eq]=${userId}&sort=createdAt:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch saved searches');
    }
    
    return response.json();
  },
  
  // Save job to favorites
  saveJob: async (userId: number, jobId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/saved-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          user: userId,
          job: jobId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save job');
    }
    
    return response.json();
  },
  
  // Remove job from favorites
  removeJob: async (savedJobId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/saved-jobs/${savedJobId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove saved job');
    }
    
    return response.json();
  },
  
  // Get saved jobs
  getSavedJobs: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/saved-jobs?filters[user][id][$eq]=${userId}&populate[0]=job&populate[1]=job.company&populate[2]=job.skills&sort=createdAt:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch saved jobs');
    }
    
    return response.json();
  },
  
  // Add education
  addEducation: async (profileId: number, educationData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/educations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...educationData,
          profile: profileId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add education');
    }
    
    return response.json();
  },
  
  // Add experience
  addExperience: async (profileId: number, experienceData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...experienceData,
          profile: profileId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add experience');
    }
    
    return response.json();
  },
  
  // Add certification
  addCertification: async (profileId: number, certificationData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/api/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...certificationData,
          profile: profileId
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add certification');
    }
    
    return response.json();
  },
  
  // Get job recommendations based on user profile
  getJobRecommendations: async (userId: number, limit = 5): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/job-recommendations?userId=${userId}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch job recommendations');
    }
    
    return response.json();
  }
};

export const skillsApi = {
  // Get all skills with optional filters
  getSkills: async (params: any = {}): Promise<any> => {
    const queryString = buildSkillsQuery(params);
    const response = await fetch(`${API_URL}/api/skills?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    
    return response.json();
  },
  
  // Create a new skill
  createSkill: async (skillData: { name: string; slug?: string; skill_category?: number }): Promise<any> => {
    const response = await fetch(`${API_URL}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        data: skillData
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create skill');
    }
    
    return response.json();
  },
  
  // Get skill categories
  getSkillCategories: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/api/skill-categories?sort=name:asc`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch skill categories');
    }
    
    return response.json();
  },
  
  // Get popular skills (most used in job listings)
  getPopularSkills: async (limit = 20): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/skills?pagination[pageSize]=${limit}&sort=jobs.count:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular skills');
    }
    
    return response.json();
  }
};

export const industryApi = {
  // Get all industries
  getIndustries: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/api/industries?sort=name:asc`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch industries');
    }
    
    return response.json();
  }
};

export const notificationApi = {
  // Get user notifications with pagination
  getUserNotifications: async (userId: number, page = 1, pageSize = 10): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/notifications?filters[users_permissions_user][id][$eq]=${userId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=job,job.company,job_application&sort=createdAt:desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    return response.json();
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          isRead: true
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    
    return response.json();
  },
  
  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<any> => {
    // This would typically be a custom endpoint in your Strapi backend
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
    
    return response.json();
  },
  
  // Get unread notification count
  getUnreadCount: async (userId: number): Promise<any> => {
    const response = await fetch(
      `${API_URL}/api/notifications?filters[users_permissions_user][id][$eq]=${userId}&filters[isRead][$eq]=false&pagination[pageSize]=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread notification count');
    }
    
    const data = await response.json();
    return { count: data.meta.pagination.total };
  }
};