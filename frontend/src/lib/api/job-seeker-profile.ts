import { apiClient } from '../utils';

interface JobSeekerProfileParams {
  id: number;
}

/**
 * Fetch job seeker profile by ID
 * @param params Object containing job seeker profile ID
 * @returns Promise with job seeker profile data
 */
export async function getJobSeekerProfile(params: JobSeekerProfileParams): Promise<any> {
  try {
    const response = await apiClient.get(
      `/api/job-seeker-profiles/${params.id}?populate[0]=skills&populate[1]=certifications&populate[2]=educations&populate[3]=experiences&populate[4]=resume&populate[5]=users_permissions_user`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch job seeker profile:', error);
    throw new Error('Failed to fetch job seeker profile');
  }
}

/**
 * Fetch job seeker profile by user ID
 * @param userId ID of the authenticated user
 * @returns Promise with job seeker profile data
 */
export async function getJobSeekerProfileByUserId(userId: number): Promise<any> {
  try {
    const response = await apiClient.get(
      `/api/job-seeker-profiles?filters[users_permissions_user][id][$eq]=${userId}&populate[0]=skills&populate[1]=certifications&populate[2]=educations&populate[3]=experiences&populate[4]=resume&populate[5]=users_permissions_user`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch job seeker profile by user ID:', error);
    throw new Error('Failed to fetch job seeker profile');
  }
}

/**
 * Create a new job seeker profile
 * @param profileData Data for the new job seeker profile
 * @returns Promise with created job seeker profile data
 */
export async function createJobSeekerProfile(profileData: any): Promise<any> {
  try {
    const response = await apiClient.post('/api/job-seeker-profiles', {
      data: profileData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create job seeker profile:', error);
    throw new Error('Failed to create job seeker profile');
  }
}

/**
 * Update a job seeker profile
 * @param id Job seeker profile ID to update
 * @param profileData Updated job seeker profile data
 * @returns Promise with updated job seeker profile data
 */
export async function updateJobSeekerProfile(id: number, profileData: any): Promise<any> {
  try {
    const response = await apiClient.put(`/api/job-seeker-profiles/${id}`, {
      data: profileData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update job seeker profile:', error);
    throw new Error('Failed to update job seeker profile');
  }
}

/**
 * Get job seeker skills
 * @param id Job seeker profile ID
 * @returns Promise with skills data
 */
export async function getJobSeekerSkills(id: number): Promise<any> {
  try {
    const response = await apiClient.get(
      `/api/job-seeker-profiles/${id}?populate=skills`
    );
    return response.data.data.attributes.skills;
  } catch (error) {
    console.error('Failed to fetch job seeker skills:', error);
    throw new Error('Failed to fetch job seeker skills');
  }
}

/**
 * Update job seeker profile skills
 * @param id Job seeker profile ID
 * @param skillIds Array of skill IDs
 * @returns Promise with updated profile data
 */
export async function updateJobSeekerSkills(id: number, skillIds: number[]): Promise<any> {
  try {
    const response = await apiClient.put(`/api/job-seeker-profiles/${id}`, {
      data: {
        skills: {
          connect: skillIds.map(skillId => ({ id: skillId }))
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update job seeker skills:', error);
    throw new Error('Failed to update job seeker skills');
  }
}