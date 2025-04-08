import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import { authToken } from './auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base API URL for Strapi
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Create authenticated axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token at request time to ensure it's the latest
    const token = authToken.get();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear invalid token
      authToken.remove();
    }
    return Promise.reject(error);
  }
);

// Fetcher function for SWR
export const fetcher = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  
  return res.json() as Promise<T>
}

// Format date to relative time (e.g., "2 days ago")
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}

// Format date display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format relative time (e.g., "2 days ago")
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

// Convert snake case to capitalized words
export function formatCamelCaseToWords(str: string): string {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Format salary display
export function formatSalary(min: number, max?: number): string {
  const options = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 };
  
  if (max && max > min) {
    return `${min.toLocaleString('en-US', options)} - ${max.toLocaleString('en-US', options)}`;
  }
  
  return min.toLocaleString('en-US', options);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
