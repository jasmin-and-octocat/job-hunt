import { apiClient } from '../utils';

interface EmployerProfileParams {
  id: number;
}

/**
 * Fetch employer profile by ID
 * @param params Object containing employer profile ID
 * @returns Promise with employer profile data
 */
export async function getEmployerProfile(params: EmployerProfileParams): Promise<any> {
  try {
    const response = await apiClient.get(
      `/api/employer-profiles/${params.id}?populate=*`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employer profile:', error);
    throw new Error('Failed to fetch employer profile');
  }
}

/**
 * Create a new employer profile
 * @param employerData Data for the new employer profile
 * @returns Promise with created employer profile data
 */
export async function createEmployerProfile(employerData: any): Promise<any> {
  try {
    const response = await apiClient.post('/api/employer-profiles', {
      data: employerData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create employer profile:', error);
    throw new Error('Failed to create employer profile');
  }
}

/**
 * Update an employer profile
 * @param id Employer profile ID to update
 * @param employerData Updated employer profile data
 * @returns Promise with updated employer profile data
 */
export async function updateEmployerProfile(id: number, employerData: any): Promise<any> {
  try {
    const response = await apiClient.put(`/api/employer-profiles/${id}`, {
      data: employerData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update employer profile:', error);
    throw new Error('Failed to update employer profile');
  }
}

/**
 * Get company profile associated with an employer profile
 * @param id Employer profile ID
 * @returns Promise with company data
 */
export async function getEmployerCompany(id: number): Promise<any> {
  try {
    const response = await apiClient.get(
      `/api/employer-profiles/${id}?populate=company,company.logo,company.industry`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employer company:', error);
    throw new Error('Failed to fetch employer company');
  }
}