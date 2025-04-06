"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi, authToken, authUser, AuthCredentials, RegisterData } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'employer' | 'job-seeker' | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Try to load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authUser.get();
      const token = authToken.get();
      
      if (token && storedUser) {
        try {
          // Optionally verify token validity with the backend
          const userData = await authApi.getMe(token);
          setUser(userData);
          
          // Check if user has a profile (employer or job seeker)
          if (userData.employer_profile) {
            setUserType('employer');
          } else if (userData.job_seeker_profile) {
            setUserType('job-seeker');
          }
        } catch (error) {
          // Token is invalid, clear auth state
          authToken.remove();
          authUser.remove();
        }
      }
      setLoading(false);
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
      } else if (response.user.job_seeker_profile) {
        setUserType('job-seeker');
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.username || response.user.email}!`,
      });
      
      router.push('/');
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
    setUser(null);
    setUserType(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    router.push('/');
  };

  // Calculate if the user has completed onboarding
  const hasCompletedOnboarding = !!(user && userType);

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