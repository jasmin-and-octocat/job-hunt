import { API_URL, apiClient } from './utils';
import axios from 'axios';

export interface AuthCredentials {
  identifier: string; // Username or email
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    role: {
      id: number;
      name: string;
      description: string;
      type: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface JobSeekerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  bio?: string;
  location?: string;
  jobPreferences?: 'remote' | 'on-site' | 'hybrid';
  salaryExpectations?: number;
  // Changed from number to object with connect for Strapi v4
  users_permissions_user?: number | { connect?: number[] };
}

export interface EmployerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNnumber?: string;
  designation?: string;
  linkedin?: string;
  // Changed from number to object with connect for Strapi v4
  users_permissions_user?: number | { connect?: number[] };
}

export interface CompanyData {
  name: string;
  description?: any;
  website?: string;
  location?: string;
  size?: string;
  foundedYear?: number;
  companyType?: string;
  socialMedia?: any;
  email?: string;
  phoneNumber?: string;
  industry?: number | { connect?: number[] };
}

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(`/api/auth/local`, credentials);
      
      // Save the token immediately after successful login
      if (response.data.jwt) {
        authToken.set(response.data.jwt);
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to login';
      throw new Error(message);
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(`/api/auth/local/register`, data);
      
      // Save the token immediately after successful registration
      if (response.data.jwt) {
        authToken.set(response.data.jwt);
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to register';
      throw new Error(message);
    }
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ ok: boolean }> => {
    try {
      await apiClient.post(`/api/auth/forgot-password`, data);
      return { ok: true };
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to send reset password email';
      throw new Error(message);
    }
  },

  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(`/api/auth/reset-password`, data);
      
      // Save the token if a new one is provided
      if (response.data.jwt) {
        authToken.set(response.data.jwt);
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to reset password';
      throw new Error(message);
    }
  },

  getMe: async (token?: string): Promise<any> => {
    try {
      // The issue might be with query parameter format
      // Using proper formatting with params object instead of query string
      const response = await apiClient.get(`/api/users/me`, {
        params: {
          populate: ['job_seeker_profile', 'employer_profile']
        }
      });
      return response.data;
    } catch (error: any) {
      // Clear token if unauthorized (401) - handled by apiClient interceptor
      console.error("Error in getMe:", error);
      throw error;
    }
  },

  // Create a job seeker profile
  createJobSeekerProfile: async (profileData: JobSeekerProfileData): Promise<any> => {
    if (!authToken.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure for Strapi v4
    const formattedData = { ...profileData };
    
    // If users_permissions_user is a number, convert to proper relation format
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    try {
      const response = await apiClient.post(`/api/job-seeker-profiles`, 
        { data: formattedData }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to create profile:', error);
      const message = error.response?.data?.error?.message || 'Failed to create job seeker profile';
      throw new Error(message);
    }
  },

  // Update a job seeker profile
  updateJobSeekerProfile: async (id: number, profileData: Partial<JobSeekerProfileData>): Promise<any> => {
    if (!authToken.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    try {
      const response = await apiClient.put(`/api/job-seeker-profiles/${id}`,
        { data: formattedData }
      );
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update job seeker profile';
      throw new Error(message);
    }
  },

  // Create an employer profile
  createEmployerProfile: async (profileData: EmployerProfileData): Promise<any> => {
    if (!authToken.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure for Strapi v4
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    try {
      const response = await apiClient.post(`/api/employer-profiles`,
        { data: formattedData }
      );
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create employer profile';
      throw new Error(message);
    }
  },

  // Update an employer profile
  updateEmployerProfile: async (id: number, profileData: Partial<EmployerProfileData>): Promise<any> => {
    if (!authToken.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    try {
      const response = await apiClient.put(`/api/employer-profiles/${id}`,
        { data: formattedData }
      );
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update employer profile';
      throw new Error(message);
    }
  },

  // Create a company
  createCompany: async (companyData: CompanyData): Promise<any> => {
    if (!authToken.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...companyData };
    if (typeof formattedData.industry === 'number') {
      formattedData.industry = {
        connect: [formattedData.industry]
      };
    }

    try {
      const response = await apiClient.post(`/api/companies`,
        { data: formattedData }
      );
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create company';
      throw new Error(message);
    }
  }
};

/**
 * Helper functions to manage JWT token in local storage
 */
export const authToken = {
  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token);
    }
  },
  
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  },
  
  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
    }
  },
  
  isAuthenticated: (): boolean => {
    return authToken.get() !== null;
  },
  
  // Utility to check if token is likely expired
  isTokenExpired: (): boolean => {
    const token = authToken.get();
    if (!token) return true;
    
    try {
      // JWT tokens have three parts separated by dots
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;
      
      // The middle part contains the payload including expiration time
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check if token is expired
      if (!payload.exp) return false; // If no expiration, assume it's valid
      
      // exp is in seconds, Date.now() is in milliseconds
      return payload.exp * 1000 < Date.now();
      
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if there's an error parsing
    }
  }
};

/**
 * Helper functions to manage user data in local storage
 */
export const authUser = {
  set: (user: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  
  get: (): any | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  },
  
  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
};

/**
 * Helper to get the authorization header with JWT token
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = authToken.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
};