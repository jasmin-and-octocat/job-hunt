import { API_URL } from './utils';

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
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to login');
    }

    return response.json();
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to register');
    }

    return response.json();
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ ok: boolean }> => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to send reset password email');
    }

    return { ok: true };
  },

  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to reset password');
    }

    return response.json();
  },

  getMe: async (token: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/api/users/me?populate=job_seeker_profile,employer_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Clear token if unauthorized (401)
        if (response.status === 401) {
          authToken.remove();
          authUser.remove();
        }
        throw new Error('Failed to fetch user data');
      }

      return response.json();
    } catch (error) {
      console.error("Error in getMe:", error);
      throw error;
    }
  },

  // Create a job seeker profile
  createJobSeekerProfile: async (profileData: JobSeekerProfileData): Promise<any> => {
    const token = authToken.get();
    if (!token) {
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

    const response = await fetch(`${API_URL}/api/job-seeker-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: formattedData }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create profile:', error);
      throw new Error(error.error?.message || 'Failed to create job seeker profile');
    }

    return response.json();
  },

  // Update a job seeker profile
  updateJobSeekerProfile: async (id: number, profileData: Partial<JobSeekerProfileData>): Promise<any> => {
    const token = authToken.get();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    const response = await fetch(`${API_URL}/api/job-seeker-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: formattedData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update job seeker profile');
    }

    return response.json();
  },

  // Create an employer profile
  createEmployerProfile: async (profileData: EmployerProfileData): Promise<any> => {
    const token = authToken.get();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure for Strapi v4
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    const response = await fetch(`${API_URL}/api/employer-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: formattedData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create employer profile');
    }

    return response.json();
  },

  // Update an employer profile
  updateEmployerProfile: async (id: number, profileData: Partial<EmployerProfileData>): Promise<any> => {
    const token = authToken.get();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...profileData };
    if (typeof formattedData.users_permissions_user === 'number') {
      formattedData.users_permissions_user = {
        connect: [formattedData.users_permissions_user]
      };
    }

    const response = await fetch(`${API_URL}/api/employer-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: formattedData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update employer profile');
    }

    return response.json();
  },

  // Create a company
  createCompany: async (companyData: CompanyData): Promise<any> => {
    const token = authToken.get();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Format the data with proper relation structure if needed
    const formattedData = { ...companyData };
    if (typeof formattedData.industry === 'number') {
      formattedData.industry = {
        connect: [formattedData.industry]
      };
    }

    const response = await fetch(`${API_URL}/api/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: formattedData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create company');
    }

    return response.json();
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
  
  // New utility to check if token is likely expired
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