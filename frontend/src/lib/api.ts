import { API_URL, apiClient } from './utils';
import { JobSearchParams, StrapiResponse, Job, CompanySearchParams } from './types';
import { getAuthHeader } from './auth';
import axios from 'axios';

/**
 * Helper function to make authenticated requests
 * This ensures all API calls include the auth header if a token exists
 */
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Always include authentication header if available
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

// Helper to build query parameters for Strapi filters
function buildStrapiQuery(params: JobSearchParams): string {
  const queryParams: string[] = [];

  // Add pagination
  queryParams.push(`pagination[page]=${params.page || 1}`);
  queryParams.push(`pagination[pageSize]=${params.pageSize || 10}`);

  // Add search term
  if (params.searchTerm) {
    queryParams.push(`filters[$or][0][title][$containsi]=${encodeURIComponent(params.searchTerm)}`);
    queryParams.push(`filters[$or][1][description][$containsi]=${encodeURIComponent(params.searchTerm)}`);
  }

  // Add location filter
  if (params.location) {
    queryParams.push(`filters[location][$containsi]=${encodeURIComponent(params.location)}`);
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
    queryParams.push(`filters[skill_category][id][$eq]=${params.category}`);
  }

  // Add sort
  queryParams.push('sort=name:asc');

  // Add proper relationship population using the correct field name
  queryParams.push('populate[0]=skill_category');

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

    try {
      const response = await apiClient.get(`/api/notifications?${queryParams.join('&')}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  },

  // Get unread notification count
  getUnreadCount: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/notifications/count?filters[users_permissions_user][id][$eq]=${userId}&filters[isRead][$eq]=false`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error);
      // throw new Error('Failed to fetch unread notification count');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<any> => {
    try {
      const response = await apiClient.put(`/api/notifications/${notificationId}`, {
        data: {
          isRead: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/notifications/mark-all-read`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new Error('Failed to delete notification');
    }
  }
};

export const jobsApi = {
  // Get all jobs with pagination and optional filters
  getJobs: async (params: JobSearchParams = {}): Promise<StrapiResponse<Job>> => {
    const queryString = buildStrapiQuery(params);
    try {
      const response = await apiClient.get(`/api/jobs?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
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
      // 'populate[4]=responsibilities',
      // 'populate[5]=requirements',
      // 'populate[6]=benefits'
    ].join('&');

    const endpoint = isId
      ? `/api/jobs/${identifier}?${populateParams}`
      : `/api/jobs?filters[slug][$eq]=${identifier}&${populateParams}`;

    try {
      const response = await apiClient.get(endpoint);
      const data = response.data;

      // If we queried by slug, we need to return the first item
      if (!isId && data.data && Array.isArray(data.data)) {
        return { data: data.data[0], meta: data.meta };
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      throw new Error('Failed to fetch job details');
    }
  },

  // Get similar jobs based on job ID, skills, or tags
  getSimilarJobs: async (jobId: number, limit = 5): Promise<StrapiResponse<Job>> => {
    try {
      // First fetch the job to get its skills and tags
      const jobResponse = await apiClient.get(`/api/jobs/${jobId}?populate[0]=skills&populate[1]=tags`);
      const jobData = jobResponse.data;
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

      const response = await apiClient.get(`/api/jobs?${queryParams.join('&')}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch similar jobs:', error);
      throw new Error('Failed to fetch similar jobs');
    }
  },

  // Get popular job categories/tags
  getPopularTags: async (limit = 10): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/tags?pagination[pageSize]=${limit}&sort=jobs.count:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch popular job tags:', error);
      throw new Error('Failed to fetch popular job tags');
    }
  },

  // Submit a job application
  submitApplication: async (jobId: number, applicationData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/job-applications`, {
        data: {
          ...applicationData,
          job: jobId,
          applicationDate: new Date().toISOString(),
          status: 'pending'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      const message = error.response?.data?.error?.message || 'Failed to submit application';
      throw new Error(message);
    }
  },

  // Get job applications for a user
  getUserApplications: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/job-applications?filters[applicant][id][$eq]=${userId}&populate=job,job.company,resume&sort=applicationDate:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user applications:', error);
      throw new Error('Failed to fetch user applications');
    }
  },

  // Get details of a specific application
  getApplicationDetails: async (applicationId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/job-applications/${applicationId}?populate=job,job.company,job.skills,resume`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch application details:', error);
      throw new Error('Failed to fetch application details');
    }
  },

  // Update application status (e.g., withdrawn by applicant)
  updateApplicationStatus: async (applicationId: number, status: string): Promise<any> => {
    try {
      const response = await apiClient.put(`/api/job-applications/${applicationId}`, {
        data: {
          status
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update application status:', error);
      throw new Error('Failed to update application status');
    }
  },

  // Get featured/premium job listings
  getFeaturedJobs: async (limit = 5): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/jobs?filters[featured][$eq]=true&pagination[pageSize]=${limit}&populate[0]=company&populate[1]=skills&sort=datePosted:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured jobs:', error);
      throw new Error('Failed to fetch featured jobs');
    }
  },

  // Search jobs by skill matching
  searchJobsBySkills: async (skillIds: number[], limit = 10): Promise<any> => {
    try {
      const skillParams = skillIds.map(id => `filters[skills][id][$eq]=${id}`).join('&');
      const response = await apiClient.get(
        `/api/jobs?${skillParams}&pagination[pageSize]=${limit}&populate[0]=company&populate[1]=skills&sort=datePosted:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs by skills:', error);
      throw new Error('Failed to fetch jobs by skills');
    }
  },

  // Get job statistics (for dashboard)
  getJobStatistics: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/jobs/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job statistics:', error);
      throw new Error('Failed to fetch job statistics');
    }
  }
};

export const companiesApi = {
  // Get all companies with pagination and filters
  getCompanies: async (params: CompanySearchParams = {}): Promise<any> => {
    const queryString = buildCompanyQuery(params);
    try {
      const response = await apiClient.get(`/api/companies?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      throw new Error('Failed to fetch companies');
    }
  },

  // Get a single company by ID
  getCompany: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/companies/${id}?populate[0]=logo&populate[1]=industry&populate[2]=jobs&populate[3]=jobs.skills&populate[4]=jobs.tags`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company details:', error);
      throw new Error('Failed to fetch company details');
    }
  },

  // Get company jobs
  getCompanyJobs: async (companyId: number, page = 1, pageSize = 5): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/jobs?filters[company][id][$eq]=${companyId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[0]=skills&populate[1]=tags&sort=datePosted:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company jobs:', error);
      throw new Error('Failed to fetch company jobs');
    }
  },

  // Get trending companies (companies with most job postings)
  getTrendingCompanies: async (limit = 5): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/companies?pagination[pageSize]=${limit}&populate[0]=logo&sort=jobs.count:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending companies:', error);
      throw new Error('Failed to fetch trending companies');
    }
  },

  // Get company reviews
  getCompanyReviews: async (companyId: number, page = 1, pageSize = 5): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/reviews?filters[company][id][$eq]=${companyId}&pagination[page]=${page}&pagination[pageSize]==${pageSize}&sort=createdAt:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company reviews:', error);
      throw new Error('Failed to fetch company reviews');
    }
  },

  // Submit company review
  submitCompanyReview: async (companyId: number, reviewData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/reviews`, {
        data: {
          ...reviewData,
          company: companyId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit company review:', error);
      throw new Error('Failed to submit company review');
    }
  },

  // Get company stats
  getCompanyStats: async (companyId: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/companies/${companyId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company statistics:', error);
      throw new Error('Failed to fetch company statistics');
    }
  }
};

export const userApi = {
  // Get user profile
  getUserProfile: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/job-seeker-profiles/${userId}?populate[0]=skills&populate[1]=certifications&populate[2]=educations&populate[3]=experiences&populate[4]=resume&populate[5]=user`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (userId: number, profileData: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/api/job-seeker-profiles/${userId}`, {
        data: profileData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  // Save a job search
  saveJobSearch: async (userId: number, searchData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/saved-searches`, {
        data: {
          ...searchData,
          user: userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save search:', error);
      throw new Error('Failed to save search');
    }
  },

  // Get saved job searches
  getSavedSearches: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/saved-searches?filters[user][id][$eq]=${userId}&sort=createdAt:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch saved searches:', error);
      throw new Error('Failed to fetch saved searches');
    }
  },

  // Save job to favorites
  saveJob: async (userId: number, jobId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/saved-jobs`, {
        data: {
          user: userId,
          job: jobId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save job:', error);
      throw new Error('Failed to save job');
    }
  },

  // Remove job from favorites
  removeJob: async (savedJobId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/api/saved-jobs/${savedJobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove saved job:', error);
      throw new Error('Failed to remove saved job');
    }
  },

  // Get saved jobs
  getSavedJobs: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/saved-jobs?filters[user][id][$eq]=${userId}&populate[0]=job&populate[1]=job.company&populate[2]=job.skills&sort=createdAt:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      throw new Error('Failed to fetch saved jobs');
    }
  },

  // Add education
  addEducation: async (profileId: number, educationData: any): Promise<any> => {
    try {
      // Format dates to yyyy-MM-dd
      let startDate = educationData.startDate;
      let endDate = educationData.endDate;

      // Ensure dates are in the correct format (yyyy-MM-dd)
      if (startDate && !(typeof startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDate))) {
        const date = new Date(startDate);
        if (!isNaN(date.getTime())) {
          startDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      if (endDate && !(typeof endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
        const date = new Date(endDate);
        if (!isNaN(date.getTime())) {
          endDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      // Ensure only valid fields are included with properly formatted dates
      const validData = {
        institution: educationData.institution,
        degree: educationData.degree,
        fieldOfStudy: educationData.fieldOfStudy,
        startDate: startDate,
        endDate: endDate,
        isCurrentEducation: educationData.isCurrentEducation,
        description: educationData.description,
        job_seeker_profile: profileId
      };

      const response = await apiClient.post(`/api/educations`, {
        data: validData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add education:', error);
      throw new Error('Failed to add education');
    }
  },

  // Add experience
  addExperience: async (profileId: number, experienceData: any): Promise<any> => {
    try {
      // Format dates to yyyy-MM-dd
      let startDate = experienceData.startDate;
      let endDate = experienceData.endDate;

      // Ensure dates are in the correct format (yyyy-MM-dd)
      if (startDate && !(typeof startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDate))) {
        const date = new Date(startDate);
        if (!isNaN(date.getTime())) {
          startDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      if (endDate && !(typeof endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
        const date = new Date(endDate);
        if (!isNaN(date.getTime())) {
          endDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      // Ensure only valid fields are included with properly formatted dates
      const validData = {
        jobTitle: experienceData.jobTitle,
        companyName: experienceData.companyName,
        location: experienceData.location,
        startDate: startDate,
        endDate: endDate,
        isCurrentJob: experienceData.isCurrentJob,
        description: experienceData.description,
        job_seeker_profile: profileId
      };

      const response = await apiClient.post(`/api/experiences`, {
        data: validData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add experience:', error);
      throw new Error('Failed to add experience');
    }
  },

  // Add certification
  addCertification: async (profileId: number, certificationData: any): Promise<any> => {
    try {
      // Format dates to yyyy-MM-dd
      let issueDate = certificationData.issueDate;
      let expirationDate = certificationData.expirationDate;

      // Ensure dates are in the correct format (yyyy-MM-dd)
      if (issueDate && !(typeof issueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(issueDate))) {
        const date = new Date(issueDate);
        if (!isNaN(date.getTime())) {
          issueDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      if (expirationDate && !(typeof expirationDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(expirationDate))) {
        const date = new Date(expirationDate);
        if (!isNaN(date.getTime())) {
          expirationDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        }
      }

      // Ensure only valid fields are included with properly formatted dates
      const validData = {
        name: certificationData.name,
        issuingOrganization: certificationData.issuingOrganization,
        issueDate: issueDate,
        expirationDate: expirationDate,
        credentialID: certificationData.credentialID,
        credentialURL: certificationData.credentialURL,
        job_seeker_profile: profileId
      };

      const response = await apiClient.post(`/api/certifications`, {
        data: validData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add certification:', error);
      throw new Error('Failed to add certification');
    }
  },

  // Get job recommendations based on user profile
  getJobRecommendations: async (userId: number, limit = 5): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/job-recommendations?userId=${userId}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job recommendations:', error);
      throw new Error('Failed to fetch job recommendations');
    }
  },

  // Update user profile skills
  updateProfileSkills: async (profileId: number, skillIds: number[]): Promise<any> => {
    try {
      // For many-to-many relationships in Strapi, we need to use the connect format
      const response = await apiClient.put(`/api/job-seeker-profiles/${profileId}`, {
        data: {
          skills: {
            connect: skillIds.map(id => ({ id }))
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update profile skills:', error);
      throw new Error('Failed to update profile skills');
    }
  },
};

export const skillsApi = {
  // Get all skills with optional filters
  getSkills: async (params: any = {}): Promise<any> => {
    try {
      const queryString = buildSkillsQuery(params);
      const response = await apiClient.get(`/api/skills?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      throw new Error('Failed to fetch skills');
    }
  },

  // Create a new skill
  createSkill: async (skillData: { name: string; slug?: string; skill_category?: number }): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/skills`, {
        data: skillData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create skill:', error);
      throw new Error('Failed to create skill');
    }
  },

  // Get skill categories
  getSkillCategories: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/skill-categories?sort=name:asc`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch skill categories:', error);
      throw new Error('Failed to fetch skill categories');
    }
  },

  // Get popular skills (most used in job listings)
  getPopularSkills: async (limit = 20): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/skills?pagination[pageSize]=${limit}&sort=jobs.count:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch popular skills:', error);
      throw new Error('Failed to fetch popular skills');
    }
  }
};

export const industryApi = {
  // Get all industries
  getIndustries: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/industries?sort=name:asc`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch industries:', error);
      throw new Error('Failed to fetch industries');
    }
  }
};

export const notificationApi = {
  // Get user notifications with pagination
  getUserNotifications: async (userId: number, page = 1, pageSize = 10): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/notifications?filters[users_permissions_user][id][$eq]=${userId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=job,job.company,job_application&sort=createdAt:desc`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<any> => {
    try {
      const response = await apiClient.put(`/api/notifications/${notificationId}`, {
        data: {
          isRead: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<any> => {
    // This would typically be a custom endpoint in your Strapi backend
    try {
      const response = await apiClient.post(`/api/notifications/mark-all-read`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Get unread notification count
  getUnreadCount: async (userId: number): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/api/notifications?filters[users_permissions_user][id][$eq]=${userId}&filters[isRead][$eq]=false&pagination[pageSize]=1`
      );
      const data = response.data;
      return { count: data.meta.pagination.total };
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error);
      throw new Error('Failed to fetch unread notification count');
    }
  }
};