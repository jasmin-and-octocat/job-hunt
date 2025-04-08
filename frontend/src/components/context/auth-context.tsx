"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, authToken, authUser, AuthCredentials, RegisterData } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { getJobSeekerProfile } from '@/lib/api/job-seeker-profile';
import { getEmployerProfile } from '@/lib/api/employer-profile';

interface AuthContextValue {
  user: any | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userType: 'employer' | 'job-seeker' | null;
  setUserType: (type: 'employer' | 'job-seeker') => void;
  setOnboardingComplete: (complete: boolean) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// List of paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/companies',
  '/jobs',
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'employer' | 'job-seeker' | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Function to refresh user data from the API
  const refreshUserData = async () => {
    const token = authToken.get();
    
    if (!token) {
      setUser(null);
      setUserType(null);
      setOnboardingComplete(false);
      return null;
    }
    
    try {
      const userData = await authApi.getMe(token);
      
      // Important: Set the user state before any other operations
      setUser(userData);
      
      // Ensure user data is stored in localStorage for persistence
      authUser.set(userData);
      
      // Check if user has a profile (employer or job seeker)
      if (userData.employer_profile) {
        setUserType('employer');
        if (userData.employer_profile.id) {
          setOnboardingComplete(true);
          localStorage.setItem('onboardingComplete', 'true');
        }
      } else if (userData.job_seeker_profile) {
        setUserType('job-seeker');
        if (userData.job_seeker_profile.id) {
          setOnboardingComplete(true);
          localStorage.setItem('onboardingComplete', 'true');
        }
      } else {
        setOnboardingComplete(false);
        localStorage.removeItem('onboardingComplete');
      }
      
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Token is invalid, clear auth state
      authToken.remove();
      authUser.remove();
      localStorage.removeItem('onboardingComplete');
      setUser(null);
      setUserType(null);
      setOnboardingComplete(false);
      return null;
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async (userId: number, userType: string) => {
    try {
      if (userType === 'job-seeker') {
        // Use the API function with correct field names
        const response = await getJobSeekerProfile({ id: userId });
        return response.data;
      } else if (userType === 'employer') {
        // Use the employer profile API function
        const response = await getEmployerProfile({ id: userId });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Try to load user from localStorage on mount first, then validate with API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authToken.get();
        const storedUser = authUser.get();
        
        // Set the stored user immediately to prevent flash of unauthenticated state
        if (storedUser) {
          setUser(storedUser);
          
          // Set user type based on stored user data
          if (storedUser.employer_profile) {
            setUserType('employer');
            setOnboardingComplete(!!storedUser.employer_profile.id);
          } else if (storedUser.job_seeker_profile) {
            setUserType('job-seeker');
            setOnboardingComplete(!!storedUser.job_seeker_profile.id);
          }
        }
        
        // Only attempt to refresh if there's a token
        if (token) {
          // Silently validate without disrupting the UI
          await refreshUserData();
        } else if (storedUser) {
          // Inconsistent state - user data but no token
          authUser.remove();
          localStorage.removeItem('onboardingComplete');
          setUser(null);
          setUserType(null);
          setOnboardingComplete(false);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      authToken.set(response.jwt);
      authUser.set(response.user);
      setUser(response.user);
      
      // Check if user has a profile
      if (response.user.employer_profile) {
        setUserType('employer');
        setOnboardingComplete(true);
        localStorage.setItem('onboardingComplete', 'true');
      } else if (response.user.job_seeker_profile) {
        setUserType('job-seeker');
        setOnboardingComplete(true);
        localStorage.setItem('onboardingComplete', 'true');
      } else {
        setOnboardingComplete(false);
        localStorage.removeItem('onboardingComplete');
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.username || response.user.email}!`,
      });
      
      // If onboarding is not complete, redirect to onboarding
      if (response.user.employer_profile || response.user.job_seeker_profile) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      authToken.set(response.jwt);
      authUser.set(response.user);
      setUser(response.user);
      setOnboardingComplete(false);
      localStorage.removeItem('onboardingComplete');
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
      
      // Redirect to onboarding instead of home page
      router.push('/onboarding');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authToken.remove();
    authUser.remove();
    localStorage.removeItem('onboardingComplete');
    setUser(null);
    setUserType(null);
    setOnboardingComplete(false);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    router.push('/');
  };

  // Calculate if the user has completed onboarding
  const hasCompletedOnboarding = onboardingComplete;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        userType,
        setUserType,
        refreshUserData,
        setOnboardingComplete: (complete) => {
          setOnboardingComplete(complete);
          if (complete) {
            localStorage.setItem('onboardingComplete', 'true');
          } else {
            localStorage.removeItem('onboardingComplete');
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};